import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import assessmentReducer from '../features/assessment/assessmentSlice';
import rolesReducer from '../features/roles/rolesSlice';
import billingReducer from '../features/billing/billingSlice';
import superAdminReducer from '../features/superAdmin/superAdminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assessment: assessmentReducer,
    roles: rolesReducer,
    billing: billingReducer,
    superAdmin: superAdminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
