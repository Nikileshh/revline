import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { publicEnv, serverEnv } from "@/lib/env";

/** Cookie-aware client bound to the current request's auth session (admin). */
export async function supabaseServer(): Promise<SupabaseClient> {
  const cookieStore = await cookies();
  const env = publicEnv();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — middleware refreshes sessions.
          }
        },
      },
    },
  );
}

/** Anonymous read-only client for public pages (no cookies, cacheable). */
export function supabaseAnon(): SupabaseClient {
  const env = publicEnv();
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } },
  );
}

/** Service-role client. Server actions only — bypasses RLS. */
export function supabaseAdmin(): SupabaseClient {
  const env = publicEnv();
  const secrets = serverEnv();
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, secrets.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}
