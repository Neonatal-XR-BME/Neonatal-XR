import { fontFamily } from "@/constants/fontFamily";
import { getStatusColors } from "@/utils/theme-helpers";
import {
  Link2,
  Notification1,
  NotificationBing,
  Sun,
  Verify,
} from "iconsax-react-nativejs";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import DetailsCard from "./details-card";

const circuitryData = [
  {
    id: "1",
    icon: <Link2 size={24} color="#222" variant="Bold" />,
    cardTitle: "Skin Probe Connected",
    cardData: "YES",
  },
  {
    id: "2",
    icon: <Sun size={24} color="#222" variant="Bold" />,
    cardTitle: "Fan/airflow Working",
    cardData: "YES",
  },
  {
    id: "3",
    icon: <NotificationBing size={24} color="#222" variant="Bold" />,
    cardTitle: "Active Alarm",
    cardData: "NO",
  },
  {
    id: "4",
    icon: <Notification1 size={24} color="#222" variant="Bold" />,
    cardTitle: "Alarm Trigger Reason",
    cardData: "NO ALARM",
  },
  {
    id: "5",
    icon: <Verify size={24} color="#222" variant="Bold" />,
    cardTitle: "Device Safety",
    cardData: "SAFE",
  },
];

export default function SafetyAlarms() {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.textBox}>
          <Text style={styles.textHeader}>Safety Alarms</Text>
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
        {circuitryData.map((item) => {
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
