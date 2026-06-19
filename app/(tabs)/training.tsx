import SwipeableScreen from "@/components/swipeablewrapper";
import { fontFamily } from "@/constants/fontFamily";
import { MODULES, ModuleMeta } from "@/constants/training-content";
import { useRouter } from "expo-router";
import {
  Book1,
  Cpu,
  Setting2,
  TickCircle,
  Warning2,
} from "iconsax-react-nativejs";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function ModuleIcon({ name }: { name: ModuleMeta["icon"] }) {
  const size = 72;
  const color = "#0749FF";
  switch (name) {
    case "book":
      return <Book1 size={size} variant="Bold" color={color} />;
    case "cpu":
      return <Cpu size={size} variant="Bold" color="#0B6B45" />;
    case "gear":
      return <Setting2 size={size} variant="Bold" color={color} />;
    case "warning":
      return <Warning2 size={size} variant="Bold" color="#0B6B45" />;
    case "check":
      return <TickCircle size={size} variant="Bold" color={color} />;
  }
}

function ModuleCard({ module }: { module: ModuleMeta }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(module.route as any)}
      android_ripple={{ color: "#E2E2E8" }}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={[styles.cardHeader, { backgroundColor: module.accent }]}>
        <ModuleIcon name={module.icon} />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>
          {module.index} {module.title.toUpperCase()}
        </Text>
        <Text style={styles.cardBlurb}>{module.blurb}</Text>
      </View>
    </Pressable>
  );
}

export default function Training() {
  return (
    <SafeAreaProvider>
      <SwipeableScreen>
        <SafeAreaView style={styles.screen} edges={["top"]}>
          <View style={styles.headerBlock}>
            <Text style={styles.header}>Training</Text>
            <Text style={styles.subHeader}>Get Familiar with the device</Text>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {MODULES.map((m) => (
              <ModuleCard key={m.key} module={m} />
            ))}
          </ScrollView>
        </SafeAreaView>
      </SwipeableScreen>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F4F8",
  },
  headerBlock: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    gap: 4,
  },
  header: {
    fontSize: 16,
    fontFamily: fontFamily.semibold,
    color: "#1A1A1A",
    letterSpacing: -0.4,
  },
  subHeader: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    color: "#8A8A8A",
    letterSpacing: -0.2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    gap: 20,
  },
  card: {
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    height: 170,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: fontFamily.bold,
    color: "#1A1A1A",
    letterSpacing: -0.3,
  },
  cardBlurb: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    color: "#8A8A8A",
    lineHeight: 19,
    letterSpacing: -0.2,
  },
});
