import { useState } from "react"
import { registerApi } from "../api/auth"
import { useNavigate, Link } from "react-router-dom"
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

export default function RegisterPage() {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [error, setError] = useState("")

  const handlePasswordChange = (value: string) => {
    setPassword(value)

    if (confirmPassword) {
      if (value !== confirmPassword) setPasswordError("Пароли не совпадают")
      else if (value.length < 6) setPasswordError("Минимум 6 символов")
      else setPasswordError("")
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)

    if (password) {
      if (password !== value) setPasswordError("Пароли не совпадают")
      else if (password.length < 6) setPasswordError("Минимум 6 символов")
      else setPasswordError("")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setPasswordError("Пароли не совпадают")
      return
    }

    if (password.length < 6) {
      setPasswordError("Минимум 6 символов")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await registerApi(email, password)

      navigate("/login", {
        state: { message: "Регистрация успешна! Теперь войдите." },
      })
    } catch (e: any) {
      setError(e.message || "Ошибка регистрации")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-indigo-500/20 blur-3xl pointer-events-none" />

      {/* Logo */}
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

      {/* ===== Glow Card Wrapper ===== */}
      <div className="relative w-full max-w-md group">

        {/* ✨ External Glow Aura */}
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
              opacity-60
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
              Регистрация
            </CardTitle>
            <CardDescription>
              Создайте новый аккаунт
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10">

            {error && (
              <div className="mb-4 p-3 bg-destructive/20 border border-destructive/30 rounded-lg text-destructive text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">

              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="bg-white/50 dark:bg-black/20 border-white/30"
              />

              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                disabled={isLoading}
                required
                className="bg-white/50 dark:bg-black/20 border-white/30"
              />

              <Input
                type="password"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                disabled={isLoading}
                required
                className={`bg-white/50 dark:bg-black/20 border-white/30 ${
                  passwordError ? "border-destructive" : ""
                }`}
              />

              {passwordError && (
                <p className="text-sm text-destructive text-center">
                  {passwordError}
                </p>
              )}

              <Button
                type="submit"
                className="w-full backdrop-blur"
                disabled={
                  isLoading ||
                  !!passwordError ||
                  !email ||
                  !password ||
                  !confirmPassword
                }
              >
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>

            </form>

            <div className="mt-6 text-center text-sm">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Войти
              </Link>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}