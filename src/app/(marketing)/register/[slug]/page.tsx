import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";

import { RegistrationForm } from "@/components/events/registration-form";
import { Badge } from "@/components/ui/badge";
import { formatEventDate, formatEventTime } from "@/lib/format";
import { getConfirmedCount, getEventBySlug } from "@/server/queries";
import { SPORT_LABELS } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return { title: event ? `Register · ${event.title}` : "Register" };
}

export default async function RegisterPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event || event.status !== "upcoming" || !event.registration_open) notFound();

  const confirmedCount = await getConfirmedCount(event.id);
  const isFull = event.capacity !== null && confirmedCount >= event.capacity;

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <Link
        href={`/events/${event.slug}`}
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to event
      </Link>

      <div className="mb-8 mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{SPORT_LABELS[event.sport]}</Badge>
          {isFull && <Badge variant="destructive">Full — waitlist open</Badge>}
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-wide sm:text-5xl">
          {event.title}
        </h1>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Calendar className="size-4" aria-hidden />
            {formatEventDate(event.event_date)} · {formatEventTime(event.event_date)}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-4" aria-hidden />
            {event.venue}
          </span>
        </div>
      </div>

      <RegistrationForm event={event} isFull={isFull} />
    </div>
  );
}
