import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { InviteSection } from "@/components/ui/sofre/invite-component"
import { createInvite } from "./actions"


interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
}


export default async function SofrePage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params
  const sofreId = id


  const supabase = await createClient()

  // Check user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }


  // Get sofre
  const { data: sofre } = await supabase
    .from("sofre")
    .select("*")
    .eq("id", sofreId)
    .single()

  if (!sofre) {
    return <div>Sofre not found</div>
  }

  // Check if user can see the sofre
  const { data: membership } = await supabase
    .from("sofre_members")
    .select("*")
    .eq("sofre_id", sofreId)
    .eq("user_id", user.id)
    .single()

  const isOwner = sofre.owner_id === user.id

  if (!membership && !isOwner) {
    return <div>You are not a member of this sofre.</div>
  }

  // Get gifts
  const { data: gifts } = await supabase
    .from("gifts")
    .select("*")
    .eq("sofre_id", sofreId)

  // Get members of sofre
  const { data: memberRows, error: memberError } = await supabase
    .from("sofre_members")
    .select("user_id")
    .eq("sofre_id", sofreId);

  if (memberError) {
    console.error("Error fetching members:", memberError);
  }

  if (!memberRows || memberRows.length === 0) {
    console.log("No members found for this sofre.");
  }

  const userIds = memberRows?.map(row => row.user_id) || [];

  let membersProfiles: UserProfile[] = [];
  if (userIds.length > 0) {
    const { data: profiles, error: profileError } = await supabase
      .from("users_profile")
      .select("id, firstname, lastname, username")
      .in("id", userIds); // fetch only these users

    if (profileError) {
      console.error("Error fetching profiles:", profileError);
    } else {
      membersProfiles = profiles;
    }
  }

  // Get invites
  const { data: invite } = await supabase
    .from("sofre_invitations")
    .select("*")
    .eq("sofre_id", sofreId)
    .maybeSingle()


  // Get Owner
  const { data: owner } = await supabase
    .from("users_profile")
    .select("*")
    .eq("id", sofre.owner_id)
    .maybeSingle()


  return (
    <div className="p-10 space-y-8">

      {/* SOFRE INFO */}
      <div>
        <h1 className="text-2xl font-bold">Sofre: {sofre.title}</h1>
        <p>{sofre.description}</p>
      </div>
      {/* OWNER */}
      <div>
        <h1 className="text-2xl font-bold">Owner: {owner?.firstname} {owner?.lastname}</h1>
      </div>

      {/* OWNER ACTIONS */}
      {isOwner && (
        <InviteSection
          sofreId={sofreId}
          initialToken={invite?.token}
          createInviteAction={createInvite.bind(null, sofreId)}
        />
      )}

      {/* MEMBERS */}
      <div>
        <h2 className="text-xl font-semibold">Members</h2>
        <ul>
          {membersProfiles.map(member => (
            <li key={member.id}>
              {member.firstname} {member.lastname} ({member.username})
            </li>
          ))}
        </ul>
      </div>

      {/* GIFTS */}
      <div>
        <h2 className="text-xl font-semibold">Gifts</h2>
        <pre>{JSON.stringify(gifts, null, 2)}</pre>
      </div>

    </div>
  )
}
