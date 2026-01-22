"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, Users, MapPin, Bed, PawPrint } from "lucide-react"
import { useReservas, type Reserva } from "@/lib/reservas-context"

// ... existing code for EstadoIndicador, ReservaSalonCard, ReservaHabitacionCard ...

const EstadoIndicador = ({ estado }: { estado: string }) => {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    confirmada: {
      bg: "bg-accent",
      text: "text-accent-foreground",
      label: "Confirmada",
    },
    pendiente: {
      bg: "bg-primary",
      text: "text-primary-foreground",
      label: "Pendiente",
    },
    cerrado: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      label: "Cerrado",
    },
    completo: {
      bg: "bg-destructive",
      text: "text-destructive-foreground",
      label: "Completo",
    },
  }

  const statusConfig = config[estado] || config.pendiente

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
    >
      <span className="w-2 h-2 rounded-full bg-current opacity-80" />
      {statusConfig.label}
    </span>
  )
}

function ReservaSalonCard({ reserva }: { reserva: Reserva & { tipo: "salon" } }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg text-card-foreground">{reserva.salon}</h3>
              <EstadoIndicador estado={reserva.estado} />
            </div>
            <p className="text-muted-foreground">{reserva.descripcion || "Evento en salón"}</p>
            <p className="text-sm text-muted-foreground">Reservado por: {reserva.nombre}</p>
            {reserva.abono && reserva.abono > 0 && (
              <p className="text-sm font-medium text-green-600">Abono: ${reserva.abono}</p>
            )}
          </div>

          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="w-4 h-4" />
              <span>
                {new Date(reserva.fecha).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            {reserva.personas > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{reserva.personas} personas</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ReservaHabitacionCard({ reserva }: { reserva: Reserva & { tipo: "habitacion" } }) {
  const noches = Math.ceil(
    (new Date(reserva.checkOut).getTime() - new Date(reserva.checkIn).getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Bed className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg text-card-foreground">{reserva.tipoHabitacionNombre}</h3>
              <EstadoIndicador estado={reserva.estado} />
            </div>
            <p className="text-muted-foreground">
              {noches} {noches === 1 ? "noche" : "noches"}
            </p>
            <p className="text-sm text-muted-foreground">Huésped: {reserva.nombre}</p>
            {reserva.petFriendly && (
              <p className="flex items-center gap-1 text-sm text-accent">
                <PawPrint className="w-4 h-4" />
                <span>Pet Friendly {reserva.nombreMascota && `- ${reserva.nombreMascota}`}</span>
              </p>
            )}
            {reserva.abono && reserva.abono > 0 && (
              <p className="text-sm font-medium text-green-600">Abono: ${reserva.abono}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="w-4 h-4" />
              <span>
                Check-in:{" "}
                {new Date(reserva.checkIn).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })}
                {reserva.horaCheckIn && ` - ${reserva.horaCheckIn}`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="w-4 h-4" />
              <span>
                Check-out:{" "}
                {new Date(reserva.checkOut).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })}
                {reserva.horaCheckOut && ` - ${reserva.horaCheckOut}`}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ListaReservasPage() {
  const { reservas } = useReservas()
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

  return (
    <PageLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6">Listado de reservas</h1>

          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium text-foreground mb-3">Simbología de estados:</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Pendiente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-accent" />
                <span className="text-sm text-muted-foreground">Confirmada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-muted" />
                <span className="text-sm text-muted-foreground">Cerrado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-destructive" />
                <span className="text-sm text-muted-foreground">Completo</span>
              </div>
            </div>
          </div>

          {reservas.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No tiene reservas activas</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reservas.map((reserva) =>
                reserva.tipo === "salon" ? (
                  <ReservaSalonCard key={reserva.id} reserva={reserva} />
                ) : (
                  <ReservaHabitacionCard key={reserva.id} reserva={reserva} />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
