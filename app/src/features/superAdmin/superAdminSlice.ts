import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';
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

export interface SuperAdminState {
  companies: CompanyOverview[];
  status: UIStatus;
  error: string | null;
}

const initialState: SuperAdminState = {
  companies: [],
  status: 'idle',
  error: null,
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

const superAdminSlice = createSlice({
  name: 'superAdmin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCompanies.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllCompanies.fulfilled, (state, action) => {
        state.status = 'success';
        state.companies = action.payload;
      })
      .addCase(fetchAllCompanies.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      })
      .addCase(updateCompanyCredits.fulfilled, (state, action) => {
        const co = state.companies.find((c) => c.id === action.payload.companyId);
        if (co) co.credits = action.payload.credits;
      });
  },
});

export default superAdminSlice.reducer;
