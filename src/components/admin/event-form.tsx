"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GripVertical, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { supabaseBrowser } from "@/lib/supabase/client";
import {
  SPORT_LABELS,
  type CommunityEvent,
  type EventQuestion,
  type EventStatus,
  type Sport,
} from "@/types";

interface EventFormProps {
  event?: CommunityEvent;
}

interface Draft {
  title: string;
  slug: string;
  sport: Sport;
  description: string;
  rules: string;
  venue: string;
  venue_map_url: string;
  event_date: string; // datetime-local value
  capacity: string;
  price: string;
  whatsapp_group_url: string;
  drive_link: string;
  status: EventStatus;
  registration_open: boolean;
  poster_url: string | null;
  questions: EventQuestion[];
}

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const isEdit = Boolean(event);

  const [draft, setDraft] = useState<Draft>({
    title: event?.title ?? "",
    slug: event?.slug ?? "",
    sport: event?.sport ?? "running",
    description: event?.description ?? "",
    rules: event?.rules ?? "",
    venue: event?.venue ?? "",
    venue_map_url: event?.venue_map_url ?? "",
    event_date: event ? toLocalInput(event.event_date) : "",
    capacity: event?.capacity?.toString() ?? "",
    price: event?.price?.toString() ?? "",
    whatsapp_group_url: event?.whatsapp_group_url ?? "",
    drive_link: event?.drive_link ?? "",
    status: event?.status ?? "upcoming",
    registration_open: event?.registration_open ?? true,
    poster_url: event?.poster_url ?? null,
    questions: event?.questions ?? [
      {
        id: "q_why",
        label: "Why do you want to join RevLine?",
        type: "textarea",
        required: true,
      },
    ],
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function updateQuestion(index: number, patch: Partial<EventQuestion>) {
    setDraft((d) => ({
      ...d,
      questions: d.questions.map((q, i) => (i === index ? { ...q, ...patch } : q)),
    }));
  }

  function addQuestion() {
    setDraft((d) => ({
      ...d,
      questions: [
        ...d.questions,
        {
          id: `q_${Date.now().toString(36)}`,
          label: "",
          type: "text",
          required: false,
        },
      ],
    }));
  }

  function removeQuestion(index: number) {
    setDraft((d) => ({ ...d, questions: d.questions.filter((_, i) => i !== index) }));
  }

  async function uploadPoster(file: File) {
    setUploading(true);
    try {
      const supabase = supabaseBrowser();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `posters/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      set("poster_url", data.publicUrl);
      toast.success("Poster uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!draft.title.trim() || !draft.venue.trim() || !draft.event_date) {
      toast.error("Title, venue and date are required.");
      return;
    }
    const badQuestion = draft.questions.find(
      (q) => !q.label.trim() || (q.type === "select" && !(q.options ?? []).length),
    );
    if (badQuestion) {
      toast.error("Every question needs a label (and options, for dropdowns).");
      return;
    }

    setSaving(true);
    const payload = {
      title: draft.title.trim(),
      slug: draft.slug.trim() || slugify(draft.title),
      sport: draft.sport,
      description: draft.description.trim(),
      rules: draft.rules.trim() || null,
      venue: draft.venue.trim(),
      venue_map_url: draft.venue_map_url.trim() || null,
      event_date: new Date(draft.event_date).toISOString(),
      capacity: draft.capacity ? Number(draft.capacity) : null,
      price: draft.price ? Number(draft.price) : null,
      whatsapp_group_url: draft.whatsapp_group_url.trim() || null,
      drive_link: draft.drive_link.trim() || null,
      status: draft.status,
      registration_open: draft.registration_open,
      poster_url: draft.poster_url,
      questions: draft.questions,
    };

    const supabase = supabaseBrowser();
    const { error } = isEdit
      ? await supabase.from("events").update(payload).eq("id", event!.id)
      : await supabase.from("events").insert(payload);

    setSaving(false);

    if (error) {
      toast.error(
        error.code === "23505"
          ? "That slug is already used by another event — change the slug."
          : error.message,
      );
      return;
    }

    toast.success(isEdit ? "Event updated" : "Event created");
    router.push("/admin/events");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <fieldset disabled={saving} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="ev-title">Title *</Label>
            <Input
              id="ev-title"
              value={draft.title}
              onChange={(e) => {
                set("title", e.target.value);
                if (!isEdit) set("slug", slugify(e.target.value));
              }}
              placeholder="Sunday Turf Football"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ev-slug">URL slug</Label>
            <Input
              id="ev-slug"
              value={draft.slug}
              onChange={(e) => set("slug", slugify(e.target.value))}
              placeholder="sunday-turf-football"
            />
            <p className="text-xs text-muted-foreground">revline.club/events/{draft.slug || "…"}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ev-sport">Sport</Label>
            <Select value={draft.sport} onValueChange={(v) => set("sport", v as Sport)}>
              <SelectTrigger id="ev-sport" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(SPORT_LABELS) as Sport[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {SPORT_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ev-date">Date &amp; time *</Label>
            <Input
              id="ev-date"
              type="datetime-local"
              value={draft.event_date}
              onChange={(e) => set("event_date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ev-venue">Venue *</Label>
            <Input
              id="ev-venue"
              value={draft.venue}
              onChange={(e) => set("venue", e.target.value)}
              placeholder="Turf Arena, MG Road"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ev-map">Google Maps link</Label>
            <Input
              id="ev-map"
              type="url"
              value={draft.venue_map_url}
              onChange={(e) => set("venue_map_url", e.target.value)}
              placeholder="https://maps.app.goo.gl/…"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ev-capacity">Capacity (blank = unlimited)</Label>
            <Input
              id="ev-capacity"
              type="number"
              min={1}
              value={draft.capacity}
              onChange={(e) => set("capacity", e.target.value)}
              placeholder="24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ev-price">Price in ₹ (blank = free)</Label>
            <Input
              id="ev-price"
              type="number"
              min={0}
              step="0.01"
              value={draft.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="199"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ev-wa">Event WhatsApp group link</Label>
            <Input
              id="ev-wa"
              type="url"
              value={draft.whatsapp_group_url}
              onChange={(e) => set("whatsapp_group_url", e.target.value)}
              placeholder="https://chat.whatsapp.com/…"
            />
            <p className="text-xs text-muted-foreground">
              Shown to members right after they register.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ev-status">Status</Label>
            <Select value={draft.status} onValueChange={(v) => set("status", v as EventStatus)}>
              <SelectTrigger id="ev-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {draft.status === "completed" && (
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="ev-drive">Google Drive album link (optional)</Label>
              <Input
                id="ev-drive"
                type="url"
                value={draft.drive_link}
                onChange={(e) => set("drive_link", e.target.value)}
                placeholder="https://drive.google.com/…"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ev-desc">Description</Label>
          <Textarea
            id="ev-desc"
            rows={4}
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="What is this session, who is it for, what should people expect?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ev-rules">Rules (one per line)</Label>
          <Textarea
            id="ev-rules"
            rows={4}
            value={draft.rules}
            onChange={(e) => set("rules", e.target.value)}
            placeholder={"Wear turf shoes\nArrive 15 minutes early\nCarry water"}
          />
        </div>

        {/* Poster */}
        <div className="space-y-2">
          <Label htmlFor="ev-poster">Poster image</Label>
          {draft.poster_url && (
            <div className="relative aspect-[16/9] w-full max-w-md overflow-hidden rounded-lg border border-border">
              <Image
                src={draft.poster_url}
                alt="Event poster preview"
                fill
                sizes="448px"
                className="object-cover"
              />
            </div>
          )}
          <div className="flex items-center gap-3">
            <Button asChild type="button" variant="outline" disabled={uploading}>
              <label htmlFor="ev-poster" className="cursor-pointer">
                {uploading ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Upload className="size-4" aria-hidden />
                )}
                {draft.poster_url ? "Replace poster" : "Upload poster"}
              </label>
            </Button>
            <input
              id="ev-poster"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadPoster(file);
                e.target.value = "";
              }}
            />
            {draft.poster_url && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => set("poster_url", null)}
              >
                Remove
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <input
            id="ev-open"
            type="checkbox"
            className="size-4 accent-[var(--primary)]"
            checked={draft.registration_open}
            onChange={(e) => set("registration_open", e.target.checked)}
          />
          <Label htmlFor="ev-open" className="cursor-pointer">
            Registrations open
          </Label>
        </div>

        <Separator />

        {/* Questions builder */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide">
                Registration questions
              </h2>
              <p className="text-sm text-muted-foreground">
                Name, age and phone are always collected — these are your extra questions.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
              <Plus className="size-4" aria-hidden />
              Add
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {draft.questions.map((q, i) => (
              <div key={q.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <GripVertical className="mt-2.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <div className="grid flex-1 gap-3 sm:grid-cols-[1fr_150px]">
                    <Input
                      aria-label={`Question ${i + 1} label`}
                      value={q.label}
                      onChange={(e) => updateQuestion(i, { label: e.target.value })}
                      placeholder="e.g. What's your fitness level?"
                    />
                    <Select
                      value={q.type}
                      onValueChange={(v) =>
                        updateQuestion(i, {
                          type: v as EventQuestion["type"],
                          options: v === "select" ? (q.options ?? []) : undefined,
                        })
                      }
                    >
                      <SelectTrigger aria-label={`Question ${i + 1} type`} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Short answer</SelectItem>
                        <SelectItem value="textarea">Long answer</SelectItem>
                        <SelectItem value="select">Dropdown</SelectItem>
                      </SelectContent>
                    </Select>
                    {q.type === "select" && (
                      <Input
                        className="sm:col-span-2"
                        aria-label={`Question ${i + 1} options`}
                        value={(q.options ?? []).join(", ")}
                        onChange={(e) =>
                          updateQuestion(i, {
                            options: e.target.value
                              .split(",")
                              .map((o) => o.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="Options, separated, by, commas"
                      />
                    )}
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <input
                        id={`q-req-${q.id}`}
                        type="checkbox"
                        className="size-4 accent-[var(--primary)]"
                        checked={q.required}
                        onChange={(e) => updateQuestion(i, { required: e.target.checked })}
                      />
                      <Label htmlFor={`q-req-${q.id}`} className="cursor-pointer text-sm">
                        Required
                      </Label>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove question ${i + 1}`}
                    onClick={() => removeQuestion(i)}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
              </div>
            ))}
            {draft.questions.length === 0 && (
              <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No extra questions — the form will just ask for name, age, phone and email.
              </p>
            )}
          </div>
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" className="font-semibold" disabled={saving || uploading}>
          {saving && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {isEdit ? "Save changes" : "Create event"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/events")}
          disabled={saving}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
