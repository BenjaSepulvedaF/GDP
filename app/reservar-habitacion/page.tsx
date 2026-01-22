"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BedDouble, Star, Crown, PawPrint } from "lucide-react"
import Link from "next/link"

export default function ReservarHabitacionPage() {
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

  const tiposHabitacion = [
    {
      tipo: "Estándar",
      total: 80,
      petFriendly: 40,
      icon: BedDouble,
      descripcion: "Habitación cómoda con todas las comodidades básicas",
    },
    {
      tipo: "Superior",
      total: 30,
      petFriendly: 0,
      icon: Star,
      descripcion: "Habitación con vista al mar y amenidades premium",
    },
    {
      tipo: "Suite Ejecutiva",
      total: 10,
      petFriendly: 0,
      icon: Crown,
      descripcion: "Suite de lujo con sala de estar y servicios exclusivos",
    },
  ]

  return (
    <PageLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Reservar Habitación</CardTitle>
              <p className="text-center text-muted-foreground">Contamos con 120 habitaciones para su comodidad</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-8">
                {tiposHabitacion.map((hab) => (
                  <div key={hab.tipo} className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <hab.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{hab.tipo}</h3>
                        <p className="text-sm text-muted-foreground">{hab.total} habitaciones</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{hab.descripcion}</p>
                    {hab.petFriendly > 0 && (
                      <div className="flex items-center gap-1 text-xs text-accent">
                        <PawPrint className="w-3 h-3" />
                        <span>{hab.petFriendly} Pet Friendly</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <PawPrint className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Política Pet Friendly:</strong> Aceptamos mascotas en 40
                    habitaciones estándar habilitadas.
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <Link href="/reservar-habitacion/fechas">
                  <Button size="lg">Comenzar Reserva</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
