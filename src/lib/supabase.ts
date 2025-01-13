// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Storage client
export const supabaseStorage = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL!,
  process.env.SUPABASE_STORAGE_SERVICE_ROLE_KEY!
);