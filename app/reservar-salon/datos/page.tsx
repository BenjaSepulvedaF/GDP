"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft } from "lucide-react"

const salones: Record<number, { nombre: string; capacidad: number }> = {
  1: { nombre: "Salón Coral", capacidad: 50 },
  2: { nombre: "Salón Perla", capacidad: 100 },
  3: { nombre: "Salón Marino", capacidad: 150 },
  4: { nombre: "Salón Brisa", capacidad: 250 },
}

export default function RellenarDatosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fecha = searchParams.get("fecha")
  const salonId = searchParams.get("salon")

  const salonSeleccionado = salonId ? salones[Number(salonId)] : null
  const capacidadMaxima = salonSeleccionado?.capacidad || 50

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    numeroPersonas: "",
    descripcion: "",
    tieneAbono: false,
    montoAbono: "",
    horaInicioEvento: "",
    horaFinEvento: "",
  })

  const ALLOWED_START = "09:00"
  const ALLOWED_END = "01:00"

  const [timeErrors, setTimeErrors] = useState({ inicio: "", fin: "" })

  const isAllowedWindow = (time: string) => {
    if (!time) return true
    return time >= ALLOWED_START || time <= ALLOWED_END
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      tieneAbono: checked,
      montoAbono: checked ? prev.montoAbono : "",
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // validar horas obligatorias
    const inicio = formData.horaInicioEvento
    const fin = formData.horaFinEvento
    if (!inicio) {
      setTimeErrors((t) => ({ ...t, inicio: "Ingrese la hora de inicio del evento" }))
      return
    }
    if (!isAllowedWindow(inicio)) {
      setTimeErrors((t) => ({ ...t, inicio: `Horario permitido: ${ALLOWED_START} – ${ALLOWED_END}` }))
      return
    }
    if (!fin) {
      setTimeErrors((t) => ({ ...t, fin: "Ingrese la hora de fin del evento" }))
      return
    }
    if (!isAllowedWindow(fin)) {
      setTimeErrors((t) => ({ ...t, fin: `Horario permitido: ${ALLOWED_START} – ${ALLOWED_END}` }))
      return
    }
    const spansMidnight = inicio > fin
    if (!spansMidnight && inicio >= fin) {
      setTimeErrors((t) => ({ ...t, fin: "La hora de fin debe ser posterior a la de inicio" }))
      return
    }
    const params = new URLSearchParams({
      fecha: fecha || "",
      salon: salonId || "",
      email: formData.email,
      nombre: formData.nombre,
      personas: formData.numeroPersonas,
      descripcion: formData.descripcion,
      abono: formData.tieneAbono && formData.montoAbono ? formData.montoAbono : "0",
      horaInicioEvento: formData.horaInicioEvento,
      horaFinEvento: formData.horaFinEvento,
    })
    router.push(`/reservar-salon/confirmacion?${params.toString()}`)
  }

  const isFormValid =
    Boolean(
      formData.nombre &&
        formData.email &&
        formData.telefono &&
        formData.numeroPersonas &&
        formData.horaInicioEvento &&
        formData.horaFinEvento &&
        formData.horaInicioEvento < formData.horaFinEvento,
    )

  return (
    <PageLayout>
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Rellene los datos</CardTitle>
              <div className="text-center text-muted-foreground space-y-1">
                {fecha && (
                  <p>
                    Fecha:{" "}
                    {new Date(fecha).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
                {salonSeleccionado && (
                  <p>
                    Salón: {salonSeleccionado.nombre} (Capacidad: {capacidadMaxima} personas)
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ingrese su nombre completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ingrese su número de teléfono"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numeroPersonas">Número de personas</Label>
                  <Input
                    id="numeroPersonas"
                    name="numeroPersonas"
                    type="number"
                    min="1"
                    max={capacidadMaxima}
                    value={formData.numeroPersonas}
                    onChange={handleChange}
                    placeholder={`Máximo ${capacidadMaxima} personas`}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción del evento (opcional)</Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Describa brevemente el tipo de evento"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horaInicioEvento">Hora de inicio del evento</Label>
                    <Input
                      id="horaInicioEvento"
                      name="horaInicioEvento"
                      type="time"
                      required
                      value={formData.horaInicioEvento}
                      onChange={(e) => {
                        const val = e.target.value
                        setFormData((prev) => ({ ...prev, horaInicioEvento: val }))
                        if (!isAllowedWindow(val)) {
                          setTimeErrors((t) => ({ ...t, inicio: `Horario permitido: ${ALLOWED_START} – ${ALLOWED_END}` }))
                        } else if (formData.horaFinEvento && val >= formData.horaFinEvento) {
                          setTimeErrors((t) => ({ ...t, fin: "La hora de fin debe ser posterior a la de inicio" }))
                        } else {
                          setTimeErrors((t) => ({ ...t, inicio: "", fin: "" }))
                        }
                      }}
                    />
                    {timeErrors.inicio && <p className="text-sm text-red-600">{timeErrors.inicio}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horaFinEvento">Hora de fin del evento</Label>
                    <Input
                      id="horaFinEvento"
                      name="horaFinEvento"
                      type="time"
                      required
                      value={formData.horaFinEvento}
                      onChange={(e) => {
                        const val = e.target.value
                        setFormData((prev) => ({ ...prev, horaFinEvento: val }))
                        if (!isAllowedWindow(val)) {
                          setTimeErrors((t) => ({ ...t, fin: `Horario permitido: ${ALLOWED_START} – ${ALLOWED_END}` }))
                        } else if (formData.horaInicioEvento && formData.horaInicioEvento >= val) {
                          setTimeErrors((t) => ({ ...t, fin: "La hora de fin debe ser posterior a la de inicio" }))
                        } else {
                          setTimeErrors((t) => ({ ...t, fin: "" }))
                        }
                      }}
                    />
                    {timeErrors.fin && <p className="text-sm text-red-600">{timeErrors.fin}</p>}
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="tieneAbono"
                      checked={formData.tieneAbono}
                      onChange={(e) => handleCheckboxChange(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <Label htmlFor="tieneAbono" className="cursor-pointer font-medium">
                      ¿El cliente abonó una parte del precio?
                    </Label>
                  </div>
                  {formData.tieneAbono && (
                    <div className="space-y-2 ml-7">
                      <Label htmlFor="montoAbono">Monto del abono</Label>
                      <Input
                        id="montoAbono"
                        name="montoAbono"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.montoAbono}
                        onChange={handleChange}
                        placeholder="Ingrese el monto abonado"
                        required={formData.tieneAbono}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-4 w-full justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Atrás
                  </Button>
                  <Button type="submit" disabled={!isFormValid}>
                    Finalizar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
