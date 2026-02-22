import { api } from "./client"

/* ================= LOGIN ================= */

export const loginApi = async (email: string, password: string) => {
  const params = new URLSearchParams()
  params.append("username", email)
  params.append("password", password)

  const res = await api.post("/auth/jwt/login", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })

  return res.data
}

/* ================= REGISTER ================= */

export const registerApi = async (
  email: string,
  password: string
) => {
  const res = await api.post("/auth/register", {
    email,
    password,
  })

  return res.data
}

/* ================= CURRENT USER ================= */

export const getMeApi = async () => {
  const res = await api.get("/users/me")
  return res.data
}