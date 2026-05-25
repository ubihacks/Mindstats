import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import  { supabase } from "../../lib/supabaseClient";
import type { PlanType, Plan, PaymentCycle, BillingState } from "../../types";


export const PLANS: Record<PlanType, Plan> = {
  ON_DEMAND: {
    type: 'ON_DEMAND',
    name: 'On Demand',
    creditsPerMonth: 1,
    maxUsers: 2,
    maxRolloverCredits: 0,
    priceMonthly: 99,
    priceYearly: 99 * 12,
    supportLabel: 'Email Support',
    responseTime: '3 business days',
  },
  STEADY: {
    type: 'STEADY',
    name: 'Steady',
    creditsPerMonth: 5,
    maxUsers: 4,
    maxRolloverCredits: 5,
    priceMonthly: 289,
    priceYearly: 3326.4,
    supportLabel: 'Email Support',
    responseTime: '48 hours',
  },
  GROWTH: {
    type: 'GROWTH',
    name: 'Growth',
    creditsPerMonth: 15,
    maxUsers: 8,
    maxRolloverCredits: 30,
    priceMonthly: 742,
    priceYearly: 8553.6,
    supportLabel: 'Priority Email',
    responseTime: '24 hours',
  },
  SCALE: {
    type: 'SCALE',
    name: 'Scale',
    creditsPerMonth: 30,
    maxUsers: 20,
    maxRolloverCredits: 90,
    priceMonthly: 1260,
    priceYearly: 14256,
    supportLabel: 'Dedicated Support',
    responseTime: '12 hours',
  },
};

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const fetchBilling = createAsyncThunk(
  'billing/fetch',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Get the user's company_domain from their profile first
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_domain')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) return rejectWithValue(profileError.message);
      if (!profile) return rejectWithValue('Profile not found');

      const { data, error } = await supabase
        .from('companies')
        .select('current_plan, payment_cycle, credits, used_credits')
        .eq('domain', profile.company_domain)
        .maybeSingle();

      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: unknown) {
      return rejectWithValue('Failed to fetch billing info');
    }
  }
);

export const purchasePlan = createAsyncThunk(
  'billing/purchase',
  async (
    payload: { companyId: string; plan: PlanType; cycle: PaymentCycle },
    { rejectWithValue }
  ) => {
    try {
      const selectedPlan = PLANS[payload.plan];
      const credits =
        payload.cycle === 'YEARLY'
          ? selectedPlan.creditsPerMonth * 12
          : selectedPlan.creditsPerMonth;

      // Get domain from profile first
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_domain')
        .eq('id', payload.companyId)
        .maybeSingle();

      if (profileError || !profile) return rejectWithValue('Profile not found');

      const { error } = await supabase
        .from('companies')
        .update({
          current_plan: payload.plan,
          payment_cycle: payload.cycle,
          credits,
        })
        .eq('domain', profile.company_domain);

      if (error) return rejectWithValue(error.message);
      return { plan: payload.plan, cycle: payload.cycle, credits };
    } catch (err: unknown) {
      return rejectWithValue('Failed to purchase plan');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const initialState: BillingState = {
  currentPlan: null,
  paymentCycle: 'MONTHLY',
  credits: 0,
  usedCredits: 0,
  status: 'idle',
  error: null,
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setPaymentCycle(state, action: PayloadAction<PaymentCycle>) {
      state.paymentCycle = action.payload;
    },
    /** Optimistically deduct 1 credit when a candidate invitation is sent. */
    deductOneCredit(state) {
      state.credits = Math.max(0, state.credits - 1);
      state.usedCredits += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBilling.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchBilling.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.currentPlan = action.payload.current_plan;
        state.paymentCycle = action.payload.payment_cycle;
        state.credits = action.payload.credits;
        state.usedCredits = action.payload.used_credits;
        state.status = 'idle';
      })
      .addCase(fetchBilling.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      });

    builder
      .addCase(purchasePlan.pending, (state) => { state.status = 'loading'; })
      .addCase(purchasePlan.fulfilled, (state, action) => {
        state.currentPlan = action.payload.plan;
        state.paymentCycle = action.payload.cycle;
        state.credits = action.payload.credits;
        state.status = 'success';
      })
      .addCase(purchasePlan.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      });
  },
});

export const { setPaymentCycle, deductOneCredit } = billingSlice.actions;
export default billingSlice.reducer;
