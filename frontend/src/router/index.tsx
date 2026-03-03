import { createBrowserRouter, Navigate } from "react-router-dom"

import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import ExpensesPage from "../pages/ExpensesPage"
import IncomePage from "../pages/IncomePage"
import DashboardPage from "../pages/DashboardPage"
import LandingPage from "../pages/LandingPage"
import NotFoundPage from "../pages/NotFoundPage"
import AdminCategoriesPage from "../pages/AdminCategoriesPage"

import ProtectedRoute from "./ProtectedRoute"
import AdminRoute from "./AdminRoute"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/register",
    element: <RegisterPage />,
  },

  // 🔒 Только авторизованные пользователи
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/expenses",
        element: <ExpensesPage />,
      },
      {
        path: "/income",
        element: <IncomePage />,
      },
    ],
  },

  // 👑 Только суперюзер
  {
    element: <AdminRoute />,
    children: [
      {
        path: "/admin/categories",
        element: <AdminCategoriesPage />,
      },
    ],
  },

  // 404
  {
    path: "/404",
    element: <NotFoundPage />,
  },
  {
    path: "/docs",
    element: <Navigate to="/docs" replace />,
  },

  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
])