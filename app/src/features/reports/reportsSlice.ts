import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';
import type { ReportsState, Report, AssessmentResult } from '../../types';


// ─── Thunks ──────────────────────────────────────────────────────────────────

export const fetchReports = createAsyncThunk(
  'reports/fetchAll',
  async (companyId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('company_id', companyId)
        .order('uploaded_at', { ascending: false });

      if (error) return rejectWithValue(error.message);
      return data as Report[];
    } catch (err: unknown) {
      return rejectWithValue('Failed to load reports');
    }
  }
);

export const uploadReport = createAsyncThunk(
  'reports/upload',
  async (
    payload: {
      file: File;
      roleId: string;
      candidateId: string | null;
      companyId: string;
      uploadedBy: string;
      shareWithCandidate: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const fileExt = payload.file.name.split('.').pop()?.toLowerCase();
      const filePath = `reports/${payload.companyId}/${payload.roleId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('mindstat-reports')
        .upload(filePath, payload.file, { upsert: false });

      if (uploadError) return rejectWithValue(uploadError.message);

      const { data: urlData } = supabase.storage
        .from('mindstat-reports')
        .getPublicUrl(filePath);

      const fileType = fileExt === 'pdf' ? 'PDF' : 'EXCEL';

      const { data, error } = await supabase
        .from('reports')
        .insert({
          role_id: payload.roleId,
          candidate_id: payload.candidateId,
          company_id: payload.companyId,
          file_url: urlData.publicUrl,
          file_type: fileType,
          uploaded_by: payload.uploadedBy,
          uploaded_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) return rejectWithValue(error.message);

      // Write report_url back to the candidate row so they can view it via invite link
      if (payload.candidateId && payload.shareWithCandidate) {
        await supabase
          .from('candidates')
          .update({ report_url: urlData.publicUrl })
          .eq('id', payload.candidateId);
      }

      return data as Report;
    } catch (err: unknown) {
      return rejectWithValue('Failed to upload report');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

export const fetchAssessmentResults = createAsyncThunk(
  'reports/fetchAssessmentResults',
  async (companyId: string, { rejectWithValue }) => {
    try {
      // Fetch all CANDIDATE assessment responses for roles belonging to this company
      const { data: roles, error: rolesErr } = await supabase
        .from('hiring_roles')
        .select('id, title')
        .eq('company_id', companyId);

      if (rolesErr) return rejectWithValue(rolesErr.message);
      if (!roles || roles.length === 0) return [] as AssessmentResult[];

      const roleIds = roles.map((r) => r.id);

      const { data, error } = await supabase
        .from('assessment_responses')
        .select('id, role_id, respondent_id, assessment_type, disc_scores, submitted_at')
        .in('role_id', roleIds)
        .eq('assessment_type', 'CANDIDATE')
        .order('submitted_at', { ascending: false });

      if (error) return rejectWithValue(error.message);

      // Enrich with candidate name/email from candidates table
      const { data: candidates } = await supabase
        .from('candidates')
        .select('invite_token, name, email')
        .in('role_id', roleIds);

      const roleMap = Object.fromEntries(roles.map((r) => [r.id, r.title]));
      const candidateMap = Object.fromEntries(
        (candidates ?? []).map((c) => [c.invite_token, { name: c.name, email: c.email }])
      );

      return (data ?? []).map((row) => ({
        id:             row.id,
        roleId:         row.role_id,
        respondentId:   row.respondent_id,
        assessmentType: row.assessment_type,
        discScores:     row.disc_scores ?? null,
        submittedAt:    row.submitted_at,
        roleTitle:      roleMap[row.role_id] ?? '—',
        candidateName:  candidateMap[row.respondent_id]?.name ?? row.respondent_id,
        candidateEmail: candidateMap[row.respondent_id]?.email ?? '',
      })) as AssessmentResult[];
    } catch (err: unknown) {
      return rejectWithValue('Failed to load assessment results');
    }
  }
);

const initialState: ReportsState = {
  reports: [],
  assessmentResults: [],
  resultsStatus: 'idle',
  status: 'idle',
  error: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.reports = action.payload;
        state.status = 'idle';
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      });

    builder
      .addCase(uploadReport.pending, (state) => { state.status = 'loading'; })
      .addCase(uploadReport.fulfilled, (state, action) => {
        state.reports.unshift(action.payload);
        state.status = 'success';
      })
      .addCase(uploadReport.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchAssessmentResults.pending, (state) => { state.resultsStatus = 'loading'; })
      .addCase(fetchAssessmentResults.fulfilled, (state, action) => {
        state.assessmentResults = action.payload as AssessmentResult[];
        state.resultsStatus = 'idle';
      })
      .addCase(fetchAssessmentResults.rejected, (state, action) => {
        state.resultsStatus = 'error';
        state.error = action.payload as string;
      });
  },
});

export default reportsSlice.reducer;
