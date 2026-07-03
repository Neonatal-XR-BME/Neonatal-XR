import { createClient } from "@supabase/supabase-js";

// NOTE: the anon key is a public client key (safe to ship in an app), but for
// cleanliness move these into app config / env (e.g. expo-constants extra)
// rather than hardcoding long-term.
const SUPABASE_URL = "https://nxpurdeeleevjqtlzymm.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54cHVyZGVlbGVldmpxdGx6eW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODI5MTMsImV4cCI6MjA5NzM1ODkxM30.8UREPVHgqMQycjDAPAeH9GFkjw-uKMgN-SXtG14PpXU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

export const PARAMETERS_TABLE = "Parameters";
export const COMMANDS_TABLE = "commands";

// --- SEND DEVICE FUNCTION ---
export async function sendDeviceCommand(action: string, value: number = 0) {
  const { error } = await supabase
    .from(COMMANDS_TABLE)
    .insert([{ action, value, status: "PENDING" }]);

  if (error) {
    console.error("Failed to send command:", error.message);
  } else {
    console.log(`Command Sent: ${action} = ${value}`);
  }
}
