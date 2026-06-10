import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project-ref.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-supabase-anon-key";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Server-side client for server components
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const createServerClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
};

// Client-side client for client components
export const createBrowserClient = () => {
  return createClient(supabaseUrl, supabaseKey);
};
