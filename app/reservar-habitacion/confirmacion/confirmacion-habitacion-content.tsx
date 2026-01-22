"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, PawPrint } from "lucide-react"
import Link from "next/link"
import { useReservas } from "@/lib/reservas-context"

const tiposHabitacion: Record<string, string> = {
  estandar: "Habitación Estándar",
  superior: "Habitación Superior",
  suite: "Suite Ejecutiva",
}

export function ConfirmacionHabitacionContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "usuario@gmail.com"
  const nombre = searchParams.get("nombre") || "Usuario"
  const telefono = searchParams.get("telefono") || ""
  const checkIn = searchParams.get("checkIn")
  const checkOut = searchParams.get("checkOut")
  const tipo = searchParams.get("tipo")
  const pet = searchParams.get("pet") === "true"
  const nombreMascota = searchParams.get("nombreMascota")
  const horaCheckIn = searchParams.get("horaCheckIn")
  const horaCheckOut = searchParams.get("horaCheckOut")
  const abono = searchParams.get("abono")

  const { agregarReservaHabitacion } = useReservas()
  const reservaGuardada = useRef(false)

  useEffect(() => {
    // Guardar la reserva solo una vez
    if (!reservaGuardada.current && checkIn && checkOut && tipo) {
      agregarReservaHabitacion({
        tipo: "habitacion",
        tipoHabitacion: tipo,
        tipoHabitacionNombre: tiposHabitacion[tipo] || "Habitación",
        checkIn,
        checkOut,
        horaCheckIn: horaCheckIn || undefined,
        horaCheckOut: horaCheckOut || undefined,
        nombre,
        email,
        telefono,
        petFriendly: pet,
        nombreMascota: nombreMascota || undefined,
        abono: abono && Number(abono) > 0 ? Number(abono) : undefined,
      })
      reservaGuardada.current = true
    }
  }, [checkIn, checkOut, tipo, nombre, email, telefono, pet, nombreMascota, horaCheckIn, horaCheckOut, abono, agregarReservaHabitacion])

  return (
    <PageLayout>
      <div className="p-8">
        <div className="max-w-lg mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
              <CardTitle className="text-2xl">¡Reserva Confirmada!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mail className="w-5 h-5" />
                <p>Se ha enviado un correo de confirmación a</p>
              </div>
              <p className="font-semibold text-primary">{email}</p>

              {checkIn && checkOut && tipo && (
                <div className="bg-muted/50 rounded-lg p-4 mt-6 text-left">
                  <h4 className="font-semibold mb-3 text-card-foreground">Detalles de la reserva:</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Check-in:</span>{" "}
                      {new Date(checkIn).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Check-out:</span>{" "}
                      {new Date(checkOut).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Habitación:</span> {tiposHabitacion[tipo]}
                    </p>
                    {pet && (
                      <p className="flex items-center gap-1 text-accent">
                        <PawPrint className="w-4 h-4" />
                        <span>Habitación Pet Friendly {nombreMascota && `- ${nombreMascota}`}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-6 space-y-3">
                <Link href="/lista-reservas">
                  <Button className="w-full">Ver mis reservas</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full bg-transparent">
                    Volver al inicio
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
