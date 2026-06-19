import { fontFamily } from "@/constants/fontFamily";
import { ORIENTATION } from "@/constants/training-content";
import { useRouter } from "expo-router";
import { TickCircle } from "iconsax-react-nativejs";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Orientation() {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.pageTitle}>
          {ORIENTATION.number}. {ORIENTATION.title}
        </Text>
        <Text style={styles.intro}>{ORIENTATION.intro}</Text>

        {/* Sections */}
        {ORIENTATION.sections.map((section) => (
          <View key={section.number} style={styles.section}>
            <Text style={styles.sectionHeading}>
              {section.number} {section.heading}
            </Text>

            {section.paragraphs?.map((p, i) => (
              <Text key={i} style={styles.body}>
                {p}
              </Text>
            ))}

            {section.bullets?.map((b, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{b}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* Mark as completed */}
        <Pressable
          onPress={() => setCompleted((c) => !c)}
          android_ripple={{ color: "#E2E2E8" }}
          style={({ pressed }) => [
            styles.completeBtn,
            completed && styles.completeBtnActive,
            pressed && styles.completeBtnPressed,
          ]}
        >
          <Text
            style={[
              styles.completeBtnText,
              completed && styles.completeBtnTextActive,
            ]}
          >
            {completed ? "COMPLETED" : "MARK AS COMPLETED"}
          </Text>
          <TickCircle
            size={16}
            stroke="2"
            color={completed ? "hsla(160, 100%, 32%, 1)" : "#222"}
          />
        </Pressable>

        {/* Next module */}
        <Pressable
          onPress={() => router.push("/training/components" as any)}
          android_ripple={{ color: "#2A5BFF" }}
          style={({ pressed }) => [
            styles.nextBtn,
            pressed && styles.nextBtnPressed,
          ]}
        >
          <Text style={styles.nextBtnText}>NEXT MODULE</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F4F8",
  },
  scroll: {
    flex: 1,
    paddingTop: 48,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  pageTitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: "#1A1A1A",
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  intro: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: "#6B6B6B",
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  section: {
    marginTop: 26,
  },
  sectionHeading: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: "#1A1A1A",
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  body: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: "#6B6B6B",
    lineHeight: 22,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bulletDot: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: "#6B6B6B",
    lineHeight: 22,
    width: 14,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: "#6B6B6B",
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  completeBtn: {
    marginTop: 34,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#878787", // RGB equivalent of the gray color
    shadowOpacity: 0.92,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    display: "flex",
    flexDirection: "row",
    gap: 8,
  },
  completeBtnActive: {
    backgroundColor: "#FFFFFF",
  },
  completeBtnPressed: {
    transform: [{ scale: 0.99 }],
  },
  completeBtnText: {
    fontSize: 14,
    fontFamily: fontFamily.semibold,
    color: "#1A1A1A",
    letterSpacing: 0.2,
  },
  completeBtnTextActive: {
    color: "hsla(160, 100%, 32%, 1)",
  },
  nextBtn: {
    marginTop: 16,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#0749FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7FA0FB",
    shadowOpacity: 0.92,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  nextBtnPressed: {
    backgroundColor: "#0640DB",
    transform: [{ scale: 0.99 }],
  },
  nextBtnText: {
    fontSize: 14,
    fontFamily: fontFamily.semibold,
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
});
