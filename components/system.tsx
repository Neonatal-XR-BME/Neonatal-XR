import { fontFamily } from "@/constants/fontFamily";
import { getStatusColors } from "@/utils/theme-helpers";
import {
  Airdrop,
  CloudConnection,
  Cpu,
  Setting5,
  Timer,
} from "iconsax-react-nativejs";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import DetailsCard from "./details-card";

const systemData = [
  {
    id: "1",
    icon: <Airdrop size={24} color="#222" variant="Bold" />,
    cardTitle: "Device Online",
    cardData: "ONLINE",
  },
  {
    id: "2",
    icon: <Timer size={24} color="#222" variant="Bold" />,
    cardTitle: "Device Uptime",
    cardData: "56 MINS",
  },
  {
    id: "3",
    icon: <CloudConnection size={24} color="#222" variant="Bold" />,
    cardTitle: "Device Serial Number",
    cardData: "NW-BME2026",
  },
  {
    id: "4",
    icon: <Cpu size={24} color="#222" variant="Bold" />,
    cardTitle: "Firmware Version ID",
    cardData: "V2.1",
  },
  {
    id: "5",
    icon: <Setting5 size={24} color="#222" variant="Bold" />,
    cardTitle: "Last Calibration Date",
    cardData: "03-03-2026",
  },
];

export default function System() {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.textBox}>
          <Text style={styles.textHeader}>Device and System Info</Text>
          <Text style={styles.text}>Last Synced - 1 min ago</Text>
        </View>

        <Pressable
          onPress={() => {}}
          android_ripple={{ color: "#BCCDFB" }}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonActive,
          ]}
        >
          {({ pressed }) => (
            <Text
              style={[styles.buttonText, pressed && styles.buttonTextActive]}
            >
              Sync Data
            </Text>
          )}
        </Pressable>
      </View>
      <ScrollView
        style={styles.cardContainer}
        contentContainerStyle={styles.cardContainerContent}
        showsVerticalScrollIndicator={false}
      >
        {systemData.map((item) => {
          const colors = getStatusColors(item.cardData);
          return (
            <DetailsCard
              key={item.id}
              icon={item.icon}
              cardTitle={item.cardTitle}
              cardData={item.cardData}
              dataBgColor={colors.bg}
              dataTextColor={colors.text}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
  },
  textBox: {
    flexDirection: "column",
    gap: 4,
  },
  buttonContainer: {
    marginLeft: 16,
  },
  textHeader: {
    fontSize: 14,
    fontFamily: fontFamily.semibold,
    color: "#333",
  },
  text: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: "#666",
  },
  button: {
    backgroundColor: "#DEE6FE",
    borderRadius: 9,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: "#0749FF",
    fontSize: 14,
    fontFamily: fontFamily.medium,
  },
  cardContainer: {
    marginTop: 20,
  },
  cardContainerContent: {
    gap: 16,
    paddingBottom: 20,
  },
  buttonActive: {
    backgroundColor: "#C6D6FF", // darker on press
    transform: [{ scale: 0.985 }], // slight shrink like :active
    elevation: 1,
    shadowOpacity: 0.06,
  },
  buttonTextActive: {
    color: "#042ED6", // darker text when pressed
  },
});
