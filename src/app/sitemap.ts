import type { MetadataRoute } from "next";

import { getCompletedEvents, getUpcomingEvents } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [upcoming, completed] = await Promise.all([
    getUpcomingEvents(),
    getCompletedEvents(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/events`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/gallery`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/crew`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const eventPages: MetadataRoute.Sitemap = [...upcoming, ...completed].map((e) => ({
    url: `${base}/events/${e.slug}`,
    changeFrequency: "weekly",
    priority: e.status === "upcoming" ? 0.8 : 0.4,
  }));

  return [...staticPages, ...eventPages];
}
