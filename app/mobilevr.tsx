import VRRoomScene from "@/components/vr-room-scene";
import { ViroMaterials, ViroVRSceneNavigator } from "@reactvision/react-viro";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Register materials once at module load. Guard so fast-refresh re-runs don't
// throw on duplicate registration.
try {
  ViroMaterials.createMaterials({
    arrowIdle: { diffuseColor: "rgba(255,255,255,0.18)" },
    arrowActive: { diffuseColor: "rgba(7,73,255,0.55)" },
    reticle: { diffuseColor: "rgba(255,255,255,0.9)" },
  });
} catch {
  // already registered
}

/**
 * Mobile VR screen for Google Cardboard / Shinecon on Android (GVR).
 *
 * Stereo via ViroVRSceneNavigator + vrModeEnabled. Rotation of the model is
 * handled inside the scene via gaze + remote click (see vr-room-scene).
 * onExitViro navigates away so the view isn't left blank after exit.
 */
export default function MobileVRScreen() {
  return (
    <View style={styles.container}>
      <ViroVRSceneNavigator
        vrModeEnabled={true}
        pbrEnabled
        initialScene={{ scene: VRRoomScene }}
        onExitViro={() => router.back()}
        style={styles.flex}
      />
      <TouchableOpacity style={styles.exit} onPress={() => router.back()}>
        <Text style={styles.exitText}>Exit</Text>
      </TouchableOpacity>
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
