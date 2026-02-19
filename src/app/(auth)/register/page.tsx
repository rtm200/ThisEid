"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    router.push("/login")
  }

  return (
    <div className="p-10 space-y-4 flex flex-col items-start">
      <h1>Register</h1>
      <Input
        className="border p-2 w-60"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        className="border p-2 w-60"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleRegister} className="bg-black text-white">
        Register
      </Button>

      <Button>
        <a href="/login">Login</a>
      </Button>
    </div>
  )
}
