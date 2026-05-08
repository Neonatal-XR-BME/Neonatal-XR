import { fontFamily } from "@/constants/fontFamily";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface DetailsCardProps {
  icon: React.ReactNode;
  cardTitle: string;
  cardData: string | number;
  dataBgColor?: string;
  dataTextColor?: string;
}

export default function DetailsCard({
  icon,
  cardTitle,
  cardData,
  dataBgColor,
  dataTextColor,
}: DetailsCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {icon}
        <Text style={styles.cardTitle}>{cardTitle}</Text>
        <Text
          style={[
            styles.cardData,
            {
              backgroundColor: dataBgColor ? dataBgColor : "#DEE6FE",
              color: dataTextColor ? dataTextColor : "#222",
            },
          ]}
        >
          {cardData}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#fff",
  },
  content: {
    flexDirection: "column",
    gap: 14,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: "#545454",
  },
  cardData: {
    fontSize: 13,
    fontFamily: fontFamily.medium,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
});
