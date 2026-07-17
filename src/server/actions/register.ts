"use server";

import { revalidatePath } from "next/cache";

import { serverEnv } from "@/lib/env";
import { formatEventDate, formatEventTime } from "@/lib/format";
import { supabaseAdmin } from "@/lib/supabase/server";
import {
  registrationSchema,
  type ActionResult,
  type CommunityEvent,
  type RegistrationInput,
  type RegistrationStatus,
} from "@/types";

interface RegisterData {
  status: RegistrationStatus;
  whatsappGroupUrl: string | null;
}

export async function registerForEvent(
  input: RegistrationInput,
): Promise<ActionResult<RegisterData>> {
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  }

  const { eventId, name, age, phone, email, gender, emergency_contact, blood_group, answers } =
    parsed.data;
  const db = supabaseAdmin();

  const { data: event, error: eventError } = await db
    .from("events")
    .select("*")
    .eq("id", eventId)
    .maybeSingle<CommunityEvent>();

  if (eventError || !event) {
    return { ok: false, message: "This event could not be found. Please refresh and try again." };
  }
  if (event.status !== "upcoming" || !event.registration_open) {
    return { ok: false, message: "Registrations for this event are closed." };
  }

  // Required custom questions must be answered
  for (const q of event.questions) {
    if (q.required && !answers[q.id]?.trim()) {
      return {
        ok: false,
        message: "Please answer all required questions.",
        fieldErrors: { [`answers.${q.id}`]: "This question is required" },
      };
    }
  }

  // Capacity → confirmed or waitlist
  let status: RegistrationStatus = "confirmed";
  if (event.capacity !== null) {
    const { count } = await db
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("status", "confirmed");
    if ((count ?? 0) >= event.capacity) status = "waitlist";
  }

  const { error: insertError } = await db.from("registrations").insert({
    event_id: eventId,
    name,
    age,
    phone,
    email,
    gender,
    emergency_contact,
    blood_group,
    answers,
    status,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return { ok: false, message: "This phone number is already registered for this event." };
    }
    console.error("Registration insert failed:", insertError.message);
    return { ok: false, message: "Something went wrong saving your registration. Please try again." };
  }

  // Push to Google Sheets — best-effort; the database is the source of truth.
  await pushToSheet({
    event: event.title,
    date: new Date().toISOString(),
    name,
    age,
    phone,
    email: email ?? "",
    gender: gender ?? "",
    emergency_contact: emergency_contact ?? "",
    blood_group: blood_group ?? "",
    status,
    answers: event.questions
      .map((q) => `${q.label}: ${answers[q.id] ?? "-"}`)
      .join(" | "),
  });

  // WhatsApp confirmation — best-effort, skipped unless the Cloud API is configured.
  if (status === "confirmed") {
    await sendWhatsAppConfirmation({
      phone,
      name,
      eventTitle: event.title,
      eventWhen: `${formatEventDate(event.event_date)}, ${formatEventTime(event.event_date)}`,
    });
  }

  revalidatePath(`/events/${event.slug}`);
  revalidatePath("/events");

  return {
    ok: true,
    message:
      status === "confirmed"
        ? "You're in! See you at the session."
        : "The session is full — you've been added to the waitlist and we'll message you if a spot opens.",
    data: { status, whatsappGroupUrl: event.whatsapp_group_url },
  };
}

async function sendWhatsAppConfirmation(input: {
  phone: string;
  name: string;
  eventTitle: string;
  eventWhen: string;
}): Promise<void> {
  try {
    const { WHATSAPP_CLOUD_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_TEMPLATE_NAME } =
      serverEnv();
    if (!WHATSAPP_CLOUD_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) return;

    // Normalise to international digits; bare 10-digit numbers assume India.
    let digits = input.phone.replace(/\D/g, "");
    if (digits.length === 10) digits = `91${digits}`;

    const res = await fetch(
      `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_CLOUD_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: digits,
          type: "template",
          template: {
            name: WHATSAPP_TEMPLATE_NAME ?? "registration_confirmed",
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: input.name },
                  { type: "text", text: input.eventTitle },
                  { type: "text", text: input.eventWhen },
                ],
              },
            ],
          },
        }),
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) {
      console.error("WhatsApp confirmation failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("WhatsApp confirmation error:", err);
  }
}

async function pushToSheet(row: Record<string, string | number>): Promise<void> {
  try {
    const { SHEETS_WEBHOOK_URL } = serverEnv();
    if (!SHEETS_WEBHOOK_URL) return;
    const res = await fetch(SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("Sheets webhook returned", res.status);
  } catch (err) {
    console.error("Sheets webhook failed:", err);
  }
}
