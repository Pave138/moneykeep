import GlowIconButton from "@/components/GlowIconButton"
import { Link } from "react-router-dom"
import ThemeToggle from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Home,
  PieChart,
  List,
  TrendingUp,
  TrendingDown,
  LogOut,
  Wallet
} from "lucide-react"
import { authStore } from "../store/auth"
import { useNavigate } from "react-router-dom"

import { useEffect, useState } from "react"
import { getExpenses } from "@/api/expense"
import { getIncome } from "@/api/income"

type Tx = {
  id: number
  amount: number
  description: string
  created_at?: string
  type: "income" | "expense"
}

export default function DashboardPage() {
  const navigate = useNavigate()

  const [incomeTotal, setIncomeTotal] = useState(0)
  const [expenseTotal, setExpenseTotal] = useState(0)
  const [balance, setBalance] = useState(0)
  const [recent, setRecent] = useState<Tx[]>([])
  const [loading, setLoading] = useState(true)

  const handleLogout = () => {
    authStore.logout()
    navigate("/")
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      const [income, expenses] = await Promise.all([
        getIncome(),
        getExpenses()
      ])

      const incomeSum = income.reduce((acc, i) => acc + i.amount, 0)
      const expenseSum = expenses.reduce((acc, e) => acc + e.amount, 0)

      setIncomeTotal(incomeSum)
      setExpenseTotal(expenseSum)
      setBalance(incomeSum - expenseSum)

      // последние операции (объединяем и сортируем)
      const merged: Tx[] = [
        ...income.map(i => ({ ...i, type: "income" as const })),
        ...expenses.map(e => ({ ...e, type: "expense" as const }))
      ]

      merged.sort((a, b) =>
        new Date(b.created_at || "").getTime() -
        new Date(a.created_at || "").getTime()
      )

      setRecent(merged.slice(0, 5))
    } catch (e) {
      console.error("Dashboard load error", e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* GLASS BACKGROUND */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-transparent to-indigo-500/20 blur-3xl pointer-events-none" />

      {/* HEADER */}
      <header className="relative py-4 px-6 flex items-center justify-between border-b border-white/20 bg-white/60 dark:bg-white/5 backdrop-blur-xl">
        <Link to="/" className="group relative w-[48px] h-[48px]">

  {/* Glow Layer 1 */}
  <div className="
    absolute -inset-1
    bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600
    rounded-full blur-lg
    opacity-70
    group-hover:opacity-100
    animate-pulse
  " />

  {/* Glow Layer 2 */}
  <div className="
    absolute -inset-2
    bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600
    rounded-full blur-2xl
    opacity-40
    group-hover:opacity-70
    transition
  " />

  {/* Logo Body */}
  <div className="
    relative
    w-[48px] h-[48px]
    rounded-full
    bg-black/40 backdrop-blur-xl
    border border-white/20
    flex items-center justify-center
    text-white font-bold text-xl
    transition-all duration-300
    group-hover:scale-105
  ">
    M
  </div>

</Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/expenses" className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <TrendingDown className="w-4 h-4" />
            <span>Расходы</span>
          </Link>
          <Link to="/income" className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <TrendingUp className="w-4 h-4" />
            <span>Доходы</span>
          </Link>
          <Link to="/dashboard" className="flex items-center gap-1 text-primary font-medium">
            <PieChart className="w-4 h-4" />
            <span>Статистика</span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <Button variant="outline" size="icon" className="backdrop-blur">
              <List className="w-4 h-4" />
            </Button>
          </div>

          <GlowIconButton
  variant="danger"
  onClick={handleLogout}
  title="Выйти"
>
  <LogOut className="w-5 h-5" />
</GlowIconButton>

          <ThemeToggle />
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden relative px-6 py-2 flex gap-4 justify-center border-b border-white/20 bg-white/40 dark:bg-white/5 backdrop-blur-sm">
        <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
          <Home className="w-5 h-5" />
        </Link>
        <Link to="/expenses" className="text-muted-foreground hover:text-primary transition-colors">
          <TrendingDown className="w-5 h-5" />
        </Link>
        <Link to="/income" className="text-muted-foreground hover:text-primary transition-colors">
          <TrendingUp className="w-5 h-5" />
        </Link>
        <Link to="/dashboard" className="text-primary">
          <PieChart className="w-5 h-5" />
        </Link>
      </div>

      {/* MAIN */}
      <main className="relative container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            Статистика
          </h1>
          <p className="text-muted-foreground mt-2">
            Анализ ваших финансов
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Wallet className="w-4 h-4" />
                Текущий баланс
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {loading ? "..." : `₽${balance}`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Всего доходов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-500">
                {loading ? "..." : `+ ₽${incomeTotal}`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendingDown className="w-4 h-4 text-destructive" />
                Всего расходов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">
                {loading ? "..." : `- ₽${expenseTotal}`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts placeholders оставляем как есть */}

        {/* Recent */}
        <div className="mt-8">
          <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle>Последние операции</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Загрузка...</p>
              ) : recent.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Нет операций</p>
              ) : (
                <div className="space-y-3">
                  {recent.map(tx => (
                    <div
                      key={`${tx.type}-${tx.id}`}
                      className="flex justify-between items-center border-b border-white/10 pb-2"
                    >
                      <div>
                        <p className="font-medium">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.created_at
                            ? new Date(tx.created_at).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                      <p className={`font-semibold ${tx.type === "income" ? "text-green-500" : "text-destructive"}`}>
                        {tx.type === "income" ? "+" : "-"} ₽{tx.amount}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative py-6 px-4 border-t border-white/20 bg-white/60 dark:bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto max-w-4xl text-center text-sm text-muted-foreground">
          <p>MoneyKeep • Простой учет финансов</p>
        </div>
      </footer>
    </div>
  )
}