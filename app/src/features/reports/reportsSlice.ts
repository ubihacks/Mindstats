import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';
import type { ReportsState, Report } from '../../types';


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
      return data as Report;
    } catch (err: unknown) {
      return rejectWithValue('Failed to upload report');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const initialState: ReportsState = {
  reports: [],
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
  },
});

export default reportsSlice.reducer;
