import HumidityCard from "@/components/humidity-card";
import { SetPointCard } from "@/components/setpoint-temperature";
import { TemperatureCard } from "@/components/temperature-card";
import { fontFamily } from "@/constants/fontFamily";
import { CloudAdd } from "iconsax-react-nativejs";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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
          <ScrollView
            style={styles.monitorScroll}
            contentContainerStyle={styles.monitorData}
            showsVerticalScrollIndicator={false}
          >
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
            <HumidityCard title="HUMIDITY" humidity={45} state="normal" />
            <SetPointCard
              title="SETPOINT TEMPERATURE"
              temperature={36.3}
              state="normal"
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
  monitorScroll: {
    marginTop: 20,
  },
  monitorData: {
    gap: 12,
    paddingBottom: 40, // so last card isn't hidden by tab bar
  },
});
