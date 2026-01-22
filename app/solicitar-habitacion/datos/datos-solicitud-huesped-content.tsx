"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useReservas } from "@/lib/reservas-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { PawPrint } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const habitacionesInfo: Record<string, { nombre: string; precio: number }> = {
  estandar: { nombre: "Habitación Estándar", precio: 80 },
  superior: { nombre: "Habitación Superior", precio: 120 },
  suite: { nombre: "Suite Ejecutiva", precio: 200 },
}

export function DatosSolicitudHuespedContent() {
  const searchParams = useSearchParams()
  const checkIn = searchParams.get("checkIn")
  const checkOut = searchParams.get("checkOut")
  const tipo = searchParams.get("tipo") || ""
  const petFriendly = searchParams.get("petFriendly") === "true"
  const habitacion = habitacionesInfo[tipo]
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { agregarReservaHabitacion } = useReservas()

  type FormData = {
    nombre: string
    email: string
    telefono: string
    nombreMascota: string
    tieneAbono: boolean
    montoAbono: string
    horaCheckIn: string
    horaCheckOut: string
  }

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    nombreMascota: "",
    tieneAbono: false,
    montoAbono: "",
    horaCheckIn: "",
    horaCheckOut: "",
  })

  const [timeErrors, setTimeErrors] = useState({ horaCheckIn: "", horaCheckOut: "" })

  const CHECKIN_MIN = "08:00"
  const CHECKIN_MAX = "15:00"
  const CHECKOUT_MIN = "08:00"
  const CHECKOUT_MAX = "13:00"

  const isTimeInRange = (time: string, min: string, max: string) => {
    if (!time) return true
    return time >= min && time <= max
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement
    const { name, value, type, checked } = target
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked } as unknown as FormData))
      return
    }

    if (name === "horaCheckIn") {
      if (!isTimeInRange(value, CHECKIN_MIN, CHECKIN_MAX)) {
        setTimeErrors((prev) => ({ ...prev, horaCheckIn: `La hora de check-in debe estar entre ${CHECKIN_MIN} y ${CHECKIN_MAX}` }))
      } else {
        setTimeErrors((prev) => ({ ...prev, horaCheckIn: "" }))
      }
    }

    if (name === "horaCheckOut") {
      if (!isTimeInRange(value, CHECKOUT_MIN, CHECKOUT_MAX)) {
        setTimeErrors((prev) => ({ ...prev, horaCheckOut: `La hora de check-out debe estar entre ${CHECKOUT_MIN} y ${CHECKOUT_MAX}` }))
      } else {
        setTimeErrors((prev) => ({ ...prev, horaCheckOut: "" }))
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value } as unknown as FormData))
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !habitacion) return null

  const noches =
    checkIn && checkOut
      ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
      : 0
  const total = habitacion.precio * noches

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      tieneAbono: checked,
      montoAbono: checked ? prev.montoAbono : "",
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validar presencia y rangos de hora antes de enviar
    if (!formData.horaCheckIn) {
      setTimeErrors((prev) => ({ ...prev, horaCheckIn: `Ingrese la hora de check-in` }))
      return
    }
    if (!isTimeInRange(formData.horaCheckIn, CHECKIN_MIN, CHECKIN_MAX)) {
      setTimeErrors((prev) => ({ ...prev, horaCheckIn: `La hora de check-in debe estar entre ${CHECKIN_MIN} y ${CHECKIN_MAX}` }))
      return
    }
    if (!formData.horaCheckOut) {
      setTimeErrors((prev) => ({ ...prev, horaCheckOut: `Ingrese la hora de check-out` }))
      return
    }
    if (!isTimeInRange(formData.horaCheckOut, CHECKOUT_MIN, CHECKOUT_MAX)) {
      setTimeErrors((prev) => ({ ...prev, horaCheckOut: `La hora de check-out debe estar entre ${CHECKOUT_MIN} y ${CHECKOUT_MAX}` }))
      return
    }

    agregarReservaHabitacion({
      tipo: "habitacion",
      tipoHabitacion: tipo,
      tipoHabitacionNombre: habitacion.nombre,
      checkIn: checkIn || "",
      checkOut: checkOut || "",
      horaCheckIn: formData.horaCheckIn || undefined,
      horaCheckOut: formData.horaCheckOut || undefined,
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      petFriendly,
      nombreMascota: petFriendly ? formData.nombreMascota : undefined,
      abono: formData.tieneAbono && formData.montoAbono ? Number(formData.montoAbono) : undefined,
    })

    const params = new URLSearchParams({
      checkIn: checkIn || "",
      checkOut: checkOut || "",
      tipo: habitacion.nombre,
      nombre: formData.nombre,
      email: formData.email,
      total: total.toString(),
      petFriendly: petFriendly.toString(),
    })
    if (formData.horaCheckIn) params.set("horaCheckIn", formData.horaCheckIn)
    if (formData.horaCheckOut) params.set("horaCheckOut", formData.horaCheckOut)
    if (petFriendly && formData.nombreMascota) {
      params.set("nombreMascota", formData.nombreMascota)
    }
    router.push(`/solicitar-habitacion/confirmacion?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <p className="font-medium">{habitacion.nombre}</p>
        <p className="text-sm text-muted-foreground">
          {checkIn} al {checkOut} ({noches} noches) - Total estimado: ${total}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre completo</label>
          <Input
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ingrese su nombre"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Correo electrónico</label>
          <Input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Teléfono</label>
          <Input
            type="tel"
            required
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            placeholder="+1234567890"
          />
        </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horaCheckIn">Hora de Check-in</Label>
                    <Input
                      id="horaCheckIn"
                      name="horaCheckIn"
                      type="time"
                      min={CHECKIN_MIN}
                      max={CHECKIN_MAX}
                      required
                      value={formData.horaCheckIn}
                      onChange={handleChange}
                      placeholder="14:00"
                    />
                    {timeErrors.horaCheckIn && (
                      <p className="text-sm text-red-600">{timeErrors.horaCheckIn}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horaCheckOut">Hora de Check-out</Label>
                    <Input
                      id="horaCheckOut"
                      name="horaCheckOut"
                      type="time"
                      min={CHECKOUT_MIN}
                      max={CHECKOUT_MAX}
                      required
                      value={formData.horaCheckOut}
                      onChange={handleChange}
                      placeholder="12:00"
                    />
                    {timeErrors.horaCheckOut && (
                      <p className="text-sm text-red-600">{timeErrors.horaCheckOut}</p>
                    )}
                  </div>
                </div>

        {petFriendly && (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <PawPrint className="w-4 h-4 text-amber-600" />
              Nombre de la mascota
            </label>
            <Input
              value={formData.nombreMascota}
              onChange={(e) => setFormData({ ...formData, nombreMascota: e.target.value })}
              placeholder="Nombre de su mascota"
            />
          </div>
        )}

        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="tieneAbono"
              checked={formData.tieneAbono}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="tieneAbono" className="cursor-pointer font-medium text-sm">
              ¿Quieres abonar un monto?
            </label>
          </div>
          {formData.tieneAbono && (
            <div className="space-y-2 ml-7">
              <label htmlFor="montoAbono" className="text-sm font-medium">Monto del abono</label>
              <Input
                id="montoAbono"
                type="number"
                min="0"
                step="0.01"
                value={formData.montoAbono}
                onChange={(e) => setFormData({ ...formData, montoAbono: e.target.value })}
                placeholder="Ingrese el monto que desea abonar"
                required={formData.tieneAbono}
              />
            </div>
          )}
        </div>
      </div>

        <div className="flex justify-between">
        <Link href={`/solicitar-habitacion/habitacion?checkIn=${checkIn}&checkOut=${checkOut}`}>
          <Button type="button" variant="outline">
            Atrás
          </Button>
        </Link>
        <Button type="submit" disabled={!(formData.nombre && formData.email && formData.telefono && formData.horaCheckIn && formData.horaCheckOut && !timeErrors.horaCheckIn && !timeErrors.horaCheckOut)}>
          Enviar Solicitud
        </Button>
      </div>
    </form>
  )
}
