import GlowIconButton from "@/components/GlowIconButton"
import { useEffect, useState } from "react"
import { getExpenses, createExpense, deleteExpense } from "../api/expense"
import type { Expense } from "../api/expense"
import { getExpenseCategories } from "../api/category"
import type { Category } from "../api/category"
import { Link } from "react-router-dom"
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
  Home,
  PieChart,
  List,
  TrendingUp,
  TrendingDown,
  LogOut
} from "lucide-react"
import { authStore } from "../store/auth"
import { useNavigate } from "react-router-dom"

type PeriodType = 'week' | 'month' | 'all' | null

export default function ExpensesPage() {
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState<Expense[]>([])
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
  const [periodExpenses, setPeriodExpenses] = useState<Expense[]>([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleLogout = () => {
    authStore.logout()
    navigate("/")
  }

  useEffect(() => {
    loadExpenses()
    loadCategories()
  }, [])

  // Таймер для активации кнопки удаления
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isTimerActive && deleteTimer > 0) {
      interval = setInterval(() => {
        setDeleteTimer((prev) => {
          const newValue = prev - 1
          // Когда таймер доходит до 0, активируем кнопку
          if (newValue === 0) {
            setIsDeleteButtonEnabled(true)
            setIsTimerActive(false)
          }
          return newValue
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerActive, deleteTimer])

  const loadExpenses = async () => {
    const data = await getExpenses()
    setExpenses(data)
    
    // Если sheet открыт, обновляем данные в нем
    if (isSheetOpen && selectedPeriod) {
      updatePeriodExpenses(data, selectedPeriod)
    }
  }

  const updatePeriodExpenses = (expensesData: Expense[], period: PeriodType) => {
    switch(period) {
      case 'week':
        setPeriodExpenses(expensesData.filter(e => isThisWeek(e.created_at)))
        break
      case 'month':
        setPeriodExpenses(expensesData.filter(e => isThisMonth(e.created_at)))
        break
      case 'all':
        setPeriodExpenses(expensesData)
        break
    }
  }

  const loadCategories = async () => {
    const data = await getExpenseCategories()
    setCategories(data)
    if (data.length > 0) setCategoryId(data[0].id)
  }

  const handleCreate = async () => {
    if (!amount || !categoryId) return

    await createExpense({
      amount: Number(amount),
      description,
      category_id: categoryId,
    })

    setAmount("")
    setDescription("")
    loadExpenses()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    
    setIsTimerActive(false)
    setDeleteTimer(0)
    setIsDeleteButtonEnabled(false)
    
    await deleteExpense(deleteId)
    setDeleteId(null)
    setDeleteCategoryName("")
    await loadExpenses()
  }

  const openDeleteDialog = (
    id: number,
    name: string,
    amount: number,
    categoryId: number
  ) => {
    // Находим название категории по ID
    const category = categories.find(c => c.id === categoryId)
    
    setDeleteId(id)
    setDeleteName(name)
    setDeleteAmount(amount)
    setDeleteCategoryName(category?.name || "Неизвестная категория")
    setDeleteTimer(5) // Устанавливаем таймер на 5 секунд
    setIsTimerActive(true)
    setIsDeleteButtonEnabled(false) // Кнопка неактивна в начале
  }

  const closeDeleteDialog = () => {
    setDeleteId(null)
    setIsTimerActive(false)
    setDeleteTimer(0)
    setIsDeleteButtonEnabled(false)
    setDeleteCategoryName("")
  }

  const cancelDelete = () => {
    closeDeleteDialog()
  }

  const isToday = (dateStr?: string) => {
    if (!dateStr) return false
    const d = new Date(dateStr)
    const now = new Date()
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    )
  }

  const isThisWeek = (dateStr?: string) => {
    if (!dateStr) return false
    const d = new Date(dateStr)
    const now = new Date()
    const weekAgo = new Date(now)
    weekAgo.setDate(now.getDate() - 7)
    weekAgo.setHours(0, 0, 0, 0)
    
    return d >= weekAgo && d <= now
  }

  const isThisMonth = (dateStr?: string) => {
    if (!dateStr) return false
    const d = new Date(dateStr)
    const now = new Date()
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    )
  }

  const getPeriodExpenses = (period: PeriodType): Expense[] => {
    switch(period) {
      case 'week':
        return expenses.filter(e => isThisWeek(e.created_at))
      case 'month':
        return expenses.filter(e => isThisMonth(e.created_at))
      case 'all':
        return expenses
      default:
        return []
    }
  }

  const handlePeriodClick = (period: PeriodType) => {
    if (!period) return
    setSelectedPeriod(period)
    setPeriodExpenses(getPeriodExpenses(period))
    setIsSheetOpen(true)
  }

  const totalAll = expenses.reduce((s, e) => s + Number(e.amount), 0)

  const totalToday = expenses
    .filter((e) => isToday(e.created_at))
    .reduce((s, e) => s + Number(e.amount), 0)

  const totalWeek = expenses
    .filter((e) => isThisWeek(e.created_at))
    .reduce((s, e) => s + Number(e.amount), 0)

  const totalMonth = expenses
    .filter((e) => isThisMonth(e.created_at))
    .reduce((s, e) => s + Number(e.amount), 0)

  const todayExpenses = expenses.filter((e) =>
    isToday(e.created_at)
  )

  const groupedTodayExpenses = categories.map((cat) => {
    const items = todayExpenses.filter(
      (e) => e.category_id === cat.id
    )

    const total = items.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    )

    return { category: cat, items, total }
  })

  const getPeriodTitle = (period: PeriodType): string => {
    switch(period) {
      case 'week': return 'Расходы за неделю'
      case 'month': return 'Расходы за месяц'
      case 'all': return 'Все расходы'
      default: return ''
    }
  }

  const groupedPeriodExpenses = categories.map((cat) => {
    const items = periodExpenses.filter(
      (e) => e.category_id === cat.id
    )

    const total = items.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    )

    return { category: cat, items, total }
  }).filter(group => group.items.length > 0)

  // Проверка, можно ли добавить расход
  const isAddButtonDisabled = !amount || amount === "0" || !categoryId

  // Вычисляем процент для прогресс-бара (от 0 до 100)
  const progressPercentage = isTimerActive ? (deleteTimer / 5) * 100 : 0

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* GLASS BACKGROUND */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-transparent to-indigo-500/20 blur-3xl pointer-events-none" />
      
      {/* HEADER */}
      <header className="relative py-4 px-6 flex items-center justify-between border-b border-white/20 bg-white/60 dark:bg-white/5 backdrop-blur-xl">
        {/* Logo */}
        {/* Logo */}
<Link to="/" className="group relative">
  <div className="relative w-[48px] h-[48px]">

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

  </div>
</Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/expenses" 
            className="flex items-center gap-1 text-primary font-medium"
          >
            <TrendingDown className="w-4 h-4" />
            <span>Расходы</span>
          </Link>
          <Link 
            to="/income" 
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
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

        {/* Right side - Logout and Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="outline" size="icon" className="backdrop-blur">
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Logout button */}
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
        <Link to="/expenses" className="text-primary">
          <TrendingDown className="w-5 h-5" />
        </Link>
        <Link to="/income" className="text-muted-foreground hover:text-primary transition-colors">
          <TrendingUp className="w-5 h-5" />
        </Link>
        <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
          <PieChart className="w-5 h-5" />
        </Link>
      </div>

      {/* MAIN CONTENT - растягивается */}
      <main className="relative container mx-auto px-4 py-8 flex-1">
        {/* TOTALS - кликабельные блоки */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div onClick={() => handlePeriodClick('week')} className="cursor-pointer">
            <TotalCard title="Неделя" value={totalWeek} />
          </div>
          <div onClick={() => handlePeriodClick('month')} className="cursor-pointer">
            <TotalCard title="Месяц" value={totalMonth} />
          </div>
          <div onClick={() => handlePeriodClick('all')} className="cursor-pointer">
            <TotalCard title="Всего" value={totalAll} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* FORM */}
          <GlassCard>
            <CardHeader>
              <CardTitle>Добавить расход</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                type="number"
                placeholder="Сумма"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />

              <Input
                placeholder="Описание (необязательно)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Select
                value={categoryId?.toString()}
                onValueChange={(val) =>
                  setCategoryId(Number(val))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
                  {categories.map((c) => (
                    <SelectItem
                      key={c.id}
                      value={c.id.toString()}
                      className="cursor-pointer hover:bg-primary/20 focus:bg-primary/20 data-[state=checked]:bg-primary/30"
                    >
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                className="w-full backdrop-blur"
                onClick={handleCreate}
                disabled={isAddButtonDisabled}
              >
                Добавить
              </Button>
              
              {/* Подсказка, если кнопка неактивна */}
              {isAddButtonDisabled && (
                <p className="text-xs text-muted-foreground text-center">
                  {!amount || amount === "0" 
                    ? "Введите сумму" 
                    : !categoryId && "Выберите категорию"}
                </p>
              )}
            </CardContent>
          </GlassCard>

          {/* TODAY LIST */}
          <GlassCard>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Сегодня</CardTitle>
              <span className="text-lg font-bold">
                ₽{totalToday.toFixed(2)}
              </span>
            </CardHeader>

            <CardContent className="space-y-6">
              {totalToday === 0 && (
                <p className="text-sm text-muted-foreground">
                  Сегодня расходов нет 🎉
                </p>
              )}

              {groupedTodayExpenses.map((group) => {
                if (group.items.length === 0) return null

                return (
                  <div key={group.category.id} className="space-y-3">
                    <div className="flex justify-between font-medium">
                      <span>{group.category.name}</span>
                      <span>₽{group.total.toFixed(2)}</span>
                    </div>

                    {group.items.map((exp) => (
                      <div
                        key={exp.id}
                        className="flex justify-between items-center rounded-xl p-3 bg-white/40 dark:bg-white/5 backdrop-blur border border-white/20"
                      >
                        <div>
                          <p className="font-semibold">
                            ₽{exp.amount}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {exp.description || "Без описания"}
                          </p>
                        </div>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            openDeleteDialog(
                              exp.id,
                              exp.description || "Без описания",
                              Number(exp.amount),
                              exp.category_id
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

        {/* DELETE DIALOG */}
        <Dialog
          open={!!deleteId}
          onOpenChange={closeDeleteDialog}
        >
          <DialogContent className="backdrop-blur-xl bg-white/80 dark:bg-black/60 border border-white/20">
            <DialogHeader>
              <DialogTitle>
                Удалить этот расход?
              </DialogTitle>
            </DialogHeader>

            <div className="py-4 space-y-4">
              {/* Категория */}
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Категория:</span>
                <p className="text-base">
                  {deleteCategoryName}
                </p>
              </div>

              {/* Описание */}
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Описание:</span>
                <p className="text-base">
                  {deleteName || "Без описания"}
                </p>
              </div>

              {/* Сумма */}
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Сумма:</span>
                <p className="text-2xl font-bold text-destructive">
                  ₽{deleteAmount.toFixed(2)}
                </p>
              </div>
              
              {/* Индикатор таймера */}
              {(isTimerActive || isDeleteButtonEnabled) && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {isTimerActive 
                        ? "Кнопка удаления станет активной через:" 
                        : "Кнопка удаления активна"}
                    </span>
                    {isTimerActive && (
                      <span className="font-bold text-destructive">{deleteTimer}с</span>
                    )}
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-destructive transition-all duration-1000 ease-linear"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}
              
              {/* Сообщение когда кнопка активна */}
              {isDeleteButtonEnabled && (
                <p className="text-sm text-green-600 dark:text-green-400 text-center mt-2">
                  ✓ Теперь вы можете подтвердить удаление
                </p>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={cancelDelete}
              >
                Отмена
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={!isDeleteButtonEnabled}
              >
                {isDeleteButtonEnabled 
                  ? "Удалить" 
                  : isTimerActive 
                    ? `Подождите ${deleteTimer}с` 
                    : "Удалить"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* PERIOD EXPENSES SHEET */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-2xl backdrop-blur-xl bg-white/80 dark:bg-black/80 border-l border-white/20 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold">
                {getPeriodTitle(selectedPeriod)}
              </SheetTitle>
              <SheetDescription>
                Всего: ₽{periodExpenses.reduce((sum, e) => sum + Number(e.amount), 0).toFixed(2)}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {groupedPeriodExpenses.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Нет расходов за этот период
                </p>
              ) : (
                groupedPeriodExpenses.map((group) => (
                  <div key={group.category.id} className="space-y-3">
                    <div className="flex justify-between font-medium sticky top-0 bg-white/50 dark:bg-black/50 backdrop-blur p-2 rounded-lg">
                      <span>{group.category.name}</span>
                      <span>₽{group.total.toFixed(2)}</span>
                    </div>

                    {group.items.map((exp) => (
                      <div
                        key={exp.id}
                        className="flex justify-between items-center rounded-xl p-3 bg-white/40 dark:bg-white/5 backdrop-blur border border-white/20"
                      >
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">
                                ₽{exp.amount}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {exp.description || "Без описания"}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(exp.created_at!).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="destructive"
                          size="sm"
                          className="ml-2"
                          onClick={() => {
                            openDeleteDialog(
                              exp.id,
                              exp.description || "Без описания",
                              Number(exp.amount),
                              exp.category_id
                            )
                          }}
                        >
                          Удалить
                        </Button>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </SheetContent>
        </Sheet>
      </main>

      {/* FOOTER - прижат к низу */}
      <footer className="relative py-6 px-4 border-t border-white/20 bg-white/60 dark:bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto max-w-4xl text-center text-sm text-muted-foreground">
          <p>MoneyKeep • Простой учет финансов</p>
        </div>
      </footer>
    </div>
  )
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
      {children}
    </Card>
  )
}

type TotalCardProps = {
  title: string
  value: number
  highlight?: boolean
}

function TotalCard({ title, value, highlight = false }: TotalCardProps) {
  return (
    <Card
      className={`backdrop-blur-xl border border-white/20 shadow-xl transition hover:scale-[1.02] hover:shadow-2xl
      ${highlight ? "bg-primary/80 text-primary-foreground" : "bg-white/60 dark:bg-white/5"}`}
    >
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          ₽{value.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  )
}