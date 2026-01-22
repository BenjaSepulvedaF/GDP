"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useReservas } from "@/lib/reservas-context"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

const salones: Record<number, { nombre: string; capacidad: number }> = {
  1: { nombre: "Salón Coral", capacidad: 50 },
  2: { nombre: "Salón Perla", capacidad: 100 },
  3: { nombre: "Salón Marino", capacidad: 150 },
  4: { nombre: "Salón Brisa", capacidad: 250 },
}

function DatosContent() {
  const searchParams = useSearchParams()
  const fecha = searchParams.get("fecha")
  const salonId = Number(searchParams.get("salon"))
  const salon = salones[salonId]
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { agregarReservaSalon } = useReservas()

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    personas: "",
    descripcion: "",
    tieneAbono: false,
    montoAbono: "",
    horaInicioEvento: "",
    horaFinEvento: "",
  })

  const [timeErrors, setTimeErrors] = useState({ inicio: "", fin: "" })
  const ALLOWED_START = "09:00"
  const ALLOWED_END = "01:00"

  const isAllowedWindow = (time: string) => {
    if (!time) return true
    return time >= ALLOWED_START || time <= ALLOWED_END
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !salon) return null

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
    // check order across midnight: if start <= end and both in same day, require start < end; if start > end, it's valid (spans midnight)
    const spansMidnight = inicio > fin
    if (!spansMidnight && inicio >= fin) {
      setTimeErrors((t) => ({ ...t, fin: "La hora de fin debe ser posterior a la de inicio" }))
      return
    }

    // Guardar solicitud (con estado pendiente para clientes)
    agregarReservaSalon({
      tipo: "salon",
      salon: salon.nombre,
      salonId: salonId,
      fecha: fecha || "",
      horaInicioEvento: formData.horaInicioEvento,
      horaFinEvento: formData.horaFinEvento,
      personas: Number(formData.personas),
      nombre: formData.nombre,
      email: formData.email,
      descripcion: formData.descripcion,
      abono: formData.tieneAbono && formData.montoAbono ? Number(formData.montoAbono) : undefined,
    })

    const params = new URLSearchParams({
      fecha: fecha || "",
      salon: salon.nombre,
      nombre: formData.nombre,
      email: formData.email,
      personas: formData.personas,
      horaInicioEvento: formData.horaInicioEvento,
      horaFinEvento: formData.horaFinEvento,
    })
    router.push(`/solicitar-salon/confirmacion?${params.toString()}`)
  }

  const isFormValid =
    Boolean(formData.nombre && formData.email && formData.personas && formData.horaInicioEvento && formData.horaFinEvento && formData.horaInicioEvento < formData.horaFinEvento)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <p className="text-sm">
          <span className="font-medium">{salon.nombre}</span> - Capacidad máxima: {salon.capacidad} personas
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Fecha: {fecha ? new Date(fecha).toLocaleDateString("es-ES") : ""}
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
          <label className="text-sm font-medium">Número de personas</label>
          <Input
            type="number"
            required
            min="1"
            max={salon.capacidad}
            value={formData.personas}
            onChange={(e) => setFormData({ ...formData, personas: e.target.value })}
            placeholder={`Máximo ${salon.capacidad} personas`}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descripción del evento (opcional)</label>
          <Textarea
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Describa brevemente su evento"
            rows={3}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Hora de inicio del evento</label>
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
            <label className="text-sm font-medium">Hora de fin del evento</label>
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
        <Link href={`/solicitar-salon/salon?fecha=${fecha}`}>
          <Button type="button" variant="outline">
            Atrás
          </Button>
        </Link>
        <Button type="submit" disabled={!isFormValid}>
          Enviar Solicitud
        </Button>
      </div>
    </form>
  )
}

export default function DatosSolicitudPage() {
  return (
    <PageLayout title="Datos de la Solicitud" showBackButton backHref="/solicitar-salon/salon">
      <Suspense fallback={<div>Cargando...</div>}>
        <DatosContent />
      </Suspense>
    </PageLayout>
  )
}
