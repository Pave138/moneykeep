import type { ReactNode } from "react"
import { Link, useNavigate } from "react-router-dom"
import { authStore } from "../store/auth"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import ThemeToggle from "./ThemeToggle"

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const isAuth = authStore.isAuth()

  const handleLogout = () => {
    authStore.logout()
    navigate("/")
  }

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/60 dark:bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              MoneyKeep
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuth && (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    Статистика
                  </Button>
                </Link>
                <Link to="/expenses">
                  <Button variant="ghost" size="sm">
                    Расходы
                  </Button>
                </Link>
                <Link to="/income">
                  <Button variant="ghost" size="sm">
                    Доходы
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleLogout}
                  className="text-destructive hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  )
}