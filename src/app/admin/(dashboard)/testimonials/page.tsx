import { TestimonialsManager } from "@/components/admin/testimonials-manager";
import { supabaseServer } from "@/lib/supabase/server";
import type { Testimonial } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <h1 className="font-display text-4xl font-bold uppercase tracking-wide">
        Testimonials
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Member quotes shown on the homepage.
      </p>
      <div className="mt-6">
        <TestimonialsManager testimonials={(data as Testimonial[]) ?? []} />
      </div>
    </div>
  );
}
