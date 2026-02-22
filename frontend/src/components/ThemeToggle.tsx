import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [hover, setHover] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const isDark = theme === "dark"

  return (
    <div
      className="relative group cursor-pointer select-none"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* 🔥 Outer Neon Glow */}
      <div className="
        absolute -inset-1
        bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600
        rounded-full
        blur-lg
        opacity-70
        group-hover:opacity-100
        transition duration-300
      " />

      {/* 🔥 Extra Soft Glow */}
      <div className="
        absolute -inset-2
        bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600
        rounded-full
        blur-2xl
        opacity-40
        group-hover:opacity-70
        transition duration-500
      " />

      {/* 💎 Glass Button */}
      <div className="
        relative
        w-12 h-12
        rounded-full
        bg-black/40 backdrop-blur-xl
        border border-white/20
        flex items-center justify-center
        transition-all duration-300
        group-hover:scale-105
        active:scale-95
        overflow-hidden
      ">

        {/* 🌊 Liquid Light */}
        <div
          className="
            absolute inset-0 opacity-0 group-hover:opacity-100
            transition duration-500
          "
          style={{
            background: isDark
              ? "radial-gradient(circle at center, rgba(129,140,248,0.25), transparent 70%)"
              : "radial-gradient(circle at center, rgba(251,191,36,0.25), transparent 70%)",
          }}
        />

        {/* ☀️ Sun */}
        <Sun
          className={`
            absolute w-5 h-5
            text-cyan-300
            transition-all duration-500
            ${!isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-180 scale-0"}
          `}
          style={{
            filter: hover ? "drop-shadow(0 0 6px #22d3ee)" : "none",
          }}
        />

        {/* 🌙 Moon */}
        <Moon
          className={`
            absolute w-5 h-5
            text-cyan-300
            transition-all duration-500
            ${isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-180 scale-0"}
          `}
          style={{
            filter: hover ? "drop-shadow(0 0 6px #6366f1)" : "none",
          }}
        />
      </div>
    </div>
  )
}