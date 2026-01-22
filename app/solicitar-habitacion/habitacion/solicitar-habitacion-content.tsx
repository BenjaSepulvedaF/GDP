"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { Users, Eye, Briefcase, PawPrint, CheckCircle } from "lucide-react"

const habitaciones = [
  {
    id: "estandar",
    nombre: "Habitación Estándar",
    precio: 80,
    disponibles: 80,
    icon: Users,
    caracteristicas: ["Cama doble", "WiFi", "TV", "Aire acondicionado", "No fumadores"],
    petFriendlyDisponible: true,
  },
  {
    id: "superior",
    nombre: "Habitación Superior",
    precio: 120,
    disponibles: 30,
    icon: Eye,
    caracteristicas: ["Vista al mar", "Cama king", "Minibar", "Balcón", "No fumadores"],
    petFriendlyDisponible: false,
  },
  {
    id: "suite",
    nombre: "Suite Ejecutiva",
    precio: 200,
    disponibles: 10,
    icon: Briefcase,
    caracteristicas: ["Sala de estar", "Jacuzzi", "Servicio premium", "Desayuno incluido", "No fumadores"],
    petFriendlyDisponible: false,
  },
]

export function SolicitarHabitacionContent() {
  const searchParams = useSearchParams()
  const checkIn = searchParams.get("checkIn")
  const checkOut = searchParams.get("checkOut")
  const [selectedHabitacion, setSelectedHabitacion] = useState<string | null>(null)
  const [petFriendly, setPetFriendly] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const noches =
    checkIn && checkOut
      ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
      : 0

  const habitacionSeleccionada = habitaciones.find((h) => h.id === selectedHabitacion)
  const total = habitacionSeleccionada ? habitacionSeleccionada.precio * noches : 0

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-sm text-muted-foreground">
          Check-in: <span className="font-medium text-foreground">{checkIn}</span> | Check-out:{" "}
          <span className="font-medium text-foreground">{checkOut}</span> |
          <span className="font-medium text-primary">
            {" "}
            {noches} noche{noches > 1 ? "s" : ""}
          </span>
        </p>
      </div>

      <div className="space-y-4">
        {habitaciones.map((hab) => (
          <button
            key={hab.id}
            onClick={() => {
              setSelectedHabitacion(hab.id)
              if (!hab.petFriendlyDisponible) setPetFriendly(false)
            }}
            className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
              selectedHabitacion === hab.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 bg-card"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <hab.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{hab.nombre}</h3>
                  <p className="text-sm text-muted-foreground">{hab.disponibles} disponibles</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {hab.caracteristicas.map((c) => (
                      <span key={c} className="text-xs bg-muted px-2 py-1 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">${hab.precio}</p>
                <p className="text-xs text-muted-foreground">por noche</p>
                {selectedHabitacion === hab.id && <CheckCircle className="w-6 h-6 text-primary mt-2 ml-auto" />}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedHabitacion === "estandar" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PawPrint className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800">¿Viaja con mascota?</p>
              <p className="text-sm text-amber-700">40 habitaciones Pet Friendly disponibles</p>
            </div>
          </div>
          <Switch checked={petFriendly} onCheckedChange={setPetFriendly} />
        </div>
      )}

      {total > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
          <p className="text-lg">
            Total estimado: <span className="font-bold text-primary">${total}</span>
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <Link href={`/solicitar-habitacion/fechas`}>
          <Button variant="outline">Atrás</Button>
        </Link>
        <Link
          href={
            selectedHabitacion
              ? `/solicitar-habitacion/datos?checkIn=${checkIn}&checkOut=${checkOut}&tipo=${selectedHabitacion}&petFriendly=${petFriendly}`
              : "#"
          }
        >
          <Button disabled={!selectedHabitacion}>Siguiente</Button>
        </Link>
      </div>
    </div>
  )
}
