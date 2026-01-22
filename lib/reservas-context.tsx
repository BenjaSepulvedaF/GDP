"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface ReservaSalon {
  id: string
  tipo: "salon"
  salon: string
  salonId: number
  fecha: string
  horaInicioEvento?: string
  horaFinEvento?: string
  personas: number
  nombre: string
  email: string
  descripcion?: string
  abono?: number
  estado: "pendiente" | "confirmada"
  fechaCreacion: string
}

export interface ReservaHabitacion {
  id: string
  tipo: "habitacion"
  tipoHabitacion: string
  tipoHabitacionNombre: string
  checkIn: string
  checkOut: string
  horaCheckIn?: string
  horaCheckOut?: string
  nombre: string
  email: string
  telefono: string
  petFriendly: boolean
  nombreMascota?: string
  abono?: number
  estado: "pendiente" | "confirmada"
  fechaCreacion: string
}

export type Reserva = ReservaSalon | ReservaHabitacion

interface ReservasContextType {
  reservas: Reserva[]
  agregarReservaSalon: (reserva: Omit<ReservaSalon, "id" | "fechaCreacion" | "estado">) => void
  agregarReservaHabitacion: (reserva: Omit<ReservaHabitacion, "id" | "fechaCreacion" | "estado">) => void
  marcarAbono: (id: string, monto: number) => void
}

const ReservasContext = createContext<ReservasContextType | undefined>(undefined)

export function ReservasProvider({ children }: { children: ReactNode }) {
  const [reservas, setReservas] = useState<Reserva[]>([
    // Reservas de ejemplo iniciales
    {
      id: "ejemplo-1",
      tipo: "salon",
      salon: "Salón Coral",
      salonId: 1,
      fecha: "2026-02-15",
      personas: 45,
      nombre: "Juan Pérez",
      email: "juan@ejemplo.com",
      descripcion: "Conferencia empresarial",
      estado: "confirmada",
      fechaCreacion: "2026-01-10",
    },
    {
      id: "ejemplo-2",
      tipo: "habitacion",
      tipoHabitacion: "superior",
      tipoHabitacionNombre: "Habitación Superior",
      checkIn: "2026-02-20",
      checkOut: "2026-02-25",
      nombre: "María García",
      email: "maria@ejemplo.com",
      telefono: "+1234567890",
      petFriendly: false,
      estado: "confirmada",
      fechaCreacion: "2026-01-12",
    },
  ])

  const agregarReservaSalon = (reserva: Omit<ReservaSalon, "id" | "fechaCreacion" | "estado">) => {
    const nuevaReserva: ReservaSalon = {
      ...reserva,
      id: `salon-${Date.now()}`,
      estado: "confirmada",
      fechaCreacion: new Date().toISOString().split("T")[0],
    }
    setReservas((prev) => [nuevaReserva, ...prev])
  }

  const agregarReservaHabitacion = (reserva: Omit<ReservaHabitacion, "id" | "fechaCreacion" | "estado">) => {
    const nuevaReserva: ReservaHabitacion = {
      ...reserva,
      id: `habitacion-${Date.now()}`,
      estado: "confirmada",
      fechaCreacion: new Date().toISOString().split("T")[0],
    }
    setReservas((prev) => [nuevaReserva, ...prev])
  }

  const marcarAbono = (id: string, monto: number) => {
    setReservas((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r
        return { ...r, abono: monto, estado: "confirmada" } as Reserva
      }),
    )
  }

  return (
    <ReservasContext.Provider
      value={{ reservas, agregarReservaSalon, agregarReservaHabitacion, marcarAbono }}
    >
      {children}
    </ReservasContext.Provider>
  )
}

export function useReservas() {
  const context = useContext(ReservasContext)
  if (context === undefined) {
    throw new Error("useReservas debe usarse dentro de un ReservasProvider")
  }
  return context
}
