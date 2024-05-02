// PG PASS: 1nv01c3fl0w!
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey)