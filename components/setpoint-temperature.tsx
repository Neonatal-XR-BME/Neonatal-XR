import { fontFamily } from "@/constants/fontFamily";
import { StyleSheet, Text, View } from "react-native";

export interface SetPointCardProps {
  title: string;
  temperature: number;
  state: string;
}

export function SetPointCard({ title, temperature, state }: SetPointCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.tempValue}>
        <View style={styles.indicatorsContainer}>
          <View style={styles.indicator}></View>
          <View style={styles.indicator}></View>
        </View>
        <View style={{ justifyContent: "center" }}>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{temperature}</Text>
            <Text style={styles.unit}>°C</Text>
          </View>
        </View>
        <View style={styles.indicatorsContainer}>
          <View style={styles.indicator}></View>
          <View style={styles.indicator}></View>
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.headText}>HEATER TARGET TEMPERATURE</Text>
        <Text style={styles.text}>
          You can set the target temperature for the heater by adjusting the
          knob on the physical device.
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
    backgroundColor: "#F4F4F4",
    height: 120,
    borderRadius: 12,
    borderColor: "#E1F3FF",
    borderWidth: 1,
    flexDirection: "row",
    padding: 8,
    justifyContent: "space-between",
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
    fontSize: 12,
    fontFamily: fontFamily.medium,
    lineHeight: 16,
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
  indicatorsContainer: {
    flexDirection: "column",

    justifyContent: "space-between",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#B0BEC5",
  },
  valueContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  headText: {
    fontSize: 15,
    fontFamily: fontFamily.semibold,
    lineHeight: 16,
    color: "#393939",
  },
  textContainer: {
    marginTop: 20,
    gap: 6,
  },
});
