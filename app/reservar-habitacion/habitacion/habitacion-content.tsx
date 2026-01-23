"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, BedDouble, Star, Crown, PawPrint, Users, Check, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

type TipoHabitacion = "estandar" | "superior" | "suite"

const habitaciones: {
  id: TipoHabitacion
  nombre: string
  capacidad: number
  total: number
  disponibles: number
  petFriendly: number
  precio: number
  icon: typeof BedDouble
  caracteristicas: string[]
}[] = [
    {
      id: "estandar",
      nombre: "Habitación Estándar",
      capacidad: 2,
      total: 80,
      disponibles: 45,
      petFriendly: 40,
      precio: 80,
      icon: BedDouble,
      caracteristicas: ["WiFi gratis", "TV por cable", "Aire acondicionado", "Baño privado", "No fumadores"],
    },
    {
      id: "superior",
      nombre: "Habitación Superior",
      capacidad: 3,
      total: 30,
      disponibles: 18,
      petFriendly: 0,
      precio: 150,
      icon: Star,
      caracteristicas: ["Vista al mar", "WiFi gratis", "TV pantalla plana", "Minibar", "Balcón privado", "No fumadores"],
    },
    {
      id: "suite",
      nombre: "Suite Ejecutiva",
      capacidad: 4,
      total: 10,
      disponibles: 5,
      petFriendly: 0,
      precio: 280,
      icon: Crown,
      caracteristicas: [
        "Sala de estar",
        "Vista panorámica al mar",
        "Jacuzzi",
        "Servicio de habitación 24h",
        "Desayuno incluido",
        "No fumadores",
      ],
    },
  ]

export function HabitacionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const checkIn = searchParams.get("checkIn")
  const checkOut = searchParams.get("checkOut")

  const [selectedHabitacion, setSelectedHabitacion] = useState<TipoHabitacion | null>(null)
  const [petFriendly, setPetFriendly] = useState(false)

  const handleNext = () => {
    if (selectedHabitacion && checkIn && checkOut) {
      router.push(
        `/reservar-habitacion/datos?checkIn=${checkIn}&checkOut=${checkOut}&tipo=${selectedHabitacion}&pet=${petFriendly}`,
      )
    }
  }

  const selectedRoom = habitaciones.find((h) => h.id === selectedHabitacion)
  const showPetOption = selectedHabitacion === "estandar"

  return (
    <PageLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Seleccione el tipo de habitación</CardTitle>
              {checkIn && checkOut && (
                <p className="text-center text-muted-foreground">
                  {new Date(checkIn).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  -{" "}
                  {new Date(checkOut).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 mb-6">
                {habitaciones.map((hab) => (
                  <button
                    key={hab.id}
                    onClick={() => {
                      setSelectedHabitacion(hab.id)
                      if (hab.id !== "estandar") setPetFriendly(false)
                    }}
                    disabled={hab.disponibles === 0}
                    className={cn(
                      "p-4 rounded-lg border-2 text-left transition-all",
                      hab.disponibles > 0
                        ? selectedHabitacion === hab.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 cursor-pointer"
                        : "border-border bg-muted/50 cursor-not-allowed opacity-60",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <hab.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-card-foreground">{hab.nombre}</h3>
                            {selectedHabitacion === hab.id && (
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              Hasta {hab.capacidad} personas
                            </span>
                            {hab.id === "superior" && (
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                Vista al mar
                              </span>
                            )}
                            {hab.petFriendly > 0 && (
                              <span className="flex items-center gap-1 text-accent">
                                <PawPrint className="w-4 h-4" />
                                Pet Friendly ({hab.petFriendly} hab.)
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {hab.caracteristicas.slice(0, 3).map((car) => (
                              <span key={car} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                                {car}
                              </span>
                            ))}
                            {hab.caracteristicas.length > 3 && (
                              <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                                +{hab.caracteristicas.length - 3} más
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-bold text-primary">${hab.precio} USD</p>
                        <p className="text-xs text-muted-foreground">por noche</p>
                        <span
                          className={cn(
                            "text-xs mt-2 inline-block px-2 py-1 rounded-full",
                            hab.disponibles > 0
                              ? "bg-accent/20 text-accent-foreground"
                              : "bg-destructive/20 text-destructive",
                          )}
                        >
                          {hab.disponibles > 0 ? `${hab.disponibles} disponibles` : "No disponible"}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {showPetOption && (
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-6">
                  <div className="flex items-center gap-3">
                    <PawPrint className="w-5 h-5 text-accent" />
                    <div>
                      <Label htmlFor="pet-friendly" className="text-foreground font-medium">
                        ¿Viaja con mascota?
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Disponible solo en habitaciones estándar habilitadas
                      </p>
                    </div>
                  </div>
                  <Switch id="pet-friendly" checked={petFriendly} onCheckedChange={setPetFriendly} />
                </div>
              )}

              {selectedRoom && checkIn && checkOut && (
                <div className="p-4 bg-primary/5 rounded-lg mb-6">
                  <p className="text-sm text-muted-foreground">
                    Total estimado:{" "}
                    <span className="font-bold text-primary text-lg">
                      $
                      {selectedRoom.precio *
                        Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} USD
                    </span>{" "}
                    por{" "}
                    {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))}{" "}
                    noche(s)
                  </p>
                </div>
              )}

              <div className="flex gap-4 w-full justify-between">
                <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Atrás
                </Button>
                <Button onClick={handleNext} disabled={!selectedHabitacion} className="flex items-center gap-2">
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
