"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { registerForEvent } from "@/server/actions/register";
import type { CommunityEvent, RegistrationStatus } from "@/types";

interface RegistrationFormProps {
  event: CommunityEvent;
  isFull: boolean;
}

interface FormState {
  name: string;
  age: string;
  phone: string;
  email: string;
  answers: Record<string, string>;
}

type Step = "details" | "questions" | "done";

export function RegistrationForm({ event, isFull }: RegistrationFormProps) {
  const reduce = useReducedMotion();
  const hasQuestions = event.questions.length > 0;

  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState<FormState>({
    name: "",
    age: "",
    phone: "",
    email: "",
    answers: {},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    status: RegistrationStatus;
    whatsappGroupUrl: string | null;
  } | null>(null);

  const steps: Step[] = useMemo(
    () => (hasQuestions ? ["details", "questions", "done"] : ["details", "done"]),
    [hasQuestions],
  );
  const stepIndex = steps.indexOf(step);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key as string];
      return next;
    });
  }

  function setAnswer(id: string, value: string) {
    setForm((f) => ({ ...f, answers: { ...f.answers, [id]: value } }));
    setErrors((e) => {
      const next = { ...e };
      delete next[`answers.${id}`];
      return next;
    });
  }

  function validateDetails(): boolean {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name";
    const age = Number(form.age);
    if (!form.age || Number.isNaN(age) || age < 10 || age > 90)
      next.age = "Please enter a valid age";
    if (!/^[+]?[0-9][0-9\s-]{8,14}$/.test(form.phone.trim()))
      next.phone = "Please enter a valid phone number";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim()))
      next.email = "Please enter a valid email";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateQuestions(): boolean {
    const next: Record<string, string> = {};
    for (const q of event.questions) {
      if (q.required && !form.answers[q.id]?.trim())
        next[`answers.${q.id}`] = "This question is required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit() {
    setSubmitting(true);
    try {
      const res = await registerForEvent({
        eventId: event.id,
        name: form.name,
        age: form.age,
        phone: form.phone,
        email: form.email,
        answers: form.answers,
      });
      if (res.ok && res.data) {
        setResult(res.data);
        setStep("done");
      } else {
        if (res.fieldErrors) {
          setErrors(res.fieldErrors);
          const detailFields = ["name", "age", "phone", "email"];
          if (Object.keys(res.fieldErrors).some((k) => detailFields.includes(k))) {
            setStep("details");
          }
        }
        toast.error(res.message);
      }
    } catch {
      toast.error("Network error — please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleNext() {
    if (step === "details") {
      if (!validateDetails()) return;
      if (hasQuestions) setStep("questions");
      else void submit();
    } else if (step === "questions") {
      if (!validateQuestions()) return;
      void submit();
    }
  }

  const motionProps = reduce
    ? {}
    : {
        initial: { opacity: 0, x: 16 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -16 },
        transition: { duration: 0.25 },
      };

  if (step === "done" && result) {
    return (
      <motion.div
        {...(reduce ? {} : { initial: { opacity: 0, scale: 0.97 }, animate: { opacity: 1, scale: 1 } })}
        className="rounded-2xl border border-border bg-card p-8 text-center sm:p-12"
      >
        <CheckCircle2 className="mx-auto size-14 text-primary" aria-hidden />
        <h2 className="mt-5 font-display text-3xl font-bold uppercase italic tracking-wide">
          {result.status === "confirmed" ? "You're in!" : "You're on the waitlist"}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          {result.status === "confirmed"
            ? `See you at ${event.title}. We've saved your spot — details land in the WhatsApp group.`
            : "The session is full, but spots open up often. We'll message you the moment one does."}
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {result.status === "confirmed" && result.whatsappGroupUrl && (
            <Button asChild size="lg" className="font-semibold">
              <a href={result.whatsappGroupUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" aria-hidden />
                Join the event WhatsApp group
              </a>
            </Button>
          )}
          <Button asChild size="lg" variant="outline">
            <Link href="/events">Browse more sessions</Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
      noValidate
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      {/* Progress */}
      <div className="mb-8 flex items-center gap-2" aria-hidden>
        {steps.slice(0, -1).map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= stepIndex ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Step {stepIndex + 1} of {steps.length - 1}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {step === "details" && (
          <motion.fieldset key="details" {...motionProps} className="space-y-5" disabled={submitting}>
            <legend className="font-display text-2xl font-bold uppercase tracking-wide">
              Your details
            </legend>

            <div className="space-y-2">
              <Label htmlFor="reg-name">Full name *</Label>
              <Input
                id="reg-name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "reg-name-error" : undefined}
                placeholder="Your name"
              />
              {errors.name && (
                <p id="reg-name-error" className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reg-age">Age *</Label>
                <Input
                  id="reg-age"
                  type="number"
                  inputMode="numeric"
                  min={10}
                  max={90}
                  value={form.age}
                  onChange={(e) => setField("age", e.target.value)}
                  aria-invalid={!!errors.age}
                  aria-describedby={errors.age ? "reg-age-error" : undefined}
                  placeholder="21"
                />
                {errors.age && (
                  <p id="reg-age-error" className="text-sm text-destructive">{errors.age}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-phone">WhatsApp number *</Label>
                <Input
                  id="reg-phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "reg-phone-error" : undefined}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && (
                  <p id="reg-phone-error" className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email">Email (optional)</Label>
              <Input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "reg-email-error" : undefined}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p id="reg-email-error" className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
          </motion.fieldset>
        )}

        {step === "questions" && (
          <motion.fieldset key="questions" {...motionProps} className="space-y-5" disabled={submitting}>
            <legend className="font-display text-2xl font-bold uppercase tracking-wide">
              A few quick questions
            </legend>

            {event.questions.map((q) => {
              const errKey = `answers.${q.id}`;
              const fieldId = `reg-${q.id}`;
              return (
                <div key={q.id} className="space-y-2">
                  <Label htmlFor={fieldId}>
                    {q.label} {q.required && "*"}
                  </Label>
                  {q.type === "textarea" && (
                    <Textarea
                      id={fieldId}
                      rows={3}
                      value={form.answers[q.id] ?? ""}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                      aria-invalid={!!errors[errKey]}
                    />
                  )}
                  {q.type === "text" && (
                    <Input
                      id={fieldId}
                      value={form.answers[q.id] ?? ""}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                      aria-invalid={!!errors[errKey]}
                    />
                  )}
                  {q.type === "select" && (
                    <Select
                      value={form.answers[q.id] ?? ""}
                      onValueChange={(v) => setAnswer(q.id, v ?? "")}
                    >
                      <SelectTrigger id={fieldId} aria-invalid={!!errors[errKey]} className="w-full">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {(q.options ?? []).map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors[errKey] && (
                    <p className="text-sm text-destructive">{errors[errKey]}</p>
                  )}
                </div>
              );
            })}
          </motion.fieldset>
        )}
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between gap-3">
        {step === "questions" ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep("details")}
            disabled={submitting}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Button>
        ) : (
          <span />
        )}

        <Button type="submit" size="lg" className="font-semibold" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Submitting…
            </>
          ) : step === "details" && hasQuestions ? (
            <>
              Continue
              <ArrowRight className="size-4" aria-hidden />
            </>
          ) : isFull ? (
            "Join the waitlist"
          ) : (
            "Confirm my spot"
          )}
        </Button>
      </div>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        By registering you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
          terms &amp; conditions
        </Link>
        .
      </p>
    </form>
  );
}
