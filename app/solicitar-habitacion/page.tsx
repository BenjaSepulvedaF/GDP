"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BedDouble, PawPrint } from "lucide-react"

export default function SolicitarHabitacionPage() {
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

  const habitaciones = [
    { tipo: "Estándar", cantidad: 80, precio: "$80/noche" },
    { tipo: "Superior con vista al mar", cantidad: 30, precio: "$120/noche" },
    { tipo: "Suite Ejecutiva", cantidad: 10, precio: "$200/noche" },
  ]

  return (
    <PageLayout title="Solicitar Habitación" showBackButton backHref="/dashboard">
      <div className="space-y-8">
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-primary" />
            Nuestras Habitaciones
          </h2>
          <div className="space-y-3">
            {habitaciones.map((hab) => (
              <div
                key={hab.tipo}
                className="bg-card border border-border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">{hab.tipo}</h3>
                  <p className="text-sm text-muted-foreground">{hab.cantidad} habitaciones disponibles</p>
                </div>
                <span className="font-semibold text-primary">{hab.precio}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <PawPrint className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Política Pet Friendly</p>
            <p className="text-sm text-amber-700">40 habitaciones estándar habilitadas para mascotas</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Link href="/solicitar-habitacion/fechas">
            <Button size="lg">Iniciar Solicitud</Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}
