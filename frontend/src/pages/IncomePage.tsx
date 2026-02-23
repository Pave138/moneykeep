import GlowIconButton from "@/components/GlowIconButton"
import { useEffect, useState } from "react"
import { getIncome, createIncome, deleteIncome } from "../api/income"
import type { Income } from "../api/income"
import { getIncomeCategories } from "../api/category"
import type { Category } from "../api/category"

import { Link, useNavigate } from "react-router-dom"
import ThemeToggle from "@/components/ThemeToggle"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

import {
  PieChart,
  TrendingUp,
  TrendingDown,
  LogOut,
} from "lucide-react"

import { authStore } from "../store/auth"

type PeriodType = "week" | "month" | "all" | null

export default function IncomePage() {
  const navigate = useNavigate()

  const [income, setIncome] = useState<Income[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState<number | null>(null)

  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleteName, setDeleteName] = useState("")
  const [deleteAmount, setDeleteAmount] = useState(0)
  const [deleteCategoryName, setDeleteCategoryName] = useState("")
  const [deleteTimer, setDeleteTimer] = useState<number>(0)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] = useState(false)

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(null)
  const [periodIncome, setPeriodIncome] = useState<Income[]>([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleLogout = () => {
    authStore.logout()
    navigate("/")
  }

  useEffect(() => {
    loadIncome()
    loadCategories()
  }, [])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    if (isTimerActive && deleteTimer > 0) {
      interval = setInterval(() => {
        setDeleteTimer((prev) => {
          const next = prev - 1
          if (next === 0) {
            setIsDeleteButtonEnabled(true)
            setIsTimerActive(false)
          }
          return next
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isTimerActive, deleteTimer])

  const loadIncome = async () => {
    const data = await getIncome()
    setIncome(data)

    if (isSheetOpen && selectedPeriod) {
      setPeriodIncome(getPeriodIncome(selectedPeriod, data))
    }
  }

  const loadCategories = async () => {
    const data = await getIncomeCategories()
    setCategories(data)
    if (data.length) setCategoryId(data[0].id)
  }

  const handleCreate = async () => {
    if (!amount || Number(amount) <= 0 || !categoryId) return

    await createIncome({
      amount: Number(amount),
      description,
      category_id: categoryId,
    })

    setAmount("")
    setDescription("")
    loadIncome()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteIncome(deleteId)
    closeDeleteDialog()
    loadIncome()
  }

  const openDeleteDialog = (
    id: number,
    name: string,
    amount: number,
    categoryId: number
  ) => {
    const cat = categories.find((c) => c.id === categoryId)
    setDeleteId(id)
    setDeleteName(name)
    setDeleteAmount(amount)
    setDeleteCategoryName(cat?.name || "")
    setDeleteTimer(5)
    setIsTimerActive(true)
    setIsDeleteButtonEnabled(false)
  }

  const closeDeleteDialog = () => {
    setDeleteId(null)
    setDeleteTimer(0)
    setIsTimerActive(false)
    setIsDeleteButtonEnabled(false)
  }

  // ===== DATE HELPERS =====

  const isToday = (date?: string) => {
    if (!date) return false
    const d = new Date(date)
    const now = new Date()
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    )
  }

  const isWeek = (date?: string) => {
    if (!date) return false
    const d = new Date(date)
    const now = new Date()
    const weekAgo = new Date(now)
    weekAgo.setDate(now.getDate() - 7)
    return d >= weekAgo && d <= now
  }

  const isMonth = (date?: string) => {
    if (!date) return false
    const d = new Date(date)
    const now = new Date()
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    )
  }

  // ===== PERIOD =====

  const getPeriodIncome = (period: PeriodType, data = income) => {
    switch (period) {
      case "week":
        return data.filter((i) => isWeek(i.created_at))
      case "month":
        return data.filter((i) => isMonth(i.created_at))
      case "all":
        return data
      default:
        return []
    }
  }

  const handlePeriodClick = (period: PeriodType) => {
    if (!period) return
    setSelectedPeriod(period)
    setPeriodIncome(getPeriodIncome(period))
    setIsSheetOpen(true)
  }

  // ===== TOTALS =====

  const totalAll = income.reduce((s, i) => s + Number(i.amount), 0)
  const totalToday = income.filter(i => isToday(i.created_at))
    .reduce((s, i) => s + Number(i.amount), 0)

  const totalWeek = income.filter(i => isWeek(i.created_at))
    .reduce((s, i) => s + Number(i.amount), 0)

  const totalMonth = income.filter(i => isMonth(i.created_at))
    .reduce((s, i) => s + Number(i.amount), 0)

  const todayIncome = income.filter(i => isToday(i.created_at))

  const groupedTodayIncome = categories.map(cat => {
    const items = todayIncome.filter(i => i.category_id === cat.id)
    const total = items.reduce((s, i) => s + Number(i.amount), 0)
    return { category: cat, items, total }
  })

  const progress = isTimerActive ? (deleteTimer / 5) * 100 : 0

  // ===== RENDER =====

  return (
    <div className="min-h-screen relative flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-transparent to-indigo-500/20 blur-3xl pointer-events-none" />

      {/* HEADER */}
      <header className="relative z-40 py-4 px-6 flex items-center justify-between">
  {/* LOGO */}
  <Link to="/" className="group relative">
    <div className="relative w-[48px] h-[48px]">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 animate-pulse" />
      <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition" />
      <div className="relative w-[48px] h-[48px] rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white font-bold text-xl transition-all duration-300 group-hover:scale-105">
        M
      </div>
    </div>
  </Link>

  {/* DESKTOP NAV */}
  <nav className="hidden md:flex items-center gap-6">
    <Link
      to="/expenses"
      className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
    >
      <TrendingDown className="w-4 h-4" />
      <span>Расходы</span>
    </Link>

    <Link
      to="/income"
      className="flex items-center gap-1 text-primary font-medium"
    >
      <TrendingUp className="w-4 h-4" />
      <span>Доходы</span>
    </Link>

    <Link
      to="/dashboard"
      className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
    >
      <PieChart className="w-4 h-4" />
      <span>Статистика</span>
    </Link>
  </nav>

  {/* RIGHT SIDE */}
  <div className="flex items-center gap-3">
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

      {/* MAIN */}
      <main className="container mx-auto px-4 py-8 flex-1">

        {/* TOTALS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div onClick={() => handlePeriodClick("week")} className="cursor-pointer">
            <TotalCard title="Неделя" value={totalWeek} />
          </div>
          <div onClick={() => handlePeriodClick("month")} className="cursor-pointer">
            <TotalCard title="Месяц" value={totalMonth} />
          </div>
          <div onClick={() => handlePeriodClick("all")} className="cursor-pointer">
            <TotalCard title="Всего" value={totalAll} />
          </div>
        </div>

        {/* FORM + TODAY */}
        <div className="grid md:grid-cols-2 gap-6">

          <GlassCard>
            <CardHeader>
              <CardTitle>Добавить доход</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                type="number"
                placeholder="Сумма"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <Input
                placeholder="Описание"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Select
                value={categoryId?.toString()}
                onValueChange={(v) => setCategoryId(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                className="w-full"
                onClick={handleCreate}
                disabled={!amount || Number(amount) <= 0 || !categoryId}
              >
                Добавить
              </Button>
            </CardContent>
          </GlassCard>

          {/* TODAY LIST */}
          <GlassCard>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle>Сегодня</CardTitle>
              <span className="font-bold text-lg">
                ₽{totalToday.toFixed(2)}
              </span>
            </CardHeader>

            <CardContent className="space-y-6">
              {totalToday === 0 && (
                <p className="text-muted-foreground text-sm">
                  Сегодня доходов нет
                </p>
              )}

              {groupedTodayIncome.map(group => {
                if (!group.items.length) return null

                return (
                  <div key={group.category.id} className="space-y-3">
                    <div className="flex justify-between font-medium">
                      <span>{group.category.name}</span>
                      <span>₽{group.total.toFixed(2)}</span>
                    </div>

                    {group.items.map(inc => (
                      <div
                        key={inc.id}
                        className="flex justify-between items-center rounded-xl p-3 bg-white/40 dark:bg-white/5 backdrop-blur border border-white/20"
                      >
                        <div>
                          <p className="font-semibold">₽{inc.amount}</p>
                          <p className="text-sm text-muted-foreground">
                            {inc.description || "Без описания"}
                          </p>
                        </div>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            openDeleteDialog(
                              inc.id,
                              inc.description || "",
                              Number(inc.amount),
                              inc.category_id
                            )
                          }
                        >
                          Удалить
                        </Button>
                      </div>
                    ))}
                  </div>
                )
              })}
            </CardContent>
          </GlassCard>

        </div>

        {/* DELETE */}
        <Dialog open={!!deleteId} onOpenChange={closeDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Удалить доход?</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <p>{deleteCategoryName}</p>
              <p>{deleteName}</p>
              <p className="text-xl font-bold text-destructive">
                ₽{deleteAmount.toFixed(2)}
              </p>

              {(isTimerActive || isDeleteButtonEnabled) && (
                <div className="w-full h-2 bg-white/20 rounded">
                  <div
                    className="h-full bg-destructive transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeDeleteDialog}>
                Отмена
              </Button>
              <Button
                variant="destructive"
                disabled={!isDeleteButtonEnabled}
                onClick={handleDelete}
              >
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* SHEET */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Доходы</SheetTitle>
              <SheetDescription>
                ₽{periodIncome.reduce((s, i) => s + Number(i.amount), 0).toFixed(2)}
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

      </main>
    </div>
  )
}

// UI
function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
      {children}
    </Card>
  )
}

function TotalCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">₽{value.toFixed(2)}</p>
      </CardContent>
    </Card>
  )
}