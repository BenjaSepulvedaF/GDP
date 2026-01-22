"use client"

import { Suspense } from "react"
import { PageLayout } from "@/components/page-layout"
import { SolicitarHabitacionContent } from "./solicitar-habitacion-content"

export default function HabitacionSolicitudPage() {
  return (
    <PageLayout title="Seleccionar Habitación" showBackButton backHref="/solicitar-habitacion/fechas">
      <Suspense fallback={<div>Cargando...</div>}>
        <SolicitarHabitacionContent />
      </Suspense>
    </PageLayout>
  )
}
