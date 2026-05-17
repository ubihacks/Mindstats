import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';

import { DISC_QUESTIONS } from './data/questions';
import type { AssessmentState } from '../../types';

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const submitAssessment = createAsyncThunk(
  'assessment/submit',
  async (
    payload: { roleId: string; assessmentType: 'HIRING_MANAGER' | 'CANDIDATE'; respondentId: string; inviteToken?: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { assessment: AssessmentState };
      const answers = Object.values(state.assessment.answers);

      // Calculate DISC scores (a=D, b=I, c=S, d=C)
      const traitMap: Record<string, 'D' | 'I' | 'S' | 'C'> = { a: 'D', b: 'I', c: 'S', d: 'C' };
      const discScores = { D: 0, I: 0, S: 0, C: 0 };
      answers.forEach((a) => {
        if (a.mostOptionId) {
          const t = traitMap[a.mostOptionId.slice(-1)];
          if (t) discScores[t] += 2;
        }
        if (a.leastOptionId) {
          const t = traitMap[a.leastOptionId.slice(-1)];
          if (t) discScores[t] -= 1;
        }
      });

      const { error } = await supabase.from('assessment_responses').insert({
        role_id: payload.roleId,
        respondent_id: payload.respondentId,
        assessment_type: payload.assessmentType,
        answers: JSON.stringify(answers),
        disc_scores: discScores,
        submitted_at: new Date().toISOString(),
      });

      if (error) return rejectWithValue(error.message);

      // Mark hiring manager assessment as completed
      if (payload.assessmentType === 'HIRING_MANAGER') {
        const { error: roleError } = await supabase
          .from('hiring_roles')
          .update({ hiring_manager_status: 'COMPLETED', behavioural_demand: JSON.stringify(answers) })
          .eq('id', payload.roleId);

        if (roleError) return rejectWithValue(roleError.message);
      }

      if (payload.assessmentType === 'CANDIDATE') {
        const query = supabase.from('candidates').update({ invite_status: 'COMPLETED', disc_scores: discScores });
        const { error: candidateError } = payload.inviteToken
          ? await query.eq('invite_token', payload.inviteToken)
          : await query.eq('id', payload.respondentId);

        if (candidateError) return rejectWithValue(candidateError.message);
        sessionStorage.removeItem('candidate_invite_token');
      }

      return new Date().toISOString();
    } catch (err: unknown) {
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
