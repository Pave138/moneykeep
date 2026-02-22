import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import ThemeToggle from "@/components/ThemeToggle"

import {
  getExpenseCategories,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
  getIncomeCategories,
  createIncomeCategory,
  updateIncomeCategory,
  deleteIncomeCategory,
} from "@/api/category"

import type { Category } from "@/api/category"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Trash2, Plus } from "lucide-react"

type Mode = "expense" | "income"

export default function AdminCategoriesPage() {
  const [mode, setMode] = useState<Mode>("expense")
  const [categories, setCategories] = useState<Category[]>([])
  const [newName, setNewName] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")

  useEffect(() => {
    loadCategories()
  }, [mode])

  const loadCategories = async () => {
    try {
      if (mode === "expense") {
        setCategories(await getExpenseCategories())
      } else {
        setCategories(await getIncomeCategories())
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleCreate = async () => {
    if (!newName.trim()) return

    try {
      if (mode === "expense") {
        await createExpenseCategory(newName)
      } else {
        await createIncomeCategory(newName)
      }

      setNewName("")
      loadCategories()
    } catch (e) {
      console.error(e)
    }
  }

  const handleUpdate = async (id: number) => {
    try {
      if (mode === "expense") {
        await updateExpenseCategory(id, editingName)
      } else {
        await updateIncomeCategory(id, editingName)
      }

      setEditingId(null)
      loadCategories()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить категорию?")) return

    try {
      if (mode === "expense") {
        await deleteExpenseCategory(id)
      } else {
        await deleteIncomeCategory(id)
      }

      loadCategories()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen">

      {/* ===== HEADER (LOGO + THEME) ===== */}
      <header className="relative py-4 px-6 flex items-center justify-between">

        {/* LOGO */}
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

        {/* THEME BUTTON */}
        <ThemeToggle />

      </header>

      {/* ===== CONTENT ===== */}
      <div className="p-6">
        <div className="max-w-3xl mx-auto space-y-6">

          <h1 className="text-3xl font-bold">
            Управление категориями
          </h1>

          {/* SWITCH MODE */}
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as Mode)}
          >
            <TabsList>
              <TabsTrigger value="expense">
                Расходы
              </TabsTrigger>
              <TabsTrigger value="income">
                Доходы
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* CREATE */}
          <Card>
            <CardHeader>
              <CardTitle>Добавить категорию</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Input
                placeholder="Название категории"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />

              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            </CardContent>
          </Card>

          {/* LIST */}
          <Card>
            <CardHeader>
              <CardTitle>Список категорий</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 rounded-xl border"
                >
                  {editingId === cat.id ? (
                    <Input
                      value={editingName}
                      onChange={(e) =>
                        setEditingName(e.target.value)
                      }
                    />
                  ) : (
                    <span className="font-medium">
                      {cat.name}
                    </span>
                  )}

                  <div className="flex gap-2">
                    {editingId === cat.id ? (
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(cat.id)}
                      >
                        Сохранить
                      </Button>
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(cat.id)
                          setEditingName(cat.name)
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(cat.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}