import VRNavigator from "@/components/vr-view";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VRSceneScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ViroARSceneNavigator
        style={{ flex: 1 }}
        initialScene={{ scene: VRNavigator }}
      />
      <TouchableOpacity style={styles.exitButton} onPress={() => router.back()}>
        <Text style={styles.exitText}>← Exit VR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  exitButton: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  exitText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
