import { fontFamily } from "@/constants/fontFamily";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SafetyAlarms() {
  return (
    <View>
      <View>
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
      </View>
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
  buttonActive: {
    backgroundColor: "#C6D6FF", // darker on press
    transform: [{ scale: 0.985 }], // slight shrink like :active
    elevation: 1,
    shadowOpacity: 0.06,
  },
  buttonText: {
    color: "#0749FF",
    fontSize: 14,
    fontFamily: fontFamily.medium,
  },
  buttonTextActive: {
    color: "#042ED6", // darker text when pressed
  },
});
