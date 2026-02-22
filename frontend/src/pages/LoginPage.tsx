import { useState } from "react"
import { loginApi, getMeApi } from "../api/auth"
import { authStore } from "../store/auth"
import { useNavigate, Link, useLocation } from "react-router-dom"
import ThemeToggle from "@/components/ThemeToggle"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [successMessage] = useState(location.state?.message || "")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const data = await loginApi(email, password)

      if (!data.access_token) {
        throw new Error("Неверный ответ сервера")
      }

      authStore.setToken(data.access_token)

      const user = await getMeApi()
      authStore.setUser(user)

      navigate("/dashboard", { replace: true })
    } catch (e: any) {
      setError(e.message || "Ошибка входа")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-indigo-500/20 blur-3xl pointer-events-none" />

      {/* Glow Logo */}
      <Link to="/" className="absolute top-6 left-6 group z-20">
        <div className="relative w-[48px] h-[48px]">

          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 animate-pulse" />

          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition" />

          <div className="relative w-[48px] h-[48px] rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white font-bold text-xl transition-all duration-300 group-hover:scale-105">
            M
          </div>

        </div>
      </Link>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* ===== Login Card (Glow Border Only) ===== */}
      <div className="relative w-full max-w-md group">
        <div className="
  absolute -inset-4
  rounded-3xl
  bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600
  blur-3xl
  opacity-20
  group-hover:opacity-35
  transition duration-700
" />

        <Card className="
          relative
          w-full
          rounded-2xl
          bg-white/60 dark:bg-white/5
          backdrop-blur-xl
          border border-transparent
          shadow-xl
          transition-all duration-300
          group-hover:shadow-2xl
        ">

          {/* Neon Border */}
          <div
            className="
              absolute inset-0 rounded-2xl
              pointer-events-none
              opacity-50
              group-hover:opacity-100
              transition duration-500
            "
            style={{
              padding: "1px",
              background:
                "linear-gradient(135deg, #22d3ee, #3b82f6, #6366f1)",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          <CardHeader className="space-y-1 text-center relative z-10">
            <CardTitle className="text-2xl font-bold">
              Вход в систему
            </CardTitle>
            <CardDescription>
              Введите свои данные для входа
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10">

            {successMessage && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-600 text-sm text-center">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">

              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />

              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />

              <Button
                type="submit"
                className="w-full backdrop-blur"
              >
                {isLoading ? "Вход..." : "Войти"}
              </Button>

            </form>

            <div className="mt-6 text-center text-sm">
              Нет аккаунта?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Зарегистрироваться
              </Link>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}