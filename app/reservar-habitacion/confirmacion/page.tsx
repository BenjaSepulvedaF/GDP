import { Suspense } from "react"
import { ConfirmacionHabitacionContent } from "./confirmacion-habitacion-content"

export default function ConfirmacionHabitacionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Cargando...</div>}>
      <ConfirmacionHabitacionContent />
    </Suspense>
  )
}
