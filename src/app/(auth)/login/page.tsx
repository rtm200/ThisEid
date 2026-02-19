"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    router.push("/")
  }

  return (
    <div className="p-10 space-y-4 flex flex-col items-start">
      <h1>Login</h1>
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
      <Button onClick={handleLogin} className="bg-black text-white">
        Login
      </Button>
      <Button>
        <a href="/register">Register</a>
      </Button>
    </div>
  )
}
