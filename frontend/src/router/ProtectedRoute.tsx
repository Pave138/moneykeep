import { Navigate, Outlet } from "react-router-dom"
import { authStore } from "../store/auth"

export default function ProtectedRoute() {
  const isAuthenticated = authStore.isAuth()
  
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated) // для отладки
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <Outlet />
}