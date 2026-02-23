import { api } from "./client"

export type Expense = {
  id: number
  amount: number
  description: string
  category_id: number
  created_at?: string
}

/* GET */
export const getExpenses = async (): Promise<Expense[]> => {
  const res = await api.get("/api/expense")
  return res.data
}

/* POST */
export const createExpense = async (data: {
  amount: number
  description: string
  category_id: number
}) => {
  const res = await api.post("/api/expense", data)
  return res.data
}

/* PATCH */
export const updateExpense = async (
  id: number,
  data: Partial<{
    amount: number
    description: string
    category_id: number
  }>
) => {
  const res = await api.patch(`/api/expense/${id}`, data)
  return res.data
}

/* DELETE */
export const deleteExpense = async (id: number) => {
  const res = await api.delete(`/api/expense/${id}`)
  return res.data
}