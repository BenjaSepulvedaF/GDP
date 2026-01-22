"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { addDays } from "date-fns"

export default function SeleccionarFechasPage() {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)

  const handleCheckInSelect = (date: Date | undefined) => {
    setCheckIn(date)
    if (date && checkOut && date >= checkOut) {
      setCheckOut(addDays(date, 1))
    }
  }

  const handleNext = () => {
    if (checkIn && checkOut) {
      const checkInStr = checkIn.toISOString().split("T")[0]
      const checkOutStr = checkOut.toISOString().split("T")[0]
      router.push(`/reservar-habitacion/habitacion?checkIn=${checkInStr}&checkOut=${checkOutStr}`)
    }
  }

  const today = new Date()

  return (
    <PageLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Seleccione las fechas de su estadía</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 mb-6">
                <div className="flex flex-col items-center">
                  <h3 className="font-semibold mb-3 text-foreground">Fecha de entrada (Check-in)</h3>
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={handleCheckInSelect}
                    disabled={(date) => date < today}
                    className="rounded-md border"
                  />
                  {checkIn && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {checkIn.toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center">
                  <h3 className="font-semibold mb-3 text-foreground">Fecha de salida (Check-out)</h3>
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={(date) => date <= (checkIn || today)}
                    className="rounded-md border"
                  />
                  {checkOut && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {checkOut.toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>

              {checkIn && checkOut && (
                <div className="text-center mb-6 p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Estadía de{" "}
                    <span className="font-semibold text-primary">
                      {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} noche(s)
                    </span>
                  </p>
                </div>
              )}

              <div className="flex gap-4 w-full justify-between">
                <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Atrás
                </Button>
                <Button onClick={handleNext} disabled={!checkIn || !checkOut} className="flex items-center gap-2">
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
