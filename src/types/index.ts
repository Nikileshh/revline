import { z } from "zod";

export type EventStatus = "upcoming" | "completed" | "cancelled";

export type Sport =
  | "running"
  | "football"
  | "trekking"
  | "swimming"
  | "turf"
  | "cycling"
  | "workout"
  | "other";

export const SPORT_LABELS: Record<Sport, string> = {
  running: "Running",
  football: "Football",
  trekking: "Trekking",
  swimming: "Swimming",
  turf: "Turf Session",
  cycling: "Cycling",
  workout: "Workout",
  other: "Session",
};

export type Intensity = "easy" | "moderate" | "intense";

export const INTENSITY_LABELS: Record<Intensity, string> = {
  easy: "Easy",
  moderate: "Moderate",
  intense: "Intense",
};

export const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"] as const;

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
  "Not sure",
] as const;

export interface EventQuestion {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  required: boolean;
  options?: string[];
}

export interface CommunityEvent {
  id: string;
  slug: string;
  title: string;
  sport: Sport;
  description: string;
  rules: string | null;
  venue: string;
  venue_map_url: string | null;
  event_date: string;
  capacity: number | null;
  price: number | null;
  whatsapp_group_url: string | null;
  poster_url: string | null;
  status: EventStatus;
  intensity: Intensity | null;
  distance: string | null;
  what_to_bring: string | null;
  drive_link: string | null;
  registration_open: boolean;
  questions: EventQuestion[];
  created_at: string;
}

export type RegistrationStatus = "confirmed" | "waitlist";

export interface Registration {
  id: string;
  event_id: string;
  name: string;
  age: number;
  phone: string;
  email: string | null;
  gender: string | null;
  blood_group: string | null;
  emergency_contact: string | null;
  answers: Record<string, string>;
  status: RegistrationStatus;
  created_at: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  instagram_url: string | null;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  label: string | null;
  quote: string;
  photo_url: string | null;
  sort_order: number;
  published: boolean;
}

export interface EventPhoto {
  id: string;
  event_id: string;
  url: string;
  caption: string | null;
  sort_order: number;
}

export interface SiteSettings {
  instagram_url: string;
  whatsapp_community_url: string;
  terms_md: string;
  contact_email: string;
  /** Admin overrides for the homepage stats; null = use the live count. */
  stat_athletes: number | null;
  stat_sessions: number | null;
}

export const registrationSchema = z.object({
  eventId: z.string().uuid(),
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  age: z.coerce
    .number()
    .int("Age must be a whole number")
    .min(10, "You must be at least 10 years old")
    .max(90, "Please enter a valid age"),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[0-9][0-9\s-]{8,14}$/, "Please enter a valid phone number"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  gender: z.string().trim().min(1, "Please select your gender").max(30),
  emergency_contact: z
    .string()
    .trim()
    .regex(/^[+]?[0-9][0-9\s-]{8,14}$/, "Enter a valid emergency contact number"),
  blood_group: z
    .string()
    .trim()
    .max(10)
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  answers: z.record(z.string(), z.string().trim().max(1000)),
});

export type RegistrationInput = z.input<typeof registrationSchema>;

export interface ActionResult<T = undefined> {
  ok: boolean;
  message: string;
  data?: T;
  fieldErrors?: Record<string, string>;
}
