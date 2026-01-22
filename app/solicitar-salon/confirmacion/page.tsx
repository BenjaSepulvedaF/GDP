"use client"

import { Suspense } from "react"
import { PageLayout } from "@/components/page-layout"
import { SolicitudConfirmacionContent } from "./solicitud-confirmacion-content"

export default function ConfirmacionSolicitudPage() {
  return (
    <PageLayout title="Solicitud Enviada" showBackButton={false}>
      <Suspense fallback={<div>Cargando...</div>}>
        <SolicitudConfirmacionContent />
      </Suspense>
    </PageLayout>
  )
}
