"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarDays, Users } from "lucide-react"

export default function SolicitarSalonPage() {
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

  if (!isAuthenticated) return null

  const salones = [
    { id: 1, nombre: "Salón Coral", capacidad: 50 },
    { id: 2, nombre: "Salón Perla", capacidad: 100 },
    { id: 3, nombre: "Salón Marino", capacidad: 150 },
    { id: 4, nombre: "Salón Brisa", capacidad: 250 },
  ]

  return (
    <PageLayout title="Solicitar Salón de Eventos" showBackButton backHref="/dashboard">
      <div className="space-y-8">
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Nuestros Salones de Eventos
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {salones.map((salon) => (
              <div key={salon.id} className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-medium">{salon.nombre}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Users className="w-4 h-4" />
                  Capacidad: {salon.capacidad} personas
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Proceso de Solicitud</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                1
              </div>
              <span>Seleccione la fecha de su evento</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                2
              </div>
              <span>Elija el salón que mejor se adapte a sus necesidades</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                3
              </div>
              <span>Complete sus datos de contacto</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                4
              </div>
              <span>Un operario revisará su solicitud y le contactará</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Link href="/solicitar-salon/fecha">
            <Button size="lg">Iniciar Solicitud</Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}
