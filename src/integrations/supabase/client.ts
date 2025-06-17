
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://njepmmstofsfmhmcjxox.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qZXBtbXN0b2ZzZm1obWNqeG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMTU5MTAsImV4cCI6MjA2NTU5MTkxMH0.BQjrzowtIsdgB_dsbN7x_jIpn15L9hJVpRg2Eky0eJM'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
