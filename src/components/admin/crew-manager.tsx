"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Trash2, Upload, UserRound } from "lucide-react";
import { toast } from "sonner";

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
import type { CrewMember } from "@/types";

interface CrewManagerProps {
  crew: CrewMember[];
}

interface CrewDraft {
  name: string;
  role: string;
  bio: string;
  instagram_url: string;
  photo_url: string | null;
}

const EMPTY: CrewDraft = { name: "", role: "", bio: "", instagram_url: "", photo_url: null };

export function CrewManager({ crew }: CrewManagerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CrewMember | null>(null);
  const [draft, setDraft] = useState<CrewDraft>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function openFor(member: CrewMember | null) {
    setEditing(member);
    setDraft(
      member
        ? {
            name: member.name,
            role: member.role,
            bio: member.bio ?? "",
            instagram_url: member.instagram_url ?? "",
            photo_url: member.photo_url,
          }
        : EMPTY,
    );
    setOpen(true);
  }

  async function uploadPhoto(file: File) {
    setUploading(true);
    try {
      const supabase = supabaseBrowser();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `crew/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setDraft((d) => ({ ...d, photo_url: data.publicUrl }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.name.trim() || !draft.role.trim()) {
      toast.error("Name and role are required.");
      return;
    }
    setSaving(true);
    const supabase = supabaseBrowser();
    const payload = {
      name: draft.name.trim(),
      role: draft.role.trim(),
      bio: draft.bio.trim() || null,
      instagram_url: draft.instagram_url.trim() || null,
      photo_url: draft.photo_url,
      sort_order: editing?.sort_order ?? crew.length,
    };
    const { error } = editing
      ? await supabase.from("crew_members").update(payload).eq("id", editing.id)
      : await supabase.from("crew_members").insert(payload);
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing ? "Crew member updated" : "Crew member added");
    setOpen(false);
    router.refresh();
  }

  async function remove(member: CrewMember) {
    setDeletingId(member.id);
    const { error } = await supabaseBrowser()
      .from("crew_members")
      .delete()
      .eq("id", member.id);
    setDeletingId(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Removed");
    router.refresh();
  }

  return (
    <div>
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={<Button className="font-semibold" onClick={() => openFor(null)} />}
          >
            <Plus className="size-4" aria-hidden />
            Add crew member
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit crew member" : "Add crew member"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <fieldset disabled={saving} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="crew-name">Name *</Label>
                  <Input
                    id="crew-name"
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crew-role">Role *</Label>
                  <Input
                    id="crew-role"
                    value={draft.role}
                    onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
                    placeholder="Run Lead"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crew-bio">Bio</Label>
                  <Textarea
                    id="crew-bio"
                    rows={3}
                    value={draft.bio}
                    onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crew-ig">Instagram URL</Label>
                  <Input
                    id="crew-ig"
                    type="url"
                    value={draft.instagram_url}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, instagram_url: e.target.value }))
                    }
                    placeholder="https://instagram.com/…"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crew-photo">Photo</Label>
                  {draft.photo_url && (
                    <div className="relative size-24 overflow-hidden rounded-lg border border-border">
                      <Image src={draft.photo_url} alt="Crew photo preview" fill sizes="96px" className="object-cover" />
                    </div>
                  )}
                  <Button asChild type="button" variant="outline" size="sm" disabled={uploading}>
                    <label htmlFor="crew-photo" className="cursor-pointer">
                      {uploading ? (
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                      ) : (
                        <Upload className="size-4" aria-hidden />
                      )}
                      {draft.photo_url ? "Replace photo" : "Upload photo"}
                    </label>
                  </Button>
                  <input
                    id="crew-photo"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadPhoto(file);
                      e.target.value = "";
                    }}
                  />
                </div>
              </fieldset>
              <Button type="submit" className="w-full font-semibold" disabled={saving || uploading}>
                {saving && <Loader2 className="size-4 animate-spin" aria-hidden />}
                {editing ? "Save changes" : "Add member"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {crew.length > 0 ? (
        <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
          {crew.map((member) => (
            <li key={member.id} className="flex items-center gap-4 p-4">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted">
                {member.photo_url ? (
                  <Image src={member.photo_url} alt="" fill sizes="48px" className="object-cover" />
                ) : (
                  <UserRound className="absolute inset-0 m-auto size-6 text-muted-foreground/50" aria-hidden />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{member.name}</p>
                <p className="truncate text-sm text-muted-foreground">{member.role}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Edit ${member.name}`}
                onClick={() => openFor(member)}
              >
                <Pencil className="size-4" aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remove ${member.name}`}
                disabled={deletingId === member.id}
                onClick={() => void remove(member)}
              >
                {deletingId === member.id ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Trash2 className="size-4" aria-hidden />
                )}
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No crew members yet.
        </p>
      )}
    </div>
  );
}
