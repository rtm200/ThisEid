"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy } from "lucide-react"

export function InviteSection({
  sofreId,
  initialToken,
  createInviteAction,
}: {
  sofreId: string
  initialToken?: string | null
  createInviteAction: (formData: FormData) => Promise<string>
}) {
  const [token, setToken] = useState(initialToken || "")
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    setLoading(true)

    const formData = new FormData()
    const newToken = await createInviteAction(formData)

    setToken(newToken)
    setLoading(false)
  }

  function handleCopy() {
    navigator.clipboard.writeText(
      `${window.location.origin}/invite/${token}`
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Members</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {token ? (
          <>
            <div className="flex gap-2">
              <Input
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/invite/${token}`}
              />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <Button onClick={handleCreate}>
              Regenerate Invite
            </Button>
          </>
        ) : (
          <Button onClick={handleCreate}>
            Create Invite Link
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
