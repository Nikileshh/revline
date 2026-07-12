import Link from "next/link";
import { ArrowRight, CalendarDays, ClipboardList, Hourglass, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabaseServer } from "@/lib/supabase/server";
import { formatEventDate } from "@/lib/format";
import type { CommunityEvent } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const supabase = await supabaseServer();

  const [upcomingRes, regRes, waitlistRes, crewRes] = await Promise.all([
    supabase.from("events").select("*", { count: "exact" }).eq("status", "upcoming").order("event_date"),
    supabase.from("registrations").select("id", { count: "exact", head: true }),
    supabase.from("registrations").select("id", { count: "exact", head: true }).eq("status", "waitlist"),
    supabase.from("crew_members").select("id", { count: "exact", head: true }),
  ]);

  const upcoming = (upcomingRes.data as CommunityEvent[]) ?? [];

  const stats = [
    { label: "Upcoming events", value: upcomingRes.count ?? 0, icon: CalendarDays },
    { label: "Total registrations", value: regRes.count ?? 0, icon: ClipboardList },
    { label: "On waitlists", value: waitlistRes.count ?? 0, icon: Hourglass },
    { label: "Crew members", value: crewRes.count ?? 0, icon: Users },
  ] as const;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-wide">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            What&apos;s happening across RevLine right now.
          </p>
        </div>
        <Button asChild className="font-semibold">
          <Link href="/admin/events/new">
            New event
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
            <stat.icon className="size-5 text-primary" aria-hidden />
            <p className="mt-3 text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-display text-2xl font-bold uppercase tracking-wide">
        Next sessions
      </h2>
      {upcoming.length > 0 ? (
        <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
          {upcoming.slice(0, 5).map((event) => (
            <li key={event.id}>
              <Link
                href={`/admin/events/${event.id}`}
                className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-accent"
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatEventDate(event.event_date)} · {event.venue}
                  </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No upcoming events. Create one to open registrations.
        </p>
      )}
    </div>
  );
}
