"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import Link from "next/link"

// Días cerrados (ejemplo: lunes)
const diasCerrados = [
  new Date(2026, 0, 19), // Lunes 19 enero
  new Date(2026, 0, 26), // Lunes 26 enero
  new Date(2026, 1, 2), // Lunes 2 febrero
]

// Días completos
const diasCompletos = [
  new Date(2026, 0, 24), // Sábado 24 enero
  new Date(2026, 1, 14), // Sábado 14 febrero (San Valentín)
]

export default function FechaSolicitudPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const isDisabledDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return true

    const isCerrado = diasCerrados.some((d) => d.toDateString() === date.toDateString())
    const isCompleto = diasCompletos.some((d) => d.toDateString() === date.toDateString())
    return isCerrado || isCompleto
  }

  const getDayStatus = (day: Date) => {
    const isCerrado = diasCerrados.some((d) => d.toDateString() === day.toDateString())
    if (isCerrado) return "cerrado"

    const isCompleto = diasCompletos.some((d) => d.toDateString() === day.toDateString())
    if (isCompleto) return "completo"

    return "disponible"
  }

  return (
    <PageLayout title="Seleccionar Fecha" showBackButton backHref="/solicitar-salon">
      <div className="space-y-6">
        {/* Leyenda */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3">Simbología</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-400"></div>
              <span className="text-sm">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm">Día seleccionado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted"></div>
              <span className="text-sm">Cerrado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-destructive"></div>
              <span className="text-sm">Completo</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate && !isDisabledDate(newDate)) {
                setDate(newDate)
              }
            }}
            disabled={isDisabledDate}
            modifiers={{
              cerrado: diasCerrados,
              completo: diasCompletos,
            }}
            modifiersClassNames={{
              cerrado: "bg-muted text-muted-foreground opacity-50",
              completo: "bg-destructive/20 text-destructive line-through",
            }}
            className="rounded-xl border bg-card p-4"
          />
        </div>

        {date && (
          <div className="text-center">
            <p className="text-muted-foreground">
              Fecha seleccionada:{" "}
              <span className="font-medium text-foreground">
                {date.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>
        )}

        <div className="flex justify-between">
          <Link href="/solicitar-salon">
            <Button variant="outline">Atrás</Button>
          </Link>
          <Link href={date ? `/solicitar-salon/salon?fecha=${date.toISOString().split("T")[0]}` : "#"}>
            <Button disabled={!date}>Siguiente</Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}
