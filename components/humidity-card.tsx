import { fontFamily } from "@/constants/fontFamily";
import { Drop } from "iconsax-react-nativejs";
import { StyleSheet, Text, View } from "react-native";

export interface HumidityCardProps {
  title: string;
  humidity: number;
  state: string;
}

export default function HumidityCard({
  title,
  humidity,
  state,
}: HumidityCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.humidityContainer}>
        <View
          style={[
            styles.humidityCircle,
            { borderColor: state === "normal" ? "#00A16C" : "#FF4D4D" },
          ]}
        >
          <Drop size={20} color="#00A16C" variant="Bold" />
          <View style={styles.tempValue}>
            <Text style={styles.value}>{humidity}</Text>
            <Text style={styles.unit}>%</Text>
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.text}>
          Average value should be between{" "}
          <Text style={styles.highlight}>30%-50%</Text>. The current humidity
          level is <Text style={styles.highlightTwo}>{state}</Text>
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
    alignItems: "baseline",
    gap: 4,
  },
  unit: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
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
  humidityCircle: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    width: 120,
    height: 120,
    borderRadius: 80,
    borderWidth: 10,
  },
  humidityContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
