import { fontFamily } from "@/constants/fontFamily";
import { StyleSheet, Text, View } from "react-native";
import TemperatureBar from "./temperature-bar";

export interface TemperatureCardProps {
  title: string;
  temperature: number;
  state: string;
}

export function TemperatureCard({
  title,
  temperature,
  state,
}: TemperatureCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.tempValue}>
        <Text style={styles.value}>{temperature}</Text>
        <Text style={styles.unit}>°C</Text>
      </View>
      <TemperatureBar temperature={temperature} />
      <View style={styles.tempValue}>
        <Text style={styles.text}>
          Average value should be between{" "}
          <Text style={styles.highlight}>36.1°C - 36.5°C</Text>. The current
          core temperature is <Text style={styles.highlightTwo}>{state}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 0.5,
    borderColor: "#F0F0F0",
    gap: 14,
  },
  title: {
    fontSize: 11,
    fontFamily: fontFamily.medium,
    paddingHorizontal: 5,
    paddingVertical: 3,
    color: "#575757",
    backgroundColor: "#EEEEEE",
    alignSelf: "flex-start",
    borderRadius: 3,
  },
  tempValue: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },
  unit: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    lineHeight: 0,
    marginTop: 4,
  },
  value: {
    fontSize: 28,
    fontFamily: fontFamily.semibold,
    letterSpacing: -0.5,
    lineHeight: -20,
  },
  text: {
    fontSize: 11,
    fontFamily: fontFamily.medium,
    lineHeight: 0,
    color: "#A0A0A0",
  },
  highlight: {
    fontFamily: fontFamily.semibold,
    color: "#393939",
  },
  highlightTwo: {
    fontFamily: fontFamily.semibold,
    color: "#00A16C",
  },
});
