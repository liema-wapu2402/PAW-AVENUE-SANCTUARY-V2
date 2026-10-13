import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';

/** Guards every /admin route: signed-out visitors are sent to the login page. */
export default function RequireAdmin() {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) return <div className="admin-loading">🐾 Loading…</div>;
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
