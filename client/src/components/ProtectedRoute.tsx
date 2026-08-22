import { Navigate, Outlet } from 'react-router-dom';

/**
 * Wraps routes that require authentication.
 * Reads the JWT from localStorage — if absent, redirects to /signin immediately.
 * No network call is made here; token presence is sufficient for client-side guarding.
 * The actual token validity is enforced by the server on every protected API call.
 */
const ProtectedRoute = () => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
