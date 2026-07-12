import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  Clock,
  ExternalLink,
  ImageIcon,
  IndianRupee,
  ListChecks,
  MapPin,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatEventDate, formatEventTime, formatPrice } from "@/lib/format";
import {
  getConfirmedCount,
  getEventBySlug,
  getEventPhotos,
} from "@/server/queries";
import { SPORT_LABELS } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event not found" };
  return {
    title: event.title,
    description: event.description.slice(0, 160),
    openGraph: {
      title: `${event.title} · RevLine`,
      description: event.description.slice(0, 160),
      images: event.poster_url ? [event.poster_url] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const [confirmedCount, photos] = await Promise.all([
    getConfirmedCount(event.id),
    event.status === "completed" ? getEventPhotos(event.id) : Promise.resolve([]),
  ]);

  const isUpcoming = event.status === "upcoming";
  const spotsLeft =
    event.capacity !== null ? Math.max(0, event.capacity - confirmedCount) : null;
  const isFull = spotsLeft === 0;
  const canRegister = isUpcoming && event.registration_open;

  const rules = (event.rules ?? "")
    .split("\n")
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-18">
      <Link
        href="/events"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← All events
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{SPORT_LABELS[event.sport]}</Badge>
        {event.status === "completed" && <Badge variant="outline">Completed</Badge>}
        {event.status === "cancelled" && <Badge variant="destructive">Cancelled</Badge>}
        {canRegister && spotsLeft !== null && (
          <Badge variant={isFull ? "destructive" : "default"}>
            {isFull ? "Session full — waitlist open" : `${spotsLeft} spots left`}
          </Badge>
        )}
      </div>

      <h1 className="mt-4 text-balance font-display text-5xl font-bold uppercase leading-[1.02] tracking-wide sm:text-6xl">
        {event.title}
      </h1>

      {event.poster_url && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border border-border">
          <Image
            src={event.poster_url}
            alt={`${event.title} poster`}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mt-8 grid gap-3 rounded-xl border border-border bg-card p-6 sm:grid-cols-2">
        <p className="flex items-center gap-3 text-sm">
          <Calendar className="size-4 text-primary" aria-hidden />
          {formatEventDate(event.event_date)}
        </p>
        <p className="flex items-center gap-3 text-sm">
          <Clock className="size-4 text-primary" aria-hidden />
          {formatEventTime(event.event_date)}
        </p>
        <p className="flex items-center gap-3 text-sm">
          <MapPin className="size-4 text-primary" aria-hidden />
          <span>
            {event.venue}
            {event.venue_map_url && (
              <>
                {" · "}
                <a
                  href={event.venue_map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                >
                  Map <ExternalLink className="size-3" aria-hidden />
                </a>
              </>
            )}
          </span>
        </p>
        <p className="flex items-center gap-3 text-sm">
          <IndianRupee className="size-4 text-primary" aria-hidden />
          {formatPrice(event.price)}
        </p>
        {event.capacity !== null && (
          <p className="flex items-center gap-3 text-sm">
            <Users className="size-4 text-primary" aria-hidden />
            {confirmedCount} joined · capacity {event.capacity}
          </p>
        )}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide">
          About this session
        </h2>
        <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
          {event.description}
        </p>
      </section>

      {rules.length > 0 && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold uppercase tracking-wide">
            <ListChecks className="size-5 text-primary" aria-hidden />
            Session rules
          </h2>
          <ul className="mt-3 space-y-2">
            {rules.map((rule) => (
              <li key={rule} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                {rule}
              </li>
            ))}
          </ul>
        </section>
      )}

      {photos.length > 0 && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold uppercase tracking-wide">
            <ImageIcon className="size-5 text-primary" aria-hidden />
            Session gallery
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square overflow-hidden rounded-lg border border-border"
              >
                <Image
                  src={photo.url}
                  alt={photo.caption ?? `${event.title} session photo`}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 hover:scale-105 motion-reduce:transition-none"
                />
              </div>
            ))}
          </div>
          {event.drive_link && (
            <Button asChild variant="outline" className="mt-5">
              <a href={event.drive_link} target="_blank" rel="noopener noreferrer">
                Full album on Drive
                <ExternalLink className="size-4" aria-hidden />
              </a>
            </Button>
          )}
        </section>
      )}

      {canRegister && (
        <>
          <Separator className="my-10" />
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-8 text-center">
            <h2 className="font-display text-3xl font-bold uppercase italic tracking-wide">
              {isFull ? "Join the waitlist" : "Lock in your spot"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {isFull
                ? "The session is at capacity, but drop-outs happen — waitlisted members get spots in order."
                : "Takes under a minute. You'll get the WhatsApp group link right after."}
            </p>
            <Button asChild size="lg" className="mt-6 h-12 px-10 text-base font-semibold">
              <Link href={`/register/${event.slug}`}>
                Register now
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
