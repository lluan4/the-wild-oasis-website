import { createClient } from '@supabase/supabase-js';
import { Database } from '@/_types/database.types';

const supabaseUrl = process.env.NEXT_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
