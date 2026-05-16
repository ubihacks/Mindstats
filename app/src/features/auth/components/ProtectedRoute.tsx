import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { Center, Spinner } from '@chakra-ui/react';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, initialized } = useAppSelector((s) => s.auth);

  if (!initialized) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.600" thickness="4px" />
      </Center>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Super admins only live in /super-admin — keep them out of the regular app
  if (user.role === 'SUPER_ADMIN' && !allowedRoles?.includes('SUPER_ADMIN')) {
    return <Navigate to="/super-admin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
