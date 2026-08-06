import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nxpurdeeleevjqtlzymm.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54cHVyZGVlbGVldmpxdGx6eW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODI5MTMsImV4cCI6MjA5NzM1ODkxM30.8UREPVHgqMQycjDAPAeH9GFkjw-uKMgN-SXtG14PpXU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

export const PARAMETERS_TABLE = "Parameters";
export const COMMANDS_TABLE = "commands";

export type SendCommandResult =
  | { sent: true }
  | { sent: false; reason: "offline" | "error"; error?: unknown };

export async function sendDeviceCommand(
  action: string,
  value: number,
  isOnline: boolean
): Promise<SendCommandResult> {
  if (!isOnline) {
    console.warn(`Command blocked -- device offline: ${action} = ${value}`);
    return { sent: false, reason: "offline" };
  }

  const { error } = await supabase
    .from(COMMANDS_TABLE)
    .insert([{ action, value, status: "PENDING" }]);

  if (error) {
    console.error("Failed to send command:", error.message);
    return { sent: false, reason: "error", error };
  }

  console.log(`Command Sent: ${action} = ${value}`);
  return { sent: true };
}
