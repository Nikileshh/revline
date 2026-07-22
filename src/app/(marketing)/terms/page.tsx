import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";

import { getSiteSettings } from "@/server/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for participating in RevLine community sessions.",
};

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        The fine print
      </p>
      <h1 className="mt-3 font-display text-5xl font-bold uppercase tracking-wide sm:text-6xl">
        Terms &amp; Conditions
      </h1>

      <article className="prose mt-10 max-w-none text-foreground prose-headings:font-display prose-headings:uppercase prose-headings:tracking-wide prose-headings:text-foreground prose-p:leading-relaxed prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90 prose-a:text-primary hover:prose-a:text-primary/80 prose-blockquote:text-foreground/80 prose-blockquote:border-primary prose-code:text-foreground">
        {settings.terms_md ? (
          <ReactMarkdown>{settings.terms_md}</ReactMarkdown>
        ) : (
          <p className="text-muted-foreground">
            Terms will be published here shortly. Meanwhile, reach out on Instagram with
            any questions.
          </p>
        )}
      </article>
    </div>
  );
}
