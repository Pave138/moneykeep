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
  const res = await api.get("/expense")
  return res.data
}

/* POST */
export const createExpense = async (data: {
  amount: number
  description: string
  category_id: number
}) => {
  const res = await api.post("/expense", data)
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
  const res = await api.patch(`/expense/${id}`, data)
  return res.data
}

/* DELETE */
export const deleteExpense = async (id: number) => {
  const res = await api.delete(`/expense/${id}`)
  return res.data
}