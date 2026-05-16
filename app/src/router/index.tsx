import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import PublicShell from '../components/public/PublicShell';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';
import LandingPage from '../pages/LandingPage';
import AboutPage from '../pages/AboutPage';
import PublicPricingPage from '../pages/PublicPricingPage';
import DashboardPage from '../pages/DashboardPage';
import RolesPage from '../features/roles/pages/RolesPage';
import AssessmentPage from '../features/assessment/pages/AssessmentPage';
import HMDemandPage from '../features/assessment/pages/HMDemandPage';
import BillingPage from '../features/billing/pages/BillingPage';
import ReportsPage from '../features/reports/pages/ReportsPage';
import AdminPage from '../features/admin/pages/AdminPage';
import AssessmentCompletePage from '../pages/AssessmentCompletePage';
import SuperAdminShell from '../features/superAdmin/SuperAdminShell';
import SuperAdminDashboard from '../features/superAdmin/SuperAdminDashboard';
import NotFoundPage from '../pages/NotFoundPage';

const router = createBrowserRouter([
  // Public marketing site
  {
    element: <PublicShell />,
    children: [
      { path: '/',        element: <LandingPage />       },
      { path: '/about',   element: <AboutPage />         },
      { path: '/pricing', element: <PublicPricingPage /> },
    ],
  },
  // Auth pages
  { path: '/login',           element: <LoginPage />          },
  { path: '/register',        element: <RegisterPage />       },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password',  element: <ResetPasswordPage />  },
  // Public assessment routes
  { path: '/assess/:roleId/hiring-manager', element: <HMDemandPage />         },
  { path: '/assess/:roleId/candidate',      element: <AssessmentPage />       },
  { path: '/assess/:roleId/:type',          element: <AssessmentPage />       },
  { path: '/assessment/complete',           element: <AssessmentCompletePage /> },
  // Super Admin portal
  {
    element: <ProtectedRoute allowedRoles={['SUPER_ADMIN']} />,
    children: [
      {
        element: <SuperAdminShell />,
        children: [
          { path: '/super-admin',           element: <SuperAdminDashboard /> },
          { path: '/super-admin/companies', element: <SuperAdminDashboard /> },
          { path: '/super-admin/analytics', element: <SuperAdminDashboard /> },
          { path: '/super-admin/users',     element: <SuperAdminDashboard /> },
        ],
      },
    ],
  },
  // Protected app shell
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/roles',     element: <RolesPage />     },
          { path: '/reports',   element: <ReportsPage />   },
          {
            element: <ProtectedRoute allowedRoles={['ADMIN']} />,
            children: [
              { path: '/billing', element: <BillingPage /> },
              { path: '/admin',   element: <AdminPage />   },
            ],
          },
        ],
      },
    ],
  },
  // 404
  { path: '*', element: <NotFoundPage /> },
]);

const AppRouter: React.FC = () => <RouterProvider router={router} />;

export default AppRouter;
