import type { Metadata } from "next";
import Image from "next/image";
import { UserRound } from "lucide-react";

import { InstagramIcon } from "@/components/shared/instagram-icon";

import { Reveal } from "@/components/shared/reveal";
import { getCrew } from "@/server/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The Crew",
  description:
    "Meet the people who plan the routes, balance the teams, and keep every RevLine session running.",
};

export default async function CrewPage() {
  const crew = await getCrew();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          The people behind it
        </p>
        <h1 className="mt-3 font-display text-5xl font-bold uppercase tracking-wide sm:text-6xl">
          The Crew
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          The ones who plan the routes, balance the teams, carry the speaker, and make
          sure nobody gets left behind.
        </p>
      </Reveal>

      {crew.length > 0 ? (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {crew.map((member, i) => (
            <Reveal key={member.id} delay={i * 0.06}>
              <div className="group overflow-hidden rounded-xl border border-border bg-card">
                <div className="relative aspect-square bg-muted">
                  {member.photo_url ? (
                    <Image
                      src={member.photo_url}
                      alt={`Photo of ${member.name}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <UserRound className="size-16 text-muted-foreground/30" aria-hidden />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-display text-xl font-bold uppercase tracking-wide">
                        {member.name}
                      </h2>
                      <p className="text-sm font-medium text-primary">{member.role}</p>
                    </div>
                    {member.instagram_url && (
                      <a
                        href={member.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on Instagram`}
                        className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <InstagramIcon className="size-4" />
                      </a>
                    )}
                  </div>
                  {member.bio && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Crew profiles coming soon.
        </div>
      )}
    </div>
  );
}
