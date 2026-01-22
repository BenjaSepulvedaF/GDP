import { Suspense } from "react"
import { DatosHuespedContent } from "./datos-huesped-content"

export default function DatosHuespedPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Cargando...</div>}>
      <DatosHuespedContent />
    </Suspense>
  )
}
