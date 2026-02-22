type User = {
  id: number
  email: string
  is_superuser: boolean
}

const TOKEN_KEY = "token"
const USER_KEY = "user"

export const authStore = {
  /* ================= TOKEN ================= */

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
  },

  /* ================= USER ================= */

  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null

    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },

  setUser(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  /* ================= AUTH ================= */

  login(token: string, user: User) {
    this.setToken(token)
    this.setUser(user)
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)

    // уведомляем вкладки
    window.dispatchEvent(new Event("storage"))
  },

  isAuth(): boolean {
    return !!this.getToken()
  },

  isSuperuser(): boolean {
    return !!this.getUser()?.is_superuser
  },

  /* ================= HELPERS ================= */

  get user(): User | null {
    return this.getUser()
  },
}