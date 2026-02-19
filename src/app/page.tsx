import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"



export default async function HomePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // users sofres
  const { data: sofres } = await supabase
    .from("sofre")
    .select("*")
    .eq("owner_id", user.id)

  // users membered sofres (where current user is a member)
  const { data: memberRows, error: memberError } = await supabase
    .from("sofre_members")
    .select("sofre_id")
    .eq("user_id", user.id);

  if (memberError) {
    console.error("Error fetching membered sofres:", memberError);
  }

  const sofreIds = memberRows?.map(row => row.sofre_id) || [];

  let memberedSofres = [];

  if (sofreIds.length > 0) {
    const { data, error } = await supabase
      .from("sofre")
      .select("*")
      .in("id", sofreIds);

    if (error) {
      console.error("Error fetching sofres:", error);
    } else {
      memberedSofres = data;
    }
  }

  return (
    <div className="p-10 inline-flex flex-col gap-5">
      <h1>Welcome {user.email}</h1>
      <form className="flex gap-2 w-[500]"
        action={async (formData) => {
          "use server"

          const supabase = await createClient()
          const { data: { user } } = await supabase.auth.getUser()

          await supabase.from("sofre").insert({
            title: formData.get("title"),
            owner_id: user?.id,
          })

          redirect("/home")
        }}
      >
        <Input name="title" placeholder="Sofre title" className="border p-2" />
        <Button type="submit">
          Create Sofre
        </Button>
      </form>
      <h2>Your Sofres:</h2>
      <a href={sofres?.[0]?.id ? `/sofre/${sofres[0].id}` : "#"} className="hover:opacity-90 bg-foreground p-2 rounded-xl text-white">
        <pre>{JSON.stringify(sofres, null, 2)}</pre>
      </a>
      <div>
        <h2 className="text-xl font-semibold">Your Membered Sofres</h2>
        <pre>{JSON.stringify(memberedSofres, null, 2)}</pre>
      </div>

    </div>
  )
}
