import Power from "@/assets/images/Power.svg";
import HumidityCard from "@/components/humidity-card";
import { SetPointCard } from "@/components/setpoint-temperature";
import { TemperatureCard } from "@/components/temperature-card";
import { fontFamily } from "@/constants/fontFamily";
import { useLiveParameters } from "@/hooks/use-live-parameters";
import {
  AMBIENT_RANGE,
  bandFor,
  CORE_RANGE,
  fmt,
  HUMIDITY_RANGE,
} from "@/lib/parameter-state";
import { sendDeviceCommand } from "@/lib/supabase";
import { CloudAdd } from "iconsax-react-nativejs";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Visual fill bounds for the bars.
const CORE_FILL_MIN = 34;
const CORE_FILL_FALLBACK_MAX = 37.5; // used until a valid set target arrives
const AMBIENT_FILL_MIN = 20;
const AMBIENT_FILL_MAX = 26;

export default function HomeScreen() {
  const { row, status } = useLiveParameters();

  const core = fmt(row?.core_temp ?? null);
  const ambient = fmt(row?.ambient_temp ?? null);
  const humidity = fmt(row?.humidity ?? null, 0);
  const setTarget = fmt(row?.set_target ?? null);

  const coreFillMax =
    setTarget > CORE_FILL_MIN ? setTarget : CORE_FILL_FALLBACK_MAX;

  const statusLabel =
    status === "live"
      ? "Online"
      : status === "connecting"
      ? "Connecting"
      : "Offline";
  const statusColor =
    status === "live"
      ? "#01885B"
      : status === "connecting"
      ? "#C28800"
      : "#C0392B";

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <View style={styles.upperPart}>
            <View style={styles.statusContainer}>
              <Text style={styles.statusTextHeading}>Live Monitor</Text>
              <Text style={styles.statusText}>
                Status:{" "}
                <Text style={[styles.statusTextOnline, { color: statusColor }]}>
                  {statusLabel}
                </Text>
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <CloudAdd variant="Bold" color={statusColor} size={36} />
              <Pressable
                onPress={() => {
                  sendDeviceCommand("SYSTEM_ENABLE", 1);
                }}
              >
                <Power />
              </Pressable>
            </View>
          </View>

          <ScrollView
            style={styles.monitorScroll}
            contentContainerStyle={styles.monitorData}
            showsVerticalScrollIndicator={false}
          >
            <TemperatureCard
              title="CORE TEMPERATURE"
              temperature={core}
              state={bandFor(
                row?.core_temp ?? null,
                CORE_RANGE.min,
                CORE_RANGE.max
              )}
              rangeMin={CORE_FILL_MIN}
              rangeMax={coreFillMax}
              normalMin={CORE_RANGE.min}
              normalMax={CORE_RANGE.max}
              expectedLabel={`${CORE_RANGE.min}°C - ${CORE_RANGE.max}°C`}
              metricNoun="core"
            />
            <TemperatureCard
              title="AMBIENT TEMPERATURE"
              temperature={ambient}
              state={bandFor(
                row?.ambient_temp ?? null,
                AMBIENT_RANGE.min,
                AMBIENT_RANGE.max
              )}
              rangeMin={AMBIENT_FILL_MIN}
              rangeMax={AMBIENT_FILL_MAX}
              normalMin={AMBIENT_RANGE.min}
              normalMax={AMBIENT_RANGE.max}
              expectedLabel={`${AMBIENT_RANGE.min}°C - ${AMBIENT_RANGE.max}°C`}
              metricNoun="ambient"
            />
            <HumidityCard
              title="HUMIDITY"
              humidity={humidity}
              state={bandFor(
                row?.humidity ?? null,
                HUMIDITY_RANGE.min,
                HUMIDITY_RANGE.max
              )}
            />
            <SetPointCard
              title="SETPOINT TEMPERATURE"
              temperature={setTarget}
              state="normal"
              onUpdate={(value) => sendDeviceCommand("SET_TEMP", value)}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F4F4F8",
    padding: 16,
    flex: 1,
    justifyContent: "space-between",
  },
  upperPart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusTextHeading: {
    fontSize: 16,
    color: "#222",
    fontFamily: fontFamily.semibold,
  },
  statusText: {
    fontSize: 12,
    color: "#8E8E8E",
    fontFamily: fontFamily.semibold,
  },
  statusTextOnline: {
    color: "#01885B",
    fontFamily: fontFamily.semibold,
  },
  statusContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 2,
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  monitorScroll: {
    marginTop: 20,
  },
  monitorData: {
    gap: 12,
    paddingBottom: 40,
  },
});
