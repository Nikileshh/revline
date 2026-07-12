"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { Testimonial } from "@/types";

interface TestimonialsManagerProps {
  testimonials: Testimonial[];
}

interface TDraft {
  name: string;
  label: string;
  quote: string;
}

const EMPTY: TDraft = { name: "", label: "", quote: "" };

export function TestimonialsManager({ testimonials }: TestimonialsManagerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [draft, setDraft] = useState<TDraft>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  function openFor(t: Testimonial | null) {
    setEditing(t);
    setDraft(t ? { name: t.name, label: t.label ?? "", quote: t.quote } : EMPTY);
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.name.trim() || !draft.quote.trim()) {
      toast.error("Name and quote are required.");
      return;
    }
    setSaving(true);
    const supabase = supabaseBrowser();
    const payload = {
      name: draft.name.trim(),
      label: draft.label.trim() || null,
      quote: draft.quote.trim(),
      sort_order: editing?.sort_order ?? testimonials.length,
    };
    const { error } = editing
      ? await supabase.from("testimonials").update(payload).eq("id", editing.id)
      : await supabase.from("testimonials").insert({ ...payload, published: true });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing ? "Updated" : "Added");
    setOpen(false);
    router.refresh();
  }

  async function togglePublished(t: Testimonial) {
    setBusyId(t.id);
    const { error } = await supabaseBrowser()
      .from("testimonials")
      .update({ published: !t.published })
      .eq("id", t.id);
    setBusyId(null);
    if (error) toast.error(error.message);
    else router.refresh();
  }

  async function remove(t: Testimonial) {
    setBusyId(t.id);
    const { error } = await supabaseBrowser().from("testimonials").delete().eq("id", t.id);
    setBusyId(null);
    if (error) toast.error(error.message);
    else {
      toast.success("Removed");
      router.refresh();
    }
  }

  return (
    <div>
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={<Button className="font-semibold" onClick={() => openFor(null)} />}
          >
            <Plus className="size-4" aria-hidden />
            Add testimonial
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit testimonial" : "Add testimonial"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <fieldset disabled={saving} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="t-name">Member name *</Label>
                  <Input
                    id="t-name"
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t-label">Label</Label>
                  <Input
                    id="t-label"
                    value={draft.label}
                    onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
                    placeholder="Member since 2025"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t-quote">Quote *</Label>
                  <Textarea
                    id="t-quote"
                    rows={4}
                    value={draft.quote}
                    onChange={(e) => setDraft((d) => ({ ...d, quote: e.target.value }))}
                  />
                </div>
              </fieldset>
              <Button type="submit" className="w-full font-semibold" disabled={saving}>
                {saving && <Loader2 className="size-4 animate-spin" aria-hidden />}
                {editing ? "Save changes" : "Add testimonial"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {testimonials.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {testimonials.map((t) => (
            <li key={t.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm leading-relaxed text-foreground/90">“{t.quote}”</p>
                  <p className="mt-2 text-sm font-medium">
                    {t.name}
                    {t.label && (
                      <span className="font-normal text-muted-foreground"> · {t.label}</span>
                    )}
                    {!t.published && (
                      <Badge variant="outline" className="ml-2">hidden</Badge>
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t.published ? "Hide from site" : "Show on site"}
                    disabled={busyId === t.id}
                    onClick={() => void togglePublished(t)}
                  >
                    {t.published ? (
                      <Eye className="size-4" aria-hidden />
                    ) : (
                      <EyeOff className="size-4" aria-hidden />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Edit testimonial"
                    onClick={() => openFor(t)}
                  >
                    <Pencil className="size-4" aria-hidden />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete testimonial"
                    disabled={busyId === t.id}
                    onClick={() => void remove(t)}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No testimonials yet — ask your regulars for a line or two!
        </p>
      )}
    </div>
  );
}
