import VRRoomScene from "@/components/vr-view";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function MobileVRScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ViroARSceneNavigator
        style={{ flex: 1 }}
        initialScene={{ scene: VRRoomScene }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  flex: { flex: 1 },
  exit: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  exitText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
