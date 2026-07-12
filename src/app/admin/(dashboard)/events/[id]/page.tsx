import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { DeleteEventButton } from "@/components/admin/delete-event-button";
import { EventForm } from "@/components/admin/event-form";
import { PhotoManager } from "@/components/admin/photo-manager";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabaseServer } from "@/lib/supabase/server";
import type { CommunityEvent, EventPhoto } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await supabaseServer();

  const [{ data: event }, { data: photos }, { count: regCount }] = await Promise.all([
    supabase.from("events").select("*").eq("id", id).maybeSingle(),
    supabase.from("event_photos").select("*").eq("event_id", id).order("sort_order"),
    supabase
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .eq("event_id", id),
  ]);

  if (!event) notFound();
  const typedEvent = event as CommunityEvent;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-wide">
            Edit event
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {regCount ?? 0} registration{(regCount ?? 0) === 1 ? "" : "s"} ·{" "}
            <Link
              href={`/admin/registrations?event=${typedEvent.id}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              view list
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/events/${typedEvent.slug}`} target="_blank">
              View live
              <ExternalLink className="size-4" aria-hidden />
            </Link>
          </Button>
          <DeleteEventButton eventId={typedEvent.id} eventTitle={typedEvent.title} />
        </div>
      </div>

      <div className="mt-8">
        <EventForm event={typedEvent} />
      </div>

      <Separator className="my-10" />

      <PhotoManager eventId={typedEvent.id} photos={(photos as EventPhoto[]) ?? []} />
    </div>
  );
}
