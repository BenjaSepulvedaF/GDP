"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, BedDouble, List } from "lucide-react"
import Link from "next/link"

export default function ReservarSalonPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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

  if (!isAuthenticated) return null

  const options = [
    {
      href: "/reservar-salon/fecha",
      label: "Reservar Salón de Eventos",
      icon: CalendarDays,
      description: "Reserve un salón para su evento especial",
    },
    {
      href: "/reservar-habitacion",
      label: "Reservar Habitación",
      icon: BedDouble,
      description: "Reserve una habitación en nuestro hotel",
    },
    {
      href: "/lista-reservas",
      label: "Lista De Reservas",
      icon: List,
      description: "Consulte sus reservas existentes",
    },
  ]

  return (
    <PageLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Bienvenido al Sistema de Reservas</h1>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {options.map((option) => (
              <Link key={option.href} href={option.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-border hover:border-primary">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <option.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="font-semibold text-lg text-card-foreground mb-2">{option.label}</h2>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
