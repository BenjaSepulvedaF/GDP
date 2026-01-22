"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import Link from "next/link"

export default function FechasSolicitudHabitacionPage() {
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const noches = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0

  return (
    <PageLayout title="Seleccionar Fechas" showBackButton backHref="/solicitar-habitacion">
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha de Check-in</label>
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={setCheckIn}
              disabled={(date) => date < today}
              className="rounded-xl border bg-card p-4"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha de Check-out</label>
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={setCheckOut}
              disabled={(date) => date < today || (checkIn ? date <= checkIn : false)}
              className="rounded-xl border bg-card p-4"
            />
          </div>
        </div>

        {noches > 0 && (
          <div className="text-center bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-lg">
              Total:{" "}
              <span className="font-bold text-primary">
                {noches} noche{noches > 1 ? "s" : ""}
              </span>
            </p>
          </div>
        )}

        <div className="flex justify-between">
          <Link href="/solicitar-habitacion">
            <Button variant="outline">Atrás</Button>
          </Link>
          <Link
            href={
              checkIn && checkOut
                ? `/solicitar-habitacion/habitacion?checkIn=${checkIn.toISOString().split("T")[0]}&checkOut=${checkOut.toISOString().split("T")[0]}`
                : "#"
            }
          >
            <Button disabled={!checkIn || !checkOut}>Siguiente</Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}
