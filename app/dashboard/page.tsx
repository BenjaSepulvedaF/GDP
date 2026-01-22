"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { PageLayout } from "@/components/page-layout"
import { CalendarDays, BedDouble, List } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth() // Añadido isLoading
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Solo redirigir cuando terminó de cargar
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const isCliente = user.role === "cliente"

  const clienteCards = [
    {
      href: "/solicitar-salon",
      icon: CalendarDays,
      title: "Solicitar Salón de Eventos",
      description: "Solicite un salón para su evento especial",
    },
    {
      href: "/solicitar-habitacion",
      icon: BedDouble,
      title: "Solicitar Habitación",
      description: "Solicite una habitación en nuestro hotel",
    },
  ]

  const operarioCards = [
    {
      href: "/reservar-salon/fecha",
      icon: CalendarDays,
      title: "Reservar Salón de Eventos",
      description: "Reserve un salón para su evento especial",
    },
    {
      href: "/reservar-habitacion/fechas",
      icon: BedDouble,
      title: "Reservar Habitación",
      description: "Reserve una habitación en nuestro hotel",
    },
    {
      href: "/lista-reservas",
      icon: List,
      title: "Lista de Reservas",
      description: "Ver todas las reservas realizadas",
    },
  ]

  const cards = isCliente ? clienteCards : operarioCards

  return (
    <PageLayout title="Bienvenido" showBackButton={false}>
      <div className="space-y-8">
        <p className="text-muted-foreground text-lg">
          {isCliente
            ? "Seleccione una opción para solicitar su reserva"
            : "Seleccione una opción para gestionar las reservas"}
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className="block">
              <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center gap-5">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <card.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xl">{card.title}</h3>
                    <p className="text-muted-foreground">{card.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
