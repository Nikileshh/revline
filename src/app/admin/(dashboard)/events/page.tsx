import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatEventDate } from "@/lib/format";
import { supabaseServer } from "@/lib/supabase/server";
import { SPORT_LABELS, type CommunityEvent } from "@/types";

export const dynamic = "force-dynamic";

const statusVariant = {
  upcoming: "default",
  completed: "secondary",
  cancelled: "destructive",
} as const;

export default async function AdminEventsPage() {
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });
  const events = (data as CommunityEvent[]) ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-wide">Events</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create sessions, open registrations, and archive completed ones.
          </p>
        </div>
        <Button asChild className="font-semibold">
          <Link href="/admin/events/new">
            <Plus className="size-4" aria-hidden />
            New event
          </Link>
        </Button>
      </div>

      {events.length > 0 ? (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registrations</TableHead>
                <TableHead className="w-12"><span className="sr-only">Edit</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatEventDate(event.event_date)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {SPORT_LABELS[event.sport]}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[event.status]}>{event.status}</Badge>
                    {event.status === "upcoming" && !event.registration_open && (
                      <Badge variant="outline" className="ml-2">reg closed</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {event.capacity ? `cap ${event.capacity}` : "unlimited"}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="icon" aria-label={`Edit ${event.title}`}>
                      <Link href={`/admin/events/${event.id}`}>
                        <Pencil className="size-4" aria-hidden />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="mt-8 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No events yet — create your first session.
        </p>
      )}
    </div>
  );
}
