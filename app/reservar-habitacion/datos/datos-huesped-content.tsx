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
import { ChevronLeft, PawPrint } from "lucide-react"

const tiposHabitacion: Record<string, string> = {
  estandar: "Habitación Estándar",
  superior: "Habitación Superior",
  suite: "Suite Ejecutiva",
}

export function DatosHuespedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const checkIn = searchParams.get("checkIn")
  const checkOut = searchParams.get("checkOut")
  const tipo = searchParams.get("tipo")
  const pet = searchParams.get("pet") === "true"

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    documento: "",
    numeroHuespedes: "",
    petNombre: "",
    solicitudesEspeciales: "",
    horaCheckIn: "",
    horaCheckOut: "",
    tieneAbono: false,
    montoAbono: "",
  })

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
    const params = new URLSearchParams({
      checkIn: checkIn || "",
      checkOut: checkOut || "",
      tipo: tipo || "",
      pet: String(pet),
      email: formData.email,
      nombre: formData.nombre,
      telefono: formData.telefono,
      nombreMascota: formData.petNombre,
      horaCheckIn: formData.horaCheckIn,
      horaCheckOut: formData.horaCheckOut,
      abono: formData.tieneAbono && formData.montoAbono ? formData.montoAbono : "0",
    })
    router.push(`/reservar-habitacion/confirmacion?${params.toString()}`)
  }

  const isFormValid =
    formData.nombre && formData.email && formData.telefono && formData.documento && formData.numeroHuespedes

  return (
    <PageLayout>
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Datos del Huésped</CardTitle>
              <div className="text-center text-muted-foreground space-y-1">
                {checkIn && checkOut && (
                  <p>
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
                {tipo && <p>{tiposHabitacion[tipo]}</p>}
                {pet && (
                  <p className="flex items-center justify-center gap-1 text-accent">
                    <PawPrint className="w-4 h-4" />
                    Habitación Pet Friendly
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
                  <Label htmlFor="documento">Documento de identidad</Label>
                  <Input
                    id="documento"
                    name="documento"
                    value={formData.documento}
                    onChange={handleChange}
                    placeholder="DNI / Pasaporte"
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
                  <Label htmlFor="numeroHuespedes">Número de huéspedes</Label>
                  <Input
                    id="numeroHuespedes"
                    name="numeroHuespedes"
                    type="number"
                    min="1"
                    max="4"
                    value={formData.numeroHuespedes}
                    onChange={handleChange}
                    placeholder="Cantidad de personas"
                    required
                  />
                </div>

                {pet && (
                  <div className="space-y-2 p-4 bg-accent/10 rounded-lg">
                    <Label htmlFor="petNombre" className="flex items-center gap-2">
                      <PawPrint className="w-4 h-4 text-accent" />
                      Nombre de la mascota
                    </Label>
                    <Input
                      id="petNombre"
                      name="petNombre"
                      value={formData.petNombre}
                      onChange={handleChange}
                      placeholder="Nombre de su mascota"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="solicitudesEspeciales">Solicitudes especiales (opcional)</Label>
                  <Textarea
                    id="solicitudesEspeciales"
                    name="solicitudesEspeciales"
                    value={formData.solicitudesEspeciales}
                    onChange={handleChange}
                    placeholder="Alergias, preferencias de cama, hora de llegada estimada, etc."
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horaCheckIn">Hora de Check-in (opcional)</Label>
                    <Input
                      id="horaCheckIn"
                      name="horaCheckIn"
                      type="time"
                      value={formData.horaCheckIn}
                      onChange={handleChange}
                      placeholder="14:00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horaCheckOut">Hora de Check-out (opcional)</Label>
                    <Input
                      id="horaCheckOut"
                      name="horaCheckOut"
                      type="time"
                      value={formData.horaCheckOut}
                      onChange={handleChange}
                      placeholder="12:00"
                    />
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
                    Finalizar Reserva
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
