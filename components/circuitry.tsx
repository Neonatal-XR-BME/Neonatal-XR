import { fontFamily } from "@/constants/fontFamily";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Circuitry() {
  return (
    <View>
      <View>
        <View style={styles.box}>
          <View style={styles.textBox}>
            <Text style={styles.textHeader}>System Circuitry</Text>
            <Text style={styles.text}>Last Synced - 1 min ago</Text>
          </View>

          <Pressable style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Sync Data</Text>
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
  buttonText: {
    color: "#0749FF",
    fontSize: 14,
    fontFamily: fontFamily.medium,
  },
});
