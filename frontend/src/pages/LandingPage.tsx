import GlowIconButton from "@/components/GlowIconButton"
import { AnimatePresence, motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  List,
  LogOut,
  Lock,
  Tags, // ✅ ДОБАВИЛ
  LogIn,
  UserPlus, 
  X
} from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"
import { authStore } from "../store/auth"
import { useEffect, useState } from "react"

import { getExpenses } from "../api/expense"
import type { Expense } from "../api/expense"

import { getIncome } from "../api/income"
import type { Income } from "../api/income"

interface Stats {
  income: number
  expenses: number
  incomeToday: number
  expensesToday: number
  incomeWeek: number
  expensesWeek: number
  incomeMonth: number
  expensesMonth: number
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSuperuser, setIsSuperuser] = useState(false) // ✅ ДОБАВИЛ

  const [, setExpenses] = useState<Expense[]>([])
const [, setIncomes] = useState<Income[]>([])

  const [stats, setStats] = useState<Stats>({
    income: 0,
    expenses: 0,
    incomeToday: 0,
    expensesToday: 0,
    incomeWeek: 0,
    expensesWeek: 0,
    incomeMonth: 0,
    expensesMonth: 0,
  })

  useEffect(() => {
    const checkAuth = () => {
      const auth = authStore.isAuth()
      setIsAuthenticated(auth)

      if (auth) {
        const user = authStore.user
        setIsSuperuser(!!user?.is_superuser) // ✅ ДОБАВИЛ
        loadData()
      } else {
        setIsSuperuser(false) // ✅ ДОБАВИЛ
        resetStats()
      }
    }

    checkAuth()

    window.addEventListener("storage", checkAuth)
    return () => window.removeEventListener("storage", checkAuth)
  }, [])

  const loadData = async () => {
    try {
      const [expensesData, incomeData] = await Promise.all([
        getExpenses(),
        getIncome(),
      ])

      setExpenses(expensesData)
      setIncomes(incomeData)

      calculateStats(expensesData, incomeData)
    } catch (error) {
      console.error("Error loading finance data:", error)
    }
  }

  const resetStats = () => {
    setStats({
      income: 0,
      expenses: 0,
      incomeToday: 0,
      expensesToday: 0,
      incomeWeek: 0,
      expensesWeek: 0,
      incomeMonth: 0,
      expensesMonth: 0,
    })
    setExpenses([])
    setIncomes([])
  }

  const calculateStats = (
    expensesData: Expense[],
    incomeData: Income[]
  ) => {
    const now = new Date()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const weekAgo = new Date()
    weekAgo.setDate(now.getDate() - 7)
    weekAgo.setHours(0, 0, 0, 0)

    const todayExpenses = expensesData.filter(e => {
      const date = new Date(e.created_at!)
      return date >= today
    })

    const weekExpenses = expensesData.filter(e => {
      const date = new Date(e.created_at!)
      return date >= weekAgo
    })

    const monthExpenses = expensesData.filter(e => {
      const date = new Date(e.created_at!)
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      )
    })

    const totalExpenses = expensesData.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    )
    const totalExpensesToday = todayExpenses.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    )
    const totalExpensesWeek = weekExpenses.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    )
    const totalExpensesMonth = monthExpenses.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    )

    const todayIncome = incomeData.filter(i => {
      const date = new Date(i.created_at!)
      return date >= today
    })

    const weekIncome = incomeData.filter(i => {
      const date = new Date(i.created_at!)
      return date >= weekAgo
    })

    const monthIncome = incomeData.filter(i => {
      const date = new Date(i.created_at!)
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      )
    })

    const totalIncome = incomeData.reduce(
      (sum, i) => sum + Number(i.amount),
      0
    )
    const totalIncomeToday = todayIncome.reduce(
      (sum, i) => sum + Number(i.amount),
      0
    )
    const totalIncomeWeek = weekIncome.reduce(
      (sum, i) => sum + Number(i.amount),
      0
    )
    const totalIncomeMonth = monthIncome.reduce(
      (sum, i) => sum + Number(i.amount),
      0
    )

    setStats({
      income: totalIncome,
      expenses: totalExpenses,
      incomeToday: totalIncomeToday,
      expensesToday: totalExpensesToday,
      incomeWeek: totalIncomeWeek,
      expensesWeek: totalExpensesWeek,
      incomeMonth: totalIncomeMonth,
      expensesMonth: totalExpensesMonth,
    })
  }

  const handleLogout = () => {
    authStore.logout()
    setIsAuthenticated(false)
    setIsSuperuser(false) // ✅ ДОБАВИЛ
    resetStats()
    navigate("/")
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-indigo-500/20 blur-3xl pointer-events-none" />

      {/* HEADER */}
      <header className="relative z-40 py-4 px-6 flex items-center justify-between">
  {/* ===== MOBILE MENU ===== */}
  <AnimatePresence>
    {mobileMenuOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        />

        {/* Glass Menu */}
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -24, scale: 0.96 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="md:hidden fixed inset-0 z-50 flex items-start justify-center pt-28 px-4"
        >
          <div className="w-full max-w-sm rounded-3xl bg-white/15 dark:bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.25)] p-8 space-y-6 text-center">

            {isAuthenticated ? (
              <>
                <Link
                  to="/expenses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-muted-foreground hover:text-foreground transition"
                >
                  Расходы
                </Link>

                <Link
                  to="/income"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-muted-foreground hover:text-foreground transition"
                >
                  Доходы
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-muted-foreground hover:text-foreground transition"
                >
                  Статистика
                </Link>

                {isSuperuser && (
                  <Link
                    to="/admin/categories"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-lg font-medium text-muted-foreground hover:text-foreground transition"
                  >
                    Категории
                  </Link>
                )}

                <div className="pt-4 border-t border-white/20">
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-destructive font-medium"
                  >
                    Выйти
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 rounded-xl bg-primary text-white font-medium"
                >
                  Войти
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 rounded-xl border border-white/30 backdrop-blur hover:bg-white/10 transition"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>

  {/* ===== LOGO ===== */}
  <Link to="/" className="group relative">
    <div className="relative w-[48px] h-[48px]">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 animate-pulse" />
      <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition" />

      <div className="relative w-[48px] h-[48px] rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white font-bold text-xl transition-all duration-300 group-hover:scale-105">
        M
      </div>
    </div>
  </Link>

  {/* ===== DESKTOP NAV ===== */}
  <nav className="hidden md:flex items-center gap-6">
    {isAuthenticated ? (
      <>
        <Link to="/expenses" className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
          <TrendingDown className="w-4 h-4" />
          <span>Расходы</span>
        </Link>

        <Link to="/income" className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
          <TrendingUp className="w-4 h-4" />
          <span>Доходы</span>
        </Link>

        <Link to="/dashboard" className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
          <PieChart className="w-4 h-4" />
          <span>Статистика</span>
        </Link>
      </>
    ) : (
      <span className="text-sm text-muted-foreground">
        Войдите чтобы управлять финансами
      </span>
    )}
  </nav>

  {/* ===== RIGHT SIDE ===== */}
  <div className="relative z-50 flex items-center gap-3">

    {/* Mobile menu button */}
    <div className="md:hidden">
      <GlowIconButton
        title="Меню"
        onClick={() => setMobileMenuOpen(prev => !prev)}
      >
        <AnimatePresence mode="wait" initial={false}>
          {mobileMenuOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <List className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </GlowIconButton>
    </div>

    {/* Superuser categories */}
    {isSuperuser && (
      <Link to="/admin/categories">
        <GlowIconButton title="Категории">
          <Tags className="w-5 h-5" />
        </GlowIconButton>
      </Link>
    )}

    {/* Desktop auth buttons */}
    <div className="hidden md:flex items-center gap-2">
      {isAuthenticated ? (
        <GlowIconButton variant="danger" onClick={handleLogout} title="Выйти">
          <LogOut className="w-5 h-5" />
        </GlowIconButton>
      ) : (
        <>
          <Link to="/login">
            <GlowIconButton title="Войти">
              <LogIn className="w-5 h-5" />
            </GlowIconButton>
          </Link>

          <Link to="/register">
            <GlowIconButton title="Регистрация">
              <UserPlus className="w-5 h-5" />
            </GlowIconButton>
          </Link>
        </>
      )}
    </div>

    <ThemeToggle />
  </div>
</header>

      {/* ДАЛЬШЕ ВЕСЬ ТВОЙ КОД БЕЗ ИЗМЕНЕНИЙ */}

      {/* HERO */}
      <section className="relative pt-10 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              MoneyKeep
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Простой учет доходов и расходов. Контролируйте личные финансы без лишних сложностей.
          </p>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="relative py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-4">

            {/* INCOME */}
            <Card className={`bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl transition-all ${!isAuthenticated ? "opacity-50" : ""}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Доходы
                  {!isAuthenticated && <Lock className="w-4 h-4 text-muted-foreground ml-auto" />}
                </CardTitle>
              </CardHeader>

              <CardContent>
                {isAuthenticated ? (
                  <>
                    <p className="text-2xl font-bold text-green-500">+ ₽{stats.income}</p>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">За сегодня</span>
                        <span className="font-medium text-green-500">+ ₽{stats.incomeToday}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">За неделю</span>
                        <span className="font-medium text-green-500">+ ₽{stats.incomeWeek}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">За месяц</span>
                        <span className="font-medium text-green-500">+ ₽{stats.incomeMonth}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-4 text-center">
                    <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Войдите чтобы увидеть ваши доходы
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* EXPENSES */}
            <Card className={`bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl transition-all ${!isAuthenticated ? "opacity-50" : ""}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                  Расходы
                  {!isAuthenticated && <Lock className="w-4 h-4 text-muted-foreground ml-auto" />}
                </CardTitle>
              </CardHeader>

              <CardContent>
                {isAuthenticated ? (
                  <>
                    <p className="text-2xl font-bold text-destructive">- ₽{stats.expenses}</p>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">За сегодня</span>
                        <span className="font-medium text-destructive">- ₽{stats.expensesToday}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">За неделю</span>
                        <span className="font-medium text-destructive">- ₽{stats.expensesWeek}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">За месяц</span>
                        <span className="font-medium text-destructive">- ₽{stats.expensesMonth}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-4 text-center">
                    <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Войдите чтобы увидеть ваши расходы
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  )
}