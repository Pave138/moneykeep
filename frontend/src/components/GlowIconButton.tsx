import type { ReactNode } from "react"

interface Props {
  children: ReactNode
  onClick?: () => void
  title?: string
  variant?: "default" | "danger"
  type?: "button" | "submit" | "reset"
}

export default function GlowIconButton({
  children,
  onClick,
  title,
  variant = "default",
  type = "button",
}: Props) {
  const glow =
    variant === "danger"
      ? "from-red-400 via-red-500 to-rose-600"
      : "from-cyan-400 via-blue-500 to-indigo-600"

  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      className="relative z-50 group cursor-pointer select-none focus:outline-none"
    >
      {/* Outer Glow */}
      <div
        className={`
          pointer-events-none
          absolute -inset-1
          bg-gradient-to-r ${glow}
          rounded-full blur-lg
          opacity-70
          group-hover:opacity-100
          transition duration-300
        `}
      />

      {/* Soft Glow */}
      <div
        className={`
          pointer-events-none
          absolute -inset-2
          bg-gradient-to-r ${glow}
          rounded-full blur-2xl
          opacity-40
          group-hover:opacity-70
          transition duration-500
        `}
      />

      {/* Button Body */}
      <div
        className="
          relative
          w-12 h-12
          rounded-full
          bg-black/40 backdrop-blur-xl
          border border-white/20
          flex items-center justify-center
          transition-all duration-300
          group-hover:scale-105
          active:scale-95
          text-white
        "
      >
        {children}
      </div>
    </button>
  )
}