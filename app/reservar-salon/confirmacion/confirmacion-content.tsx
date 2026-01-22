"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail } from "lucide-react"
import Link from "next/link"
import { useReservas } from "@/lib/reservas-context"

const salones: Record<number, string> = {
  1: "Salón Coral",
  2: "Salón Perla",
  3: "Salón Marino",
  4: "Salón Brisa",
}

export function ConfirmacionContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "usuario@gmail.com"
  const nombre = searchParams.get("nombre") || "Usuario"
  const fecha = searchParams.get("fecha")
  const salonId = searchParams.get("salon")
  const personas = searchParams.get("personas")
  const descripcion = searchParams.get("descripcion")
  const abono = searchParams.get("abono")

  const { agregarReservaSalon } = useReservas()
  const reservaGuardada = useRef(false)

  useEffect(() => {
    // Guardar la reserva solo una vez
    if (!reservaGuardada.current && fecha && salonId) {
      agregarReservaSalon({
        tipo: "salon",
        salon: salones[Number(salonId)] || "Salón",
        salonId: Number(salonId),
        fecha,
        personas: Number(personas) || 0,
        nombre,
        email,
        descripcion: descripcion || undefined,
        abono: abono && Number(abono) > 0 ? Number(abono) : undefined,
      })
      reservaGuardada.current = true
    }
  }, [fecha, salonId, personas, nombre, email, descripcion, abono, agregarReservaSalon])

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
                <p>Se ha mandado un correo electrónico a</p>
              </div>
              <p className="font-semibold text-primary">{email}</p>

              {fecha && salonId && (
                <div className="bg-muted/50 rounded-lg p-4 mt-6 text-left">
                  <h4 className="font-semibold mb-2 text-card-foreground">Detalles de la reserva:</h4>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Fecha:</span>{" "}
                    {new Date(fecha).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Salón:</span> {salones[Number(salonId)]}
                  </p>
                  {personas && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Personas:</span> {personas}
                    </p>
                  )}
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
