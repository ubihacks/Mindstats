import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';

import { addDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import type { Candidate, HiringRole, RolesState } from '../../types';

// Helper: get company domain from user profile id
async function getCompanyDomain(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('profiles')
    .select('company_domain')
    .eq('id', userId)
    .maybeSingle();
  return data?.company_domain ?? null;
}

// Helper: get company row (id + credits + domain) by user id
async function getCompany(userId: string) {
  const domain = await getCompanyDomain(userId);
  if (!domain) return null;
  const { data } = await supabase
    .from('companies')
    .select('id, credits, domain')
    .eq('domain', domain)
    .maybeSingle();
  return data ?? null;
}

async function deductCredit(domain: string, currentCredits: number) {
  return supabase
    .from('companies')
    .update({ credits: currentCredits - 1 })
    .eq('domain', domain);
}

async function refundCredit(domain: string, currentCredits: number) {
  return supabase
    .from('companies')
    .update({ credits: currentCredits })
    .eq('domain', domain);
}

// Map Supabase snake_case response to camelCase HiringRole
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRole(r: any): HiringRole {
  return {
    id: r.id,
    title: r.title,
    jobLevel: r.job_level,
    function: r.function,
    uniqueCode: r.unique_code,
    companyId: r.company_id,
    hiringManagerId: r.hiring_manager_id ?? null,
    hiringManagerEmail: r.hiring_manager_email ?? null,
    hiringManagerName: r.hiring_manager_name ?? null,
    hiringManagerStatus: r.hiring_manager_status ?? 'IDLE',
    behaviouralDemand: r.behavioural_demand ?? null,
    createdAt: r.created_at,
    candidates: (r.candidates ?? []).map((c: any) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      inviteToken: c.invite_token,
      inviteStatus: c.invite_status,
      invitedAt: c.invited_at,
      expiresAt: c.expires_at,
      reportUrl: c.report_url ?? null,
      shareReportWithCandidate: c.share_report_with_candidate,
    })),
  };
}

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const fetchRoles = createAsyncThunk(
  'roles/fetchAll',
  async (userId: string, { rejectWithValue }) => {
    try {
      const company = await getCompany(userId);
      if (!company) return rejectWithValue('Company not found');

      const { data, error } = await supabase
        .from('hiring_roles')
        .select(`*, candidates(*)`)
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) return rejectWithValue(error.message);
      return (data as any[]).map(mapRole);
    } catch (err: unknown) {
      return rejectWithValue('Failed to load roles');
    }
  },
  {
    // Skip if already loading to prevent duplicate concurrent calls
    condition: (_, { getState }) => {
      const state = getState() as { roles: RolesState };
      return state.roles.status !== 'loading';
    },
  }
);

export const createRole = createAsyncThunk(
  'roles/create',
  async (
    payload: { title: string; jobLevel: string; function: string; companyId: string },
    { rejectWithValue }
  ) => {
    try {
      const company = await getCompany(payload.companyId);
      if (!company) return rejectWithValue('Company not found');

      const uniqueCode = uuidv4().slice(0, 8).toUpperCase();

      const { data, error } = await supabase
        .from('hiring_roles')
        .insert({
          title: payload.title,
          job_level: payload.jobLevel,
          function: payload.function,
          company_id: company.id,
          unique_code: uniqueCode,
          hiring_manager_status: 'IDLE',
        })
        .select()
        .single();

      if (error) return rejectWithValue(error.message);
      return mapRole(data);
    } catch (err: unknown) {
      return rejectWithValue('Failed to create role');
    }
  }
);

export const inviteHiringManager = createAsyncThunk(
  'roles/inviteHiringManager',
  async (
    payload: { roleId: string; email: string; name: string; companyId: string },
    { rejectWithValue }
  ) => {
    try {
      // Deduct 1 credit for the invitation
      const company = await getCompany(payload.companyId);
      if (!company || company.credits < 1) {
        return rejectWithValue('Insufficient credits. Please purchase more credits.');
      }

      const { error: creditError } = await deductCredit(company.domain, company.credits);
      if (creditError) return rejectWithValue('Failed to deduct credit');

      const { data, error } = await supabase
        .from('hiring_roles')
        .update({
          hiring_manager_email: payload.email,
          hiring_manager_name: payload.name,
          hiring_manager_status: 'IN_PROGRESS',
        })
        .eq('id', payload.roleId)
        .select()
        .single();

      if (error) return rejectWithValue(error.message);
      return mapRole(data);
    } catch (err: unknown) {
      return rejectWithValue('Failed to invite hiring manager');
    }
  }
);

export const inviteCandidate = createAsyncThunk(
  'roles/inviteCandidate',
  async (
    payload: {
      roleId: string;
      name: string;
      email: string;
      companyId: string;
      shareReport: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const company = await getCompany(payload.companyId);
      if (!company || company.credits < 1) {
        return rejectWithValue('Insufficient credits. Please purchase more credits.');
      }

      const { error: creditError } = await deductCredit(company.domain, company.credits);
      if (creditError) return rejectWithValue('Failed to deduct credit');

      const inviteToken = uuidv4();
      const expiresAt = addDays(new Date(), 14).toISOString();

      const { data, error } = await supabase
        .from('candidates')
        .insert({
          role_id: payload.roleId,
          name: payload.name,
          email: payload.email,
          invite_token: inviteToken,
          invite_status: 'PENDING',
          invited_at: new Date().toISOString(),
          expires_at: expiresAt,
          share_report_with_candidate: payload.shareReport,
        })
        .select()
        .single();

      if (error) {
        // Refund credit on failure
        await refundCredit(company.domain, company.credits);
        return rejectWithValue(error.message);
      }

      return { roleId: payload.roleId, candidate: data as Candidate };
    } catch (err: unknown) {
      return rejectWithValue('Failed to invite candidate');
    }
  }
);

export const refundExpiredCredits = createAsyncThunk(
  'roles/refundExpiredCredits',
  async (companyId: string, { rejectWithValue }) => {
    try {
      const now = new Date().toISOString();

      const { data: expiredCandidates, error: fetchError } = await supabase
        .from('candidates')
        .select('id, role_id')
        .eq('invite_status', 'PENDING')
        .lt('expires_at', now);

      if (fetchError) return rejectWithValue(fetchError.message);
      if (!expiredCandidates || expiredCandidates.length === 0) return 0;

      const { error: updateError } = await supabase
        .from('candidates')
        .update({ invite_status: 'EXPIRED' })
        .in('id', expiredCandidates.map((c) => c.id));

      if (updateError) return rejectWithValue(updateError.message);

      const company = await getCompany(companyId);
      if (company) {
        await supabase
          .from('companies')
          .update({ credits: company.credits + expiredCandidates.length })
          .eq('domain', company.domain);
      }

      return expiredCandidates.length;
    } catch (err: unknown) {
      return rejectWithValue('Failed to refund expired credits');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const initialState: RolesState = {
  roles: [],
  selectedRoleId: null,
  status: 'idle',
  error: null,
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    selectRole(state, action: PayloadAction<string | null>) {
      state.selectedRoleId = action.payload;
    },
    clearRolesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
        state.status = 'idle';
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      });

    builder
      .addCase(createRole.pending, (state) => { state.status = 'loading'; })
      .addCase(createRole.fulfilled, (state, action) => {
        state.roles.unshift(action.payload);
        state.status = 'idle';
      })
      .addCase(createRole.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      });

    builder
      .addCase(inviteHiringManager.fulfilled, (state, action) => {
        const idx = state.roles.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.roles[idx] = action.payload;
      });

    builder
      .addCase(inviteCandidate.fulfilled, (state, action) => {
        const role = state.roles.find((r) => r.id === action.payload.roleId);
        if (role) role.candidates.push(action.payload.candidate);
      });
  },
});

export const { selectRole, clearRolesError } = rolesSlice.actions;
export default rolesSlice.reducer;
