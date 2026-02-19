"use server"

import { createClient } from "@/lib/supabase-server"
import { randomUUID } from "crypto"

export async function createInvite(sofreId: string): Promise<string> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const token = randomUUID()

  const { error } = await supabase
    .from("sofre_invitations")
    .upsert(
      {
        sofre_id: sofreId,
        created_by: user.id,
        token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        onConflict: "sofre_id",
      }
    )

  if (error) {
    console.error(error)
    throw new Error("Failed to create invite")
  }

  return token
}
