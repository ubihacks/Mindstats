import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchBilling } from '../features/billing/billingSlice';
import { fetchRoles } from '../features/roles/rolesSlice';

/**
 * Syncs all server state whenever the authenticated user changes.
 * Mounted once inside the protected layout — no per-page fetching needed.
 */
const DataBootstrap: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const bootstrappedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!user?.id || bootstrappedFor.current === user.id) return;
    bootstrappedFor.current = user.id;

    dispatch(fetchBilling(user.id));
    dispatch(fetchRoles(user.id));
  }, [user?.id]);

  return null;
};

export default DataBootstrap;
