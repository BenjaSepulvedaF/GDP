"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, CheckCircle } from "lucide-react"

function SalonContent() {
  const searchParams = useSearchParams()
  const fecha = searchParams.get("fecha")
  const [selectedSalon, setSelectedSalon] = useState<number | null>(null)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const salones = [
    { id: 1, nombre: "Salón Coral", capacidad: 50, disponible: true, caracteristicas: ["No fumadores"] },
    { id: 2, nombre: "Salón Perla", capacidad: 100, disponible: true, caracteristicas: ["No fumadores"] },
    { id: 3, nombre: "Salón Marino", capacidad: 150, disponible: false, caracteristicas: ["No fumadores"] },
    { id: 4, nombre: "Salón Brisa", capacidad: 250, disponible: true, caracteristicas: ["No fumadores"] },
  ]

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Fecha seleccionada:{" "}
        <span className="font-medium text-foreground">
          {fecha
            ? new Date(fecha).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : ""}
        </span>
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {salones.map((salon) => (
          <button
            key={salon.id}
            onClick={() => salon.disponible && setSelectedSalon(salon.id)}
            disabled={!salon.disponible}
            className={`p-6 rounded-xl border-2 text-left transition-all ${
              selectedSalon === salon.id
                ? "border-primary bg-primary/5"
                : salon.disponible
                  ? "border-border hover:border-primary/50 bg-card"
                  : "border-border bg-muted/50 opacity-60 cursor-not-allowed"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{salon.nombre}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Users className="w-4 h-4" />
                  Capacidad: {salon.capacidad} personas
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {salon.caracteristicas.map((car) => (
                    <span key={car} className="text-xs bg-muted px-2 py-1 rounded">
                      {car}
                    </span>
                  ))}
                </div>
              </div>
              {selectedSalon === salon.id && <CheckCircle className="w-6 h-6 text-primary" />}
            </div>
            <div className="mt-3">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  salon.disponible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {salon.disponible ? "Disponible" : "No disponible"}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <Link href="/solicitar-salon/fecha">
          <Button variant="outline">Atrás</Button>
        </Link>
        <Link href={selectedSalon ? `/solicitar-salon/datos?fecha=${fecha}&salon=${selectedSalon}` : "#"}>
          <Button disabled={!selectedSalon}>Siguiente</Button>
        </Link>
      </div>
    </div>
  )
}

export default function SalonSolicitudPage() {
  return (
    <PageLayout title="Seleccionar Salón" showBackButton backHref="/solicitar-salon/fecha">
      <Suspense fallback={<div>Cargando...</div>}>
        <SalonContent />
      </Suspense>
    </PageLayout>
  )
}
