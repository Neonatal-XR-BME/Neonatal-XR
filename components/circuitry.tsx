import { fontFamily } from "@/constants/fontFamily";
import { getStatusColors } from "@/utils/theme-helpers";
import {
  Electricity,
  Flash,
  Lamp,
  SafeHome,
  Setting,
} from "iconsax-react-nativejs";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import DetailsCard from "./details-card";

const circuitryData = [
  {
    id: "1",
    icon: <Lamp size={24} color="#222" variant="Bold" />,
    cardTitle: "Heater Switch State",
    cardData: "Online",
  },
  {
    id: "2",
    icon: <Flash size={24} color="#222" variant="Bold" />,
    cardTitle: "Heater Effort Level",
    cardData: "98%",
  },
  {
    id: "3",
    icon: <SafeHome size={24} color="#222" variant="Bold" />,
    cardTitle: "Voltage Leakage",
    cardData: "LEAKAGE",
  },
  {
    id: "4",
    icon: <Electricity size={24} color="#222" variant="Bold" />,
    cardTitle: "Input Power Source",
    cardData: "MAIN",
  },
  {
    id: "5",
    icon: <Setting size={24} color="#222" variant="Bold" />,
    cardTitle: "Fuse Status",
    cardData: "Active",
  },
];

export default function Circuitry() {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.textBox}>
          <Text style={styles.textHeader}>System Circuitry</Text>
          <Text style={styles.text}>Last Synced - 1 min ago</Text>
        </View>

        <Pressable style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Sync Data</Text>
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
});
