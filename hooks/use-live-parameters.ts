import { PARAMETERS_TABLE, supabase } from "@/lib/supabase";
import { useEffect, useRef, useState } from "react";

export interface ParameterRow {
  device_timestamp: string | number | null;
  core_temp: number | null;
  ambient_temp: number | null;
  humidity: number | null;
  set_target: number | null;
  heater_power: number | null;
  fault_status: string | boolean | null;
  init_phase: boolean | null;
  mains_power: boolean | null;
  system_enabled: boolean | null;
}

export type ConnectionState = "connecting" | "live" | "offline";

// Poll fallback interval (ms) used if realtime isn't available.
const POLL_MS = 5000;

async function fetchLatest(): Promise<ParameterRow | null> {
  const { data, error } = await supabase
    .from(PARAMETERS_TABLE)
    .select("*")
    .order("device_timestamp", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Supabase fetch error:", error.message);
    return null;
  }
  return (data?.[0] as ParameterRow) ?? null;
}

/**
 * Subscribes to the latest device parameters.
 *
 * Strategy: fetch the latest row immediately on mount so the UI has data, then
 * open a realtime channel for INSERT/UPDATE pushes. If realtime never reaches
 * SUBSCRIBED (table not enabled for realtime, network), fall back to polling.
 */
export function useLiveParameters() {
  const [row, setRow] = useState<ParameterRow | null>(null);
  const [status, setStatus] = useState<ConnectionState>("connecting");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let mounted = true;

    const startPolling = () => {
      if (pollRef.current) return;
      pollRef.current = setInterval(async () => {
        const latest = await fetchLatest();
        if (mounted && latest) setRow(latest);
      }, POLL_MS);
    };

    const stopPolling = () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };

    fetchLatest().then((latest) => {
      if (!mounted) return;
      console.log("[INITIAL] latest row:", JSON.stringify(latest, null, 2));
      if (latest) setRow(latest);
    });

    const channel = supabase
      .channel(`parameters-live-${Date.now()}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: PARAMETERS_TABLE },
        (payload) => {
          if (!mounted) return;
          console.log(
            "[REALTIME] new row:",
            JSON.stringify(payload.new, null, 2)
          );
          const next = payload.new as ParameterRow;
          if (next) setRow(next);
        }
      )
      .subscribe((channelStatus) => {
        console.log("[REALTIME] channel status:", channelStatus);
        if (!mounted) return;
        if (channelStatus === "SUBSCRIBED") {
          setStatus("live");
          stopPolling();
        } else if (
          channelStatus === "CHANNEL_ERROR" ||
          channelStatus === "TIMED_OUT" ||
          channelStatus === "CLOSED"
        ) {
          setStatus("offline");
          startPolling();
        }
      });

    return () => {
      mounted = false;
      stopPolling();
      supabase.removeChannel(channel);
    };
  }, []);

  return { row, status };
}
