import { api } from "./client"

export type Income = {
  id: number
  amount: number
  description: string
  category_id: number
  created_at?: string
}

/* GET */
export const getIncome = async (): Promise<Income[]> => {
  const res = await api.get("/income")
  return res.data
}

/* POST */
export const createIncome = async (data: {
  amount: number
  description: string
  category_id: number
}) => {
  const res = await api.post("/income", data)
  return res.data
}

/* PATCH */
export const updateIncome = async (
  id: number,
  data: Partial<{
    amount: number
    description: string
    category_id: number
  }>
) => {
  const res = await api.patch(`/income/${id}`, data)
  return res.data
}

/* DELETE */
export const deleteIncome = async (id: number) => {
  const res = await api.delete(`/income/${id}`)
  return res.data
}