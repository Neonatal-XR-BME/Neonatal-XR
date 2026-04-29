import { TemperatureCard } from "@/components/temperature-card";
import { fontFamily } from "@/constants/fontFamily";
import { CloudAdd } from "iconsax-react-nativejs";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          {/* Upper Part Display */}
          <View style={styles.upperPart}>
            <View style={styles.statusContainer}>
              <Text style={styles.statusTextHeading}>Live Monitor</Text>
              <Text style={styles.statusText}>
                Status: <Text style={styles.statusTextOnline}>Online</Text>
              </Text>
            </View>
            <CloudAdd variant="Bold" color="#01885B" size={28} />
          </View>
          {/* Temperature Cards */}
          <View style={styles.monitorData}>
            <TemperatureCard
              title="CORE TEMPERATURE"
              temperature={36.5}
              state="normal"
            />
            <TemperatureCard
              title="AMBIENT TEMPERATURE"
              temperature={24.5}
              state="normal"
            />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F8",
    padding: 16,
  },
  upperPart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusTextHeading: {
    fontSize: 16,
    color: "#222",
    fontFamily: fontFamily.bold,
  },

  statusText: {
    fontSize: 12,
    color: "#8E8E8E",
    fontFamily: fontFamily.regular,
  },
  statusTextOnline: {
    color: "#01885B",
    fontFamily: fontFamily.bold,
  },

  statusContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 2,
  },
  monitorData: {
    marginTop: 20,
    flexDirection: "column",
    gap: 12,
    height: "100%",
  },
});
