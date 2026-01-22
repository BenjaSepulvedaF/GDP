"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, List, BedDouble, LogOut, Waves } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isCliente = user?.role === "cliente"

  const clienteNavItems = [
    {
      href: "/solicitar-salon",
      label: "Solicitar Salón de Eventos",
      icon: CalendarDays,
    },
    {
      href: "/solicitar-habitacion",
      label: "Solicitar Habitación",
      icon: BedDouble,
    },
  ]

  const operarioNavItems = [
    {
      href: "/reservar-salon/fecha",
      label: "Reservar Salón de Eventos",
      icon: CalendarDays,
    },
    {
      href: "/reservar-habitacion/fechas",
      label: "Reservar Habitación",
      icon: BedDouble,
    },
    {
      href: "/lista-reservas",
      label: "Lista De Reservas",
      icon: List,
    },
  ]

  const navItems = isCliente ? clienteNavItems : operarioNavItems

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-sidebar-primary rounded-full flex items-center justify-center">
            <Waves className="w-7 h-7 text-sidebar-primary-foreground" />
          </div>
          <div>
            <p className="text-xs text-sidebar-foreground/70">Logo Hotel</p>
            <h1 className="font-bold text-lg">Costa Azul</h1>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const basePath = item.href.split("/").slice(0, 2).join("/")
          const isActive = pathname.startsWith(basePath)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="px-4 mb-4">
          <p className="text-sm text-sidebar-foreground/80">Bienvenido, {user?.nombre || "Usuario"}</p>
          <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role || ""}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground/80 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}
