"use client"

import { Suspense } from "react"
import { PageLayout } from "@/components/page-layout"
import { SolicitudHabitacionConfirmacionContent } from "./solicitud-habitacion-confirmacion-content"

export default function ConfirmacionSolicitudHabitacionPage() {
  return (
    <PageLayout title="Solicitud Enviada" showBackButton={false}>
      <Suspense fallback={<div>Cargando...</div>}>
        <SolicitudHabitacionConfirmacionContent />
      </Suspense>
    </PageLayout>
  )
}
