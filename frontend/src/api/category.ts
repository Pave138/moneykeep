import { api } from "./client"

export type Category = {
  id: number
  name: string
}

/* =========================
   EXPENSE CATEGORIES
========================= */

// GET expense categories
export const getExpenseCategories = async (): Promise<Category[]> => {
  const res = await api.get("/category/expense")
  return res.data
}

// CREATE expense category (если нужен админ функционал)
export const createExpenseCategory = async (name: string) => {
  const res = await api.post("/category/expense", { name })
  return res.data
}

// UPDATE expense category
export const updateExpenseCategory = async (
  id: number,
  name: string
) => {
  const res = await api.patch(`/category/expense/${id}`, { name })
  return res.data
}

// DELETE expense category
export const deleteExpenseCategory = async (id: number) => {
  const res = await api.delete(`/category/expense/${id}`)
  return res.data
}


/* =========================
   INCOME CATEGORIES
========================= */

// GET income categories
export const getIncomeCategories = async (): Promise<Category[]> => {
  const res = await api.get("/category/income")
  return res.data
}

// CREATE income category
export const createIncomeCategory = async (name: string) => {
  const res = await api.post("/category/income", { name })
  return res.data
}

// UPDATE income category
export const updateIncomeCategory = async (
  id: number,
  name: string
) => {
  const res = await api.patch(`/category/income/${id}`, { name })
  return res.data
}

// DELETE income category
export const deleteIncomeCategory = async (id: number) => {
  const res = await api.delete(`/category/income/${id}`)
  return res.data
}