import { Zap } from "lucide-react";

import {
  StaggeredMenu,
  type StaggeredMenuItem,
  type StaggeredMenuSocialItem,
} from "@/components/shared/staggered-menu";

const items: StaggeredMenuItem[] = [
  { label: "Home", link: "/", ariaLabel: "Go to home page" },
  { label: "Events", link: "/events", ariaLabel: "Browse upcoming events" },
  { label: "Crew", link: "/crew", ariaLabel: "Meet the crew" },
  { label: "Terms", link: "/terms", ariaLabel: "Read the terms" },
];

interface NavbarProps {
  instagramUrl?: string | null;
  whatsappUrl?: string | null;
}

export function Navbar({ instagramUrl, whatsappUrl }: NavbarProps = {}) {
  const socialItems: StaggeredMenuSocialItem[] = [];
  if (instagramUrl) socialItems.push({ label: "Instagram", link: instagramUrl });
  if (whatsappUrl) socialItems.push({ label: "WhatsApp", link: whatsappUrl });

  return (
    <StaggeredMenu
      isFixed
      position="right"
      items={items}
      socialItems={socialItems}
      displaySocials={socialItems.length > 0}
      displayItemNumbering
      accentColor="var(--primary)"
      menuButtonColor="var(--foreground)"
      openMenuButtonColor="var(--foreground)"
      changeMenuColorOnOpen={false}
      colors={[
        "color-mix(in oklab, var(--primary) 30%, var(--card))",
        "color-mix(in oklab, var(--primary) 65%, var(--card))",
      ]}
      logo={
        <span className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary">
            <Zap className="size-5 text-primary-foreground" aria-hidden />
          </span>
          <span className="font-display text-2xl font-bold uppercase italic tracking-wide text-foreground">
            RevLine
          </span>
        </span>
      }
    />
  );
}
