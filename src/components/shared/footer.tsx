import Link from "next/link";
import { Mail, MessageCircle, Zap } from "lucide-react";

import { InstagramIcon } from "@/components/shared/instagram-icon";

import { getSiteSettings } from "@/server/queries";

export async function Footer() {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary">
                <Zap className="size-4 text-primary-foreground" aria-hidden />
              </span>
              <span className="font-display text-xl font-bold uppercase italic tracking-wide">
                RevLine
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A hybrid training club. Consistency builds power, community builds purpose.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
            <Link href="/events" className="py-1 text-muted-foreground transition-colors hover:text-foreground">
              Upcoming Events
            </Link>
            <Link href="/crew" className="py-1 text-muted-foreground transition-colors hover:text-foreground">
              The Crew
            </Link>
            <Link href="/terms" className="py-1 text-muted-foreground transition-colors hover:text-foreground">
              Terms &amp; Conditions
            </Link>
            <Link href="/admin" className="py-1 text-muted-foreground transition-colors hover:text-foreground">
              Admin
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="RevLine on Instagram"
                className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <InstagramIcon className="size-4" />
              </a>
            )}
            {settings.whatsapp_community_url && (
              <a
                href={settings.whatsapp_community_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join the RevLine WhatsApp community"
                className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <MessageCircle className="size-4" aria-hidden />
              </a>
            )}
            {settings.contact_email && (
              <a
                href={`mailto:${settings.contact_email}`}
                aria-label="Email RevLine"
                className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <Mail className="size-4" aria-hidden />
              </a>
            )}
          </div>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          © {year} RevLine. Move better. Live stronger. Stay consistent.
        </p>
      </div>
    </footer>
  );
}
