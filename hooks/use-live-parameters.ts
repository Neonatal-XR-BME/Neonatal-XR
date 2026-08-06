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

// How long a reading can sit without a newer one arriving before we call
// the device offline, rather than just "still connected to Supabase".
// Normal device sync runs ~2-3s, so this leaves real headroom before
// flagging anything as stale.
const STALE_MS = 15000;

// How often staleness gets re-checked. This has to be a ticking interval,
// not just logic that reruns when `row` changes -- if the device actually
// goes quiet, `row` stops updating entirely, so anything only keyed off a
// `row` change would never notice and would keep showing the last state
// forever.
const STALE_CHECK_MS = 2000;

// device_timestamp comes in as Unix seconds (e.g. 1784385125), Date.now()
// is milliseconds -- this normalizes either.
function toMillis(ts: string | number | null): number | null {
  if (ts === null || ts === undefined) return null;
  const n = typeof ts === "string" ? Number(ts) : ts;
  if (!Number.isFinite(n)) return null;
  return n < 1e12 ? n * 1000 : n;
}

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
 *
 * "live" requires BOTH a subscribed channel AND a recent device_timestamp.
 * A subscribed channel only tells you the phone is talking to Supabase --
 * it says nothing about whether the physical device is still reporting.
 * Without the freshness check, status shows "Online" forever off the last
 * row ever received, even long after the device itself has gone quiet.
 */
export function useLiveParameters() {
  const [row, setRow] = useState<ParameterRow | null>(null);
  const [status, setStatus] = useState<ConnectionState>("connecting");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rowRef = useRef<ParameterRow | null>(null);
  const channelConnectedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const startPolling = () => {
      if (pollRef.current) return;
      pollRef.current = setInterval(async () => {
        const latest = await fetchLatest();
        if (mounted && latest) {
          rowRef.current = latest;
          setRow(latest);
        }
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
      if (latest) {
        rowRef.current = latest;
        setRow(latest);
      }
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
          if (next) {
            rowRef.current = next;
            setRow(next);
          }
        }
      )
      .subscribe((channelStatus) => {
        console.log("[REALTIME] channel status:", channelStatus);
        if (!mounted) return;
        if (channelStatus === "SUBSCRIBED") {
          channelConnectedRef.current = true;
          stopPolling();
        } else if (
          channelStatus === "CHANNEL_ERROR" ||
          channelStatus === "TIMED_OUT" ||
          channelStatus === "CLOSED"
        ) {
          channelConnectedRef.current = false;
          startPolling();
        }
      });

    // Ticks independently of both the channel and `row` -- this is the
    // piece that actually catches "device went quiet". A subscribed
    // channel + a stale row still counts as offline.
    const staleCheck = setInterval(() => {
      if (!mounted) return;

      const currentRow = rowRef.current;
      if (!currentRow) {
        setStatus("connecting");
        return;
      }

      const ts = toMillis(currentRow.device_timestamp);
      const fresh = ts !== null && Date.now() - ts <= STALE_MS;

      setStatus(channelConnectedRef.current && fresh ? "live" : "offline");
    }, STALE_CHECK_MS);

    return () => {
      mounted = false;
      stopPolling();
      clearInterval(staleCheck);
      supabase.removeChannel(channel);
    };
  }, []);

  return { row, status };
}
