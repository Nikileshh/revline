import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";

import { formatEventDate, formatEventTime, formatPrice } from "@/lib/format";
import { SPORT_LABELS, type CommunityEvent } from "@/types";

interface EventCardLightProps {
  event: CommunityEvent;
  confirmedCount?: number;
}

/** Light-glass variant of EventCard for the landing page — same content. */
export function EventCardLight({ event, confirmedCount }: EventCardLightProps) {
  const isUpcoming = event.status === "upcoming";
  const spotsLeft =
    event.capacity !== null && confirmedCount !== undefined
      ? Math.max(0, event.capacity - confirmedCount)
      : null;

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-white/50 bg-white/60 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(30,50,90,0.5)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {event.poster_url ? (
          <Image
            src={event.poster_url}
            alt={`${event.title} poster`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-white/70 to-[#e5e9f0]">
            <span className="font-display text-4xl font-bold uppercase italic tracking-wide text-[rgba(30,50,90,0.25)]">
              {SPORT_LABELS[event.sport]}
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-white/75 px-2.5 py-0.5 text-xs font-medium text-[rgba(30,50,90,0.85)] backdrop-blur">
            {SPORT_LABELS[event.sport]}
          </span>
          {isUpcoming && spotsLeft !== null && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur ${
                spotsLeft === 0 ? "bg-[#b3404d]/90" : "bg-[rgba(30,50,90,0.85)]"
              }`}
            >
              {spotsLeft === 0 ? "Waitlist open" : `${spotsLeft} spots left`}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-xl font-normal leading-tight tracking-tight text-[rgba(30,50,90,0.95)]">
          {event.title}
        </h3>

        <div className="flex flex-col gap-1.5 text-sm text-[#5E6470]">
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

        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-[rgba(30,50,90,0.9)]">
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
