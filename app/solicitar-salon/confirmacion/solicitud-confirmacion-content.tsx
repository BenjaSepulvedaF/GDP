"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, Clock } from "lucide-react"

export function SolicitudConfirmacionContent() {
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const fecha = searchParams.get("fecha")
  const salon = searchParams.get("salon")
  const nombre = searchParams.get("nombre")
  const email = searchParams.get("email")
  const personas = searchParams.get("personas")

  return (
    <div className="max-w-lg mx-auto text-center space-y-6">
      <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
        <Clock className="w-10 h-10 text-amber-600" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground">¡Solicitud Enviada!</h2>
        <p className="text-muted-foreground mt-2">Su solicitud ha sido recibida y está pendiente de aprobación</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 text-left space-y-3">
        <h3 className="font-semibold text-center mb-4">Detalles de la Solicitud</h3>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Salón:</span>
          <span className="font-medium">{salon}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fecha:</span>
          <span className="font-medium">{fecha ? new Date(fecha).toLocaleDateString("es-ES") : ""}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Personas:</span>
          <span className="font-medium">{personas}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Solicitante:</span>
          <span className="font-medium">{nombre}</span>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
        <Mail className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-800 text-left">
          Un operario revisará su solicitud y le contactará al correo <strong>{email}</strong> para confirmar la
          reserva.
        </p>
      </div>

      <Link href="/dashboard">
        <Button size="lg" className="w-full">
          Volver al Inicio
        </Button>
      </Link>
    </div>
  )
}
