"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "cliente" | "operario"

interface User {
  nombre: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (nombre: string, role: UserRole) => void
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean // Añadido estado de carga
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Inicia cargando
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("hotel_user")
      if (saved) {
        setUser(JSON.parse(saved))
      }
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && !isLoading) {
      if (user) {
        sessionStorage.setItem("hotel_user", JSON.stringify(user))
      } else {
        sessionStorage.removeItem("hotel_user")
      }
    }
  }, [user, isLoading])

  useEffect(() => {
    if (shouldRedirect) {
      router.push(shouldRedirect)
      setShouldRedirect(null)
    }
  }, [shouldRedirect, router])

  const login = (nombre: string, role: UserRole) => {
    setUser({ nombre, role })
    setShouldRedirect("/dashboard")
  }

  const logout = () => {
    setUser(null)
    setShouldRedirect("/")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}
