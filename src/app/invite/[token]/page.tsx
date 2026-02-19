import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"

interface InvitePageProps {
  params: {
    token: string
  }
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/invite/${token}`)
  }

  // Find invitation
  const { data: invite } = await supabase
    .from("sofre_invitations")
    .select("*")
    .eq("token", token)
    .single()

  if (!invite) {
    return <div>Invalid invitation</div>
  }

  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return <div>Invitation expired</div>
  }

  // Add user to sofre_members
  await supabase.from("sofre_members").insert({
    sofre_id: invite.sofre_id,
    user_id: user.id,
    is_hidden: false,
  })

  // Increment usage
  await supabase
    .from("sofre_invitations")
    .update({ used_count: invite.used_count + 1 })
    .eq("id", invite.id)

  redirect(`/sofre/${invite.sofre_id}`)
}
