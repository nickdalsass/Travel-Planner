import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_PROJECT_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_ANON_PROJECT_API_KEY!;

// This is how supabase creates a browser client that acts as an interface from which operations can be performed
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
