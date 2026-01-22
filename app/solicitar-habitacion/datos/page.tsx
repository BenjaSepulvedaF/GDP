"use client"

import { Suspense } from "react"
import { PageLayout } from "@/components/page-layout"
import { DatosSolicitudHuespedContent } from "./datos-solicitud-huesped-content"

export default function DatosSolicitudHuespedPage() {
  return (
    <PageLayout title="Datos del Huésped" showBackButton backHref="/solicitar-habitacion/habitacion">
      <Suspense fallback={<div>Cargando...</div>}>
        <DatosSolicitudHuespedContent />
      </Suspense>
    </PageLayout>
  )
}
