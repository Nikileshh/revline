import "server-only";

import { supabaseAdmin, supabaseAnon } from "@/lib/supabase/server";
import type {
  CommunityEvent,
  CrewMember,
  EventPhoto,
  SiteSettings,
  Testimonial,
} from "@/types";

const DEFAULT_SETTINGS: SiteSettings = {
  instagram_url: "https://www.instagram.com/revline.club",
  whatsapp_community_url: "",
  terms_md: "",
  contact_email: "",
};

/**
 * Public read helpers. Every function degrades to an empty result if the
 * database is unreachable so the site renders instead of crashing.
 */

export async function getUpcomingEvents(): Promise<CommunityEvent[]> {
  try {
    const { data } = await supabaseAnon()
      .from("events")
      .select("*")
      .eq("status", "upcoming")
      .order("event_date", { ascending: true });
    return (data as CommunityEvent[]) ?? [];
  } catch {
    return [];
  }
}

export async function getCompletedEvents(): Promise<CommunityEvent[]> {
  try {
    const { data } = await supabaseAnon()
      .from("events")
      .select("*")
      .eq("status", "completed")
      .order("event_date", { ascending: false });
    return (data as CommunityEvent[]) ?? [];
  } catch {
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<CommunityEvent | null> {
  try {
    const { data } = await supabaseAnon()
      .from("events")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    return (data as CommunityEvent) ?? null;
  } catch {
    return null;
  }
}

export async function getEventPhotos(eventId: string): Promise<EventPhoto[]> {
  try {
    const { data } = await supabaseAnon()
      .from("event_photos")
      .select("*")
      .eq("event_id", eventId)
      .order("sort_order", { ascending: true });
    return (data as EventPhoto[]) ?? [];
  } catch {
    return [];
  }
}

export async function getConfirmedCount(eventId: string): Promise<number> {
  try {
    // Registrations hold personal data, so RLS blocks anonymous reads —
    // count through the service role instead.
    const { count } = await supabaseAdmin()
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("status", "confirmed");
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getCrew(): Promise<CrewMember[]> {
  try {
    const { data } = await supabaseAnon()
      .from("crew_members")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data as CrewMember[]) ?? [];
  } catch {
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data } = await supabaseAnon()
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    return (data as Testimonial[]) ?? [];
  } catch {
    return [];
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data } = await supabaseAnon()
      .from("site_settings")
      .select("*")
      .maybeSingle();
    return (data as SiteSettings) ?? DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
