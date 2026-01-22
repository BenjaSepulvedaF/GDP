"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, ChevronRight } from "lucide-react"

const diasCerrados = [
  new Date(2026, 0, 20), // 20 enero
  new Date(2026, 0, 27), // 27 enero
  new Date(2026, 1, 3), // 3 febrero
  new Date(2026, 1, 10), // 10 febrero
]

const diasCompletos = [
  new Date(2026, 0, 25), // 25 enero
  new Date(2026, 0, 31), // 31 enero
  new Date(2026, 1, 7), // 7 febrero
  new Date(2026, 1, 14), // 14 febrero
]

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

const isDiaCerrado = (date: Date) => diasCerrados.some((d) => isSameDay(d, date))
const isDiaCompleto = (date: Date) => diasCompletos.some((d) => isSameDay(d, date))

export default function SeleccionarFechaPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(undefined)

  const handleNext = () => {
    if (date) {
      const dateStr = date.toISOString().split("T")[0]
      router.push(`/reservar-salon/salon?fecha=${dateStr}`)
    }
  }

  const modifiers = {
    cerrado: diasCerrados,
    completo: diasCompletos,
  }

  const modifiersStyles = {
    cerrado: {
      backgroundColor: "hsl(var(--muted))",
      color: "hsl(var(--muted-foreground))",
      cursor: "not-allowed",
    },
    completo: {
      backgroundColor: "hsl(0 84% 60%)",
      color: "white",
      cursor: "not-allowed",
    },
  }

  return (
    <PageLayout>
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Seleccione una fecha</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  if (newDate && !isDiaCerrado(newDate) && !isDiaCompleto(newDate)) {
                    setDate(newDate)
                  }
                }}
                disabled={(date) => date < new Date() || isDiaCerrado(date) || isDiaCompleto(date)}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md border mb-6"
              />

              <div className="w-full mb-6 p-4 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-3">Simbología:</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-primary" />
                    <span className="text-sm text-muted-foreground">Disponible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-accent" />
                    <span className="text-sm text-muted-foreground">Día seleccionado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-muted" />
                    <span className="text-sm text-muted-foreground">Cerrado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: "hsl(0 84% 60%)" }} />
                    <span className="text-sm text-muted-foreground">Completo</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 w-full justify-between">
                <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Atrás
                </Button>
                <Button onClick={handleNext} disabled={!date} className="flex items-center gap-2">
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
