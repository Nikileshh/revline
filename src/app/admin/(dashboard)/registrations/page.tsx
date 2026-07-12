import Link from "next/link";

import { RegistrationsTable } from "@/components/admin/registrations-table";
import { supabaseServer } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import type { CommunityEvent, Registration } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ event?: string }>;
}

export default async function AdminRegistrationsPage({ searchParams }: PageProps) {
  const { event: eventParam } = await searchParams;
  const supabase = await supabaseServer();

  const { data: eventsData } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });
  const events = (eventsData as CommunityEvent[]) ?? [];

  const selected = events.find((e) => e.id === eventParam) ?? events[0] ?? null;

  let registrations: Registration[] = [];
  if (selected) {
    const { data } = await supabase
      .from("registrations")
      .select("*")
      .eq("event_id", selected.id)
      .order("created_at", { ascending: true });
    registrations = (data as Registration[]) ?? [];
  }

  const confirmed = registrations.filter((r) => r.status === "confirmed").length;
  const waitlisted = registrations.length - confirmed;

  return (
    <div>
      <h1 className="font-display text-4xl font-bold uppercase tracking-wide">
        Registrations
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Everyone who hit Register Now — also mirrored to your Google Sheet.
      </p>

      {events.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Create an event first — registrations will show up here.
        </p>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Events">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/admin/registrations?event=${event.id}`}
                role="tab"
                aria-selected={selected?.id === event.id}
                className={cn(
                  "rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  selected?.id === event.id &&
                    "border-primary bg-primary/15 text-foreground",
                )}
              >
                {event.title}
              </Link>
            ))}
          </div>

          {selected && (
            <>
              <p className="mt-5 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{confirmed}</span> confirmed
                {selected.capacity ? ` of ${selected.capacity}` : ""} ·{" "}
                <span className="font-semibold text-foreground">{waitlisted}</span> waitlisted
              </p>
              <RegistrationsTable
                registrations={registrations}
                questions={selected.questions}
                eventTitle={selected.title}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
