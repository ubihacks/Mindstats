import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase, supabaseAdmin } from '../../lib/supabaseClient';
import type { UIStatus } from '../../types';

export interface CompanyOverview {
  id: string;
  name: string;
  domain: string;
  website: string;
  currentPlan: string | null;
  paymentCycle: string;
  credits: number;
  usedCredits: number;
  createdAt: string;
  userCount: number;
  roleCount: number;
}

export interface UserProfile {
  id: string;
  email: string;
  companyName: string;
  companyDomain: string;
  role: string;
  isFirstDomainUser: boolean;
  createdAt: string;
}

export interface SuperAdminState {
  companies:    CompanyOverview[];
  users:        UserProfile[];
  status:       UIStatus;
  usersStatus:  UIStatus;
  error:        string | null;
}

const initialState: SuperAdminState = {
  companies:   [],
  users:       [],
  status:      'idle',
  usersStatus: 'idle',
  error:       null,
};

export const fetchAllCompanies = createAsyncThunk(
  'superAdmin/fetchAllCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const { data: companies, error: compErr } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (compErr) return rejectWithValue(compErr.message);

      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('company_domain');

      if (profErr) return rejectWithValue(profErr.message);

      const { data: roles, error: rolesErr } = await supabase
        .from('hiring_roles')
        .select('company_id');

      if (rolesErr) return rejectWithValue(rolesErr.message);

      const userCountByDomain: Record<string, number> = {};
      (profiles ?? []).forEach((p: { company_domain: string }) => {
        userCountByDomain[p.company_domain] = (userCountByDomain[p.company_domain] ?? 0) + 1;
      });

      const roleCountByCompany: Record<string, number> = {};
      (roles ?? []).forEach((r: { company_id: string }) => {
        roleCountByCompany[r.company_id] = (roleCountByCompany[r.company_id] ?? 0) + 1;
      });

      return (companies ?? []).map((c: Record<string, unknown>) => ({
        id:           c.id           as string,
        name:         c.name         as string,
        domain:       c.domain       as string,
        website:      c.website      as string,
        currentPlan:  c.current_plan as string | null,
        paymentCycle: c.payment_cycle as string,
        credits:      c.credits      as number,
        usedCredits:  c.used_credits as number,
        createdAt:    c.created_at   as string,
        userCount:    userCountByDomain[c.domain as string] ?? 0,
        roleCount:    roleCountByCompany[c.id as string] ?? 0,
      })) as CompanyOverview[];
    } catch {
      return rejectWithValue('Failed to fetch companies');
    }
  }
);

export const updateCompanyCredits = createAsyncThunk(
  'superAdmin/updateCredits',
  async (payload: { companyId: string; credits: number }, { rejectWithValue }) => {
    const { error } = await supabase
      .from('companies')
      .update({ credits: payload.credits })
      .eq('id', payload.companyId);
    if (error) return rejectWithValue(error.message);
    return payload;
  }
);

export const createCompany = createAsyncThunk(
  'superAdmin/createCompany',
  async (
    payload: { name: string; website: string; domain: string; credits: number; plan: string },
    { rejectWithValue }
  ) => {
    const { data, error } = await supabase
      .from('companies')
      .insert({
        name:          payload.name.trim(),
        website:       payload.website.trim(),
        domain:        payload.domain.trim().toLowerCase(),
        credits:       payload.credits,
        current_plan:  payload.plan || null,
        payment_cycle: 'MONTHLY',
        used_credits:  0,
      })
      .select()
      .single();
    if (error) return rejectWithValue(error.message);
    return {
      id:           data.id,
      name:         data.name,
      domain:       data.domain,
      website:      data.website,
      currentPlan:  data.current_plan,
      paymentCycle: data.payment_cycle,
      credits:      data.credits,
      usedCredits:  data.used_credits,
      createdAt:    data.created_at,
      userCount:    0,
      roleCount:    0,
    } as CompanyOverview;
  }
);

export const fetchAllUsers = createAsyncThunk(
  'superAdmin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return rejectWithValue(error.message);
      return (data ?? []).map((p: Record<string, unknown>) => ({
        id:                p.id                  as string,
        email:             p.email               as string,
        companyName:       p.company_name         as string,
        companyDomain:     p.company_domain       as string,
        role:              p.role                 as string,
        isFirstDomainUser: p.is_first_domain_user as boolean,
        createdAt:         p.created_at           as string,
      })) as UserProfile[];
    } catch {
      return rejectWithValue('Failed to fetch users');
    }
  }
);

export const createUser = createAsyncThunk(
  'superAdmin/createUser',
  async (
    payload: { email: string; password: string; companyName: string; companyDomain: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      if (!supabaseAdmin) return rejectWithValue('VITE_SUPABASE_SERVICE_ROLE_KEY is not configured.');

      const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
        email: payload.email,
        password: payload.password,
        email_confirm: true,
      });
      if (authErr) return rejectWithValue(authErr.message);

      const userId = authData.user.id;
      const { data, error: profErr } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id:                  userId,
          email:               payload.email,
          company_name:        payload.companyName,
          company_domain:      payload.companyDomain.trim().toLowerCase(),
          role:                payload.role,
          is_first_domain_user: false,
        })
        .select()
        .single();
      if (profErr) return rejectWithValue(profErr.message);

      return {
        id:                data.id,
        email:             data.email,
        companyName:       data.company_name,
        companyDomain:     data.company_domain,
        role:              data.role,
        isFirstDomainUser: data.is_first_domain_user,
        createdAt:         data.created_at,
      } as UserProfile;
    } catch {
      return rejectWithValue('Failed to create user');
    }
  }
);

const superAdminSlice = createSlice({
  name: 'superAdmin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCompanies.pending,  (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchAllCompanies.fulfilled,(state, action) => { state.status = 'success'; state.companies = action.payload; })
      .addCase(fetchAllCompanies.rejected, (state, action) => { state.status = 'error'; state.error = action.payload as string; })
      .addCase(updateCompanyCredits.fulfilled, (state, action) => {
        const co = state.companies.find((c) => c.id === action.payload.companyId);
        if (co) co.credits = action.payload.credits;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.companies.unshift(action.payload);
      })
      .addCase(fetchAllUsers.pending,  (state) => { state.usersStatus = 'loading'; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => { state.usersStatus = 'success'; state.users = action.payload; })
      .addCase(fetchAllUsers.rejected, (state) => { state.usersStatus = 'error'; })
      .addCase(createUser.fulfilled, (state, action) => { state.users.unshift(action.payload); });
  },
});

export default superAdminSlice.reducer;

