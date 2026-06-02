import { Navigate, Outlet, useLocation } from 'react-router-dom'

import useAuth from '../hooks/useAuth'

function ProtectedRoute() {
  const { isAuthenticated, isCheckingAuth } = useAuth()
  const location = useLocation()

  if (isCheckingAuth) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-100 text-sm font-medium text-slate-600">
        Checking session...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return <Outlet />
}

export default ProtectedRoute
