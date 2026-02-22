import { Navigate, Outlet } from "react-router-dom"
import { authStore } from "../store/auth"

export default function AdminRoute() {
  const isAuth = authStore.isAuth()
  const isSuperuser =
    typeof authStore.isSuperuser === "function"
      ? authStore.isSuperuser()
      : false

  if (!isAuth) {
    return <Navigate to="/login" replace />
  }

  if (!isSuperuser) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}