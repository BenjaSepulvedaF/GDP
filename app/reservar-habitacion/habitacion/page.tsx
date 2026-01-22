import { Suspense } from "react"
import { HabitacionContent } from "./habitacion-content"

export default function SeleccionarHabitacionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Cargando...</div>}>
      <HabitacionContent />
    </Suspense>
  )
}
