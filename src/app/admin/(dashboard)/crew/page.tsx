import { CrewManager } from "@/components/admin/crew-manager";
import { supabaseServer } from "@/lib/supabase/server";
import type { CrewMember } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminCrewPage() {
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from("crew_members")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <h1 className="font-display text-4xl font-bold uppercase tracking-wide">Crew</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        The faces on the public crew page.
      </p>
      <div className="mt-6">
        <CrewManager crew={(data as CrewMember[]) ?? []} />
      </div>
    </div>
  );
}
