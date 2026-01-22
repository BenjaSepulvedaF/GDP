"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Waves } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [mail, setMail] = useState("")
  const { login } = useAuth()

  const handleLogin = () => {
    const mailLimpio = mail.trim().toLowerCase()
    if (!mailLimpio) return

    const role =
      mailLimpio === "operario@costaazul.cl"
        ? "operario"
        : "cliente"

    login(mailLimpio, role)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Waves className="w-9 h-9 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Hotel Costa Azul</CardTitle>
          <CardDescription>Sistema de Reservas y Solicitudes</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Correo electrónico</label>
            <Input
              type="email"
              placeholder="Ingrese su mail"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
            />
          </div>

          <Button
            onClick={handleLogin}
            disabled={!mail.trim()}
            className="w-full"
          >
            Ingresar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
