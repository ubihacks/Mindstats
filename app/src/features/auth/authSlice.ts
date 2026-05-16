import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';
import type { AuthState, AuthUser } from '../../types';


const BLOCKED_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'icloud.com', 'protonmail.com', 'aol.com', 'live.com', 'me.com',
];

// Reserved internal domain — only creatable directly in Supabase, never via the app
const RESERVED_DOMAINS = ['mindstat.internal'];

export const isCompanyEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  return !BLOCKED_DOMAINS.includes(domain) && !RESERVED_DOMAINS.includes(domain);
};

export const getEmailDomain = (email: string): string =>
  email.split('@')[1]?.toLowerCase() ?? '';

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    payload: {
      email: string;
      password: string;
      companyName: string;
      companyWebsite: string;
    },
    { rejectWithValue }
  ) => {
    try {
      if (!isCompanyEmail(payload.email)) {
        return rejectWithValue('Only professional company email addresses are allowed.');
      }

      const domain = getEmailDomain(payload.email);

      // isFirstDomainUser is determined server-side by the handle_new_user trigger.
      // We cannot check profiles here — no auth session yet, RLS blocks the query.
      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            company_name: payload.companyName,
            company_website: payload.companyWebsite,
            company_domain: domain,
          },
        },
      });

      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: unknown) {
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    payload: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      if (!isCompanyEmail(payload.email)) {
        return rejectWithValue('Only professional company email addresses are allowed.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

      if (error || !data.user) return rejectWithValue(error?.message ?? 'Login failed');

      // Fetch profile in the same thunk so user is set atomically
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      const meta = data.user.user_metadata ?? {};
      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email ?? '',
        companyName:    profile?.company_name    ?? meta.company_name    ?? '',
        companyWebsite: profile?.company_website ?? meta.company_website ?? '',
        companyDomain:  profile?.company_domain  ?? meta.company_domain  ?? '',
        role:           profile?.role            ?? (meta.is_first_domain_user ? 'ADMIN' : 'HIRING_MANAGER'),
        isEmailVerified: !!data.user.email_confirmed_at,
      };

      return authUser;
    } catch (err: unknown) {
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await supabase.auth.signOut();
});

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return rejectWithValue('Not authenticated');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) return rejectWithValue(profileError.message);

      // If no DB profile yet (trigger didn't fire), build from user_metadata as fallback
      const meta = user.user_metadata ?? {};
      const authUser: AuthUser = {
        id: user.id,
        email: user.email ?? '',
        companyName:    profile?.company_name    ?? meta.company_name    ?? '',
        companyWebsite: profile?.company_website ?? meta.company_website ?? '',
        companyDomain:  profile?.company_domain  ?? meta.company_domain  ?? '',
        role:           profile?.role            ?? (meta.is_first_domain_user ? 'ADMIN' : 'HIRING_MANAGER'),
        isEmailVerified: !!user.email_confirmed_at,
      };

      return authUser;
    } catch (err: unknown) {
      return rejectWithValue('Failed to fetch user');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload as AuthUser;
        state.status = 'idle';
        state.initialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.status = 'idle';
    });

    // Fetch current user
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload as AuthUser;
        state.status = 'idle';
        state.initialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.status = 'idle';
        state.initialized = true;
        // Don't set error — rejection just means 'not logged in'
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
