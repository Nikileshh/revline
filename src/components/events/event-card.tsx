import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatEventDate, formatEventTime, formatPrice } from "@/lib/format";
import { SPORT_LABELS, type CommunityEvent } from "@/types";

interface EventCardProps {
  event: CommunityEvent;
  confirmedCount?: number;
}

export function EventCard({ event, confirmedCount }: EventCardProps) {
  const isUpcoming = event.status === "upcoming";
  const spotsLeft =
    event.capacity !== null && confirmedCount !== undefined
      ? Math.max(0, event.capacity - confirmedCount)
      : null;

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {event.poster_url ? (
          <Image
            src={event.poster_url}
            alt={`${event.title} poster`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-secondary to-background">
            <span className="font-display text-4xl font-bold uppercase italic tracking-wide text-muted-foreground/40">
              {SPORT_LABELS[event.sport]}
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge variant="secondary" className="backdrop-blur">
            {SPORT_LABELS[event.sport]}
          </Badge>
          {isUpcoming && spotsLeft !== null && (
            <Badge
              variant={spotsLeft === 0 ? "destructive" : "default"}
              className="backdrop-blur"
            >
              {spotsLeft === 0 ? "Waitlist open" : `${spotsLeft} spots left`}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-2xl font-bold uppercase leading-tight tracking-wide">
          {event.title}
        </h3>

        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Calendar className="size-4 shrink-0" aria-hidden />
            {formatEventDate(event.event_date)} · {formatEventTime(event.event_date)}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {event.venue}
          </span>
          {isUpcoming && event.capacity !== null && (
            <span className="flex items-center gap-2">
              <Users className="size-4 shrink-0" aria-hidden />
              {event.capacity} member cap · {formatPrice(event.price)}
            </span>
          )}
        </div>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-primary">
          {isUpcoming ? "View & register" : "See the recap"}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
