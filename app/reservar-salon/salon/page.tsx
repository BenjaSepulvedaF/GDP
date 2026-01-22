"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Users, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const salones = [
  { id: 1, nombre: "Salón Coral", capacidad: 50, disponible: true, caracteristicas: ["No fumadores"] },
  { id: 2, nombre: "Salón Perla", capacidad: 100, disponible: true, caracteristicas: ["No fumadores"] },
  { id: 3, nombre: "Salón Marino", capacidad: 150, disponible: false, caracteristicas: ["No fumadores"] },
  { id: 4, nombre: "Salón Brisa", capacidad: 250, disponible: true, caracteristicas: ["No fumadores"] },
]

export default function SeleccionarSalonPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fecha = searchParams.get("fecha")
  const [selectedSalon, setSelectedSalon] = useState<number | null>(null)

  const handleNext = () => {
    if (selectedSalon && fecha) {
      router.push(`/reservar-salon/datos?fecha=${fecha}&salon=${selectedSalon}`)
    }
  }

  return (
    <PageLayout>
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Seleccione un salón</CardTitle>
              {fecha && (
                <p className="text-center text-muted-foreground">
                  Fecha seleccionada:{" "}
                  {new Date(fecha).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                {salones.map((salon) => (
                  <button
                    key={salon.id}
                    onClick={() => salon.disponible && setSelectedSalon(salon.id)}
                    disabled={!salon.disponible}
                    className={cn(
                      "p-4 rounded-lg border-2 text-left transition-all",
                      salon.disponible
                        ? selectedSalon === salon.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 cursor-pointer"
                        : "border-border bg-muted/50 cursor-not-allowed opacity-60",
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-card-foreground">{salon.nombre}</h3>
                      {selectedSalon === salon.id && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">Capacidad: {salon.capacidad} personas</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {salon.caracteristicas.map((car) => (
                          <span key={car} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                            {car}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-xs mt-2 inline-block px-2 py-1 rounded-full",
                        salon.disponible ? "bg-accent/20 text-accent-foreground" : "bg-destructive/20 text-destructive",
                      )}
                    >
                      {salon.disponible ? "Disponible" : "No disponible"}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 w-full justify-between">
                <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Atrás
                </Button>
                <Button onClick={handleNext} disabled={!selectedSalon} className="flex items-center gap-2">
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
