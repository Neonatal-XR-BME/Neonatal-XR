import VRNavigator from "@/components/vr-view";
import { fontFamily } from "@/constants/fontFamily";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { router } from "expo-router";
import { ArrowLeft2 } from "iconsax-react-nativejs";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function GlassBackButton() {
  // Liquid Glass only works on iOS 26+
  if (Platform.OS === "ios" && isLiquidGlassAvailable()) {
    return (
      <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
        <GlassView style={styles.glassButton} isInteractive>
          <ArrowLeft2 variant="Bold" size={20} color="#fff" />
          <Text style={styles.glassButtonText}>Back</Text>
        </GlassView>
      </TouchableOpacity>
    );
  }

  // Fallback for older iOS / Android
  return (
    <TouchableOpacity
      style={styles.fallbackButton}
      onPress={() => router.back()}
    >
      <ArrowLeft2 size={20} color="#fff" />
      <Text style={styles.fallbackButtonText}>Back</Text>
    </TouchableOpacity>
  );
}

export default function VRSceneScreen() {
  return (
    <View style={{ flex: 1 }}>
      <VRNavigator />
      <View style={styles.overlay}>
        <GlassBackButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 60,
    left: 20,
  },
  glassButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 100,
  },
  glassButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: fontFamily.medium,
  },
  fallbackButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
  },
  fallbackButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
