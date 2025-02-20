import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }
  // !! THIS IS WRONG , CHANGE LATER
  // TODO: 
  return isAuthenticated ?  <Outlet />: <Navigate to="/login" />
}

export default ProtectedRoute