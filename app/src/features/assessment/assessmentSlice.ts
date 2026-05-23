import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';

import { DISC_QUESTIONS } from './data/questions';
import type { AssessmentState, QuestionAnswer } from '../../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Maps the option-ID suffix used in questions.ts to a DISC type.
 *   a → D  |  b → I  |  c → S  |  d → C
 */
const SUFFIX_TO_DISC: Record<string, 'D' | 'I' | 'S' | 'C'> = {
  a: 'D', b: 'I', c: 'S', d: 'C',
};

/**
 * Converts the Redux answer format { questionId, mostOptionId, leastOptionId }
 * into the calculate-disc Edge Function contract:
 * { scenario, options: [{ type, selected }, …] }
 */
function toEdgeFunctionAnswers(
  reduxAnswers: QuestionAnswer[]
): { scenario: number; options: { type: 'D'|'I'|'S'|'C'; selected: 'Most'|'Least'|null }[] }[] {
  return reduxAnswers.map(({ questionId, mostOptionId, leastOptionId }) => {
    const mostType  = mostOptionId  ? SUFFIX_TO_DISC[mostOptionId.slice(-1)]  : null;
    const leastType = leastOptionId ? SUFFIX_TO_DISC[leastOptionId.slice(-1)] : null;

    return {
      scenario: questionId,
      options: (['D', 'I', 'S', 'C'] as const).map((type) => ({
        type,
        selected: type === mostType ? 'Most' : type === leastType ? 'Least' : null,
      })),
    };
  });
}

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const submitAssessment = createAsyncThunk(
  'assessment/submit',
  async (
    payload: {
      roleId: string;
      assessmentType: 'HIRING_MANAGER' | 'CANDIDATE';
      respondentId: string;
      respondentName: string;
      respondentEmail: string;
      inviteToken?: string;
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { assessment: AssessmentState };
      const reduxAnswers = Object.values(state.assessment.answers);

      // Transform Redux answer format → Edge Function contract
      const answers = toEdgeFunctionAnswers(reduxAnswers);

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      // Always send an Authorization header — use the session token for
      // authenticated users (HMs), fall back to the anon key for candidates.
      const bearerToken = accessToken ?? (import.meta.env.VITE_SUPABASE_ANON_KEY as string);
      const headers: Record<string, string> = {
        'Content-Type':  'application/json',
        'apikey':        import.meta.env.VITE_SUPABASE_ANON_KEY as string,
        'Authorization': `Bearer ${bearerToken}`,
      };

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calculate-disc`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            respondent: payload.respondentName,
            email:      payload.respondentEmail,
            answers,
          }),
        }
      );

      const body = await res.json();

      if (!res.ok) {
        return rejectWithValue(body?.error ?? 'Failed to submit assessment.');
      }

      // Mark the candidate's invite as COMPLETED and immediately expire the link
      // so it cannot be used to start another assessment.
      if (payload.assessmentType === 'CANDIDATE' && payload.inviteToken) {
        await supabase
          .from('candidates')
          .update({
            invite_status: 'COMPLETED',
            expires_at:    new Date().toISOString(),   // hard-expire the link
          })
          .eq('invite_token', payload.inviteToken);

        // Deduct 1 credit from the company pool now that the assessment is done.
        // Look up the company via the role.
        const { data: roleRow } = await supabase
          .from('hiring_roles')
          .select('company_id')
          .eq('id', payload.roleId)
          .maybeSingle();

        if (roleRow?.company_id) {
          const { data: company } = await supabase
            .from('companies')
            .select('id, credits')
            .eq('id', roleRow.company_id)
            .maybeSingle();

          if (company && company.credits > 0) {
            await supabase
              .from('companies')
              .update({ credits: company.credits - 1 })
              .eq('id', company.id);
          }
        }

        sessionStorage.removeItem('candidate_invite_token');
        sessionStorage.removeItem('candidate_name');
        sessionStorage.removeItem('candidate_email');
      }

      // For hiring managers, mark the hiring_role HM assessment as completed.
      if (payload.assessmentType === 'HIRING_MANAGER' && payload.roleId) {
        await supabase
          .from('hiring_roles')
          .update({ hm_assessment_status: 'COMPLETED' })
          .eq('id', payload.roleId);
      }

      return new Date().toISOString();
    } catch {
      return rejectWithValue('Failed to submit assessment. Please try again.');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const initialState: AssessmentState = {
  questions: DISC_QUESTIONS,
  answers: {},
  currentQuestionIndex: 0,
  status: 'idle',
  submittedAt: null,
  error: null,
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    setMostChoice(
      state,
      action: PayloadAction<{ questionId: number; optionId: string }>
    ) {
      const { questionId, optionId } = action.payload;
      const existing = state.answers[questionId] ?? {
        questionId,
        mostOptionId: null,
        leastOptionId: null,
      };

      // Force-choice rule: if optionId is already 'Least', clear it
      const newLeast = existing.leastOptionId === optionId ? null : existing.leastOptionId;

      state.answers[questionId] = {
        ...existing,
        mostOptionId: optionId,
        leastOptionId: newLeast,
      };
    },

    setLeastChoice(
      state,
      action: PayloadAction<{ questionId: number; optionId: string }>
    ) {
      const { questionId, optionId } = action.payload;
      const existing = state.answers[questionId] ?? {
        questionId,
        mostOptionId: null,
        leastOptionId: null,
      };

      // Force-choice rule: if optionId is already 'Most', clear it
      const newMost = existing.mostOptionId === optionId ? null : existing.mostOptionId;

      state.answers[questionId] = {
        ...existing,
        leastOptionId: optionId,
        mostOptionId: newMost,
      };
    },

    goToQuestion(state, action: PayloadAction<number>) {
      state.currentQuestionIndex = action.payload;
    },

    goToNextQuestion(state) {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },

    goToPreviousQuestion(state) {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },

    resetAssessment(state) {
      state.answers = {};
      state.currentQuestionIndex = 0;
      state.status = 'idle';
      state.submittedAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAssessment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitAssessment.fulfilled, (state, action) => {
        state.status = 'success';
        state.submittedAt = action.payload;
        state.error = null;
      })
      .addCase(submitAssessment.rejected, (state, action) => {
        state.status = 'error';
        state.error = (action.payload as string) ?? 'Submission failed';
      });
  },
});

export const {
  setMostChoice,
  setLeastChoice,
  goToQuestion,
  goToNextQuestion,
  goToPreviousQuestion,
  resetAssessment,
} = assessmentSlice.actions;

export default assessmentSlice.reducer;
