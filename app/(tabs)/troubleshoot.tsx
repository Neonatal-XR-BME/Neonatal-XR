import Circuitry from "@/components/circuitry";
import SafetyAlarms from "@/components/safety-alarm";
import System from "@/components/system";
import { fontFamily } from "@/constants/fontFamily";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Troubleshoot() {
  type TroubleshootTab = "circuitry" | "safety" | "system";

  const [activeTab, setActiveTab] = useState<TroubleshootTab>("circuitry");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          {/* Tab Switch */}
          <View style={styles.tabContainer}>
            <View
              style={[
                styles.tab,
                activeTab === "circuitry" && styles.activeTab,
              ]}
              onTouchEnd={() => setActiveTab("circuitry")}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === "circuitry" ? "#FFFFFF" : "#7D7D7D",
                  },
                ]}
              >
                Circuitry
              </Text>
            </View>
            <View
              style={[styles.tab, activeTab === "safety" && styles.activeTab]}
              onTouchEnd={() => setActiveTab("safety")}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === "safety" ? "#FFFFFF" : "#7D7D7D" },
                ]}
              >
                Safety Alarm
              </Text>
            </View>
            <View
              style={[styles.tab, activeTab === "system" && styles.activeTab]}
              onTouchEnd={() => setActiveTab("system")}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === "system" ? "#FFFFFF" : "#7D7D7D" },
                ]}
              >
                System Info
              </Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            {/* Content based on active tab */}
            {activeTab === "circuitry" && <Circuitry />}
            {activeTab === "safety" && <SafetyAlarms />}
            {activeTab === "system" && <System />}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F4F4F8",
    paddingHorizontal: 16,
    paddingTop: 24,
    flex: 1,
    justifyContent: "space-between",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tab: {
    width: "32%",
    paddingHorizontal: 5,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9,
    backgroundColor: "#DEDEDE",
  },
  activeTab: {
    backgroundColor: "#0749FF",
  },
  tabText: {
    textTransform: "uppercase",
    fontFamily: fontFamily.medium,
    fontSize: 13,
    letterSpacing: -0.3,
  },
});
