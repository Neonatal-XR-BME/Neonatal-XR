import { COMPONENTS } from "@/constants/components-content";
import { fontFamily } from "@/constants/fontFamily";
import { useRouter } from "expo-router";
import { ArrowLeft2, ArrowRight2, Box } from "iconsax-react-nativejs";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <View style={styles.photo}>
      <Text style={styles.photoLabel}>PHOTO: {label}</Text>
    </View>
  );
}

function LocateIn3D({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "#E2E2E8", borderless: true }}
      style={styles.locateRow}
      hitSlop={8}
    >
      <Text style={styles.locateText}>Locate in 3D</Text>
      <ArrowRight2 size={15} color="#0749FF" variant="Linear" />
    </Pressable>
  );
}

export default function Components() {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);

  // Dummy 3D handler for now.
  const open3D = () => {};

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>
          {COMPONENTS.number}. {COMPONENTS.title}
        </Text>
        <Text style={styles.intro}>{COMPONENTS.intro}</Text>

        <Pressable
          onPress={open3D}
          android_ripple={{ color: "#2A5BFF" }}
          style={({ pressed }) => [
            styles.assemblyBtn,
            pressed && styles.assemblyBtnPressed,
          ]}
        >
          <Box size={18} color="#FFFFFF" variant="Bold" />
          <Text style={styles.assemblyBtnText}>VIEW FULL ASSEMBLY IN 3D</Text>
        </Pressable>

        <Text style={styles.sectionHeading}>
          {COMPONENTS.componentsNumber} {COMPONENTS.componentsHeading}
        </Text>

        {COMPONENTS.parts.map((part) => (
          <View key={part.name} style={styles.card}>
            <PhotoPlaceholder label={part.photo} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{part.name}</Text>
              <Text style={styles.cardDesc}>{part.description}</Text>
              <LocateIn3D onPress={open3D} />
            </View>
          </View>
        ))}

        <View style={styles.divider} />
        <Text style={styles.sectionHeading}>
          {COMPONENTS.logicNumber} {COMPONENTS.logicHeading}
        </Text>
        <Text style={styles.body}>{COMPONENTS.logicIntro}</Text>

        <Text style={styles.subHeading}>
          {COMPONENTS.servoNumber} {COMPONENTS.servoHeading}
        </Text>
        <Text style={styles.body}>{COMPONENTS.servoBody}</Text>

        <View style={styles.loopBox}>
          <Text style={styles.loopLabel}>SERVO CONTROL LOOP</Text>
          {COMPONENTS.servoLoop.map((step, i) => (
            <View key={step.label}>
              <View style={styles.loopStep}>
                <Text style={styles.loopStepText}>{step.label}</Text>
              </View>
              {i < COMPONENTS.servoLoop.length - 1 && (
                <Text style={styles.loopArrow}>↓</Text>
              )}
            </View>
          ))}
          <View style={styles.loopDashed} />
          <Text style={styles.loopFeedback}>
            {COMPONENTS.servoFeedbackNote}
          </Text>
        </View>

        <Text style={styles.subHeading}>
          {COMPONENTS.manualNumber} {COMPONENTS.manualHeading}
        </Text>
        <Text style={styles.body}>{COMPONENTS.manualBody}</Text>

        <Text style={styles.subHeading}>
          {COMPONENTS.fallbackNumber} {COMPONENTS.fallbackHeading}
        </Text>
        <Text style={styles.body}>{COMPONENTS.fallbackBody}</Text>

        <Text style={styles.subHeading}>
          {COMPONENTS.alarmNumber} {COMPONENTS.alarmHeading}
        </Text>
        <View style={styles.alarmGrid}>
          {COMPONENTS.alarms.map((a) => (
            <View key={a.label} style={styles.alarmChip}>
              <Text style={styles.alarmChipText}>{a.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.callout}>
          <Text style={styles.calloutLabel}>{COMPONENTS.overTempLabel}</Text>
          <Text style={styles.calloutBody}>{COMPONENTS.overTempBody}</Text>
        </View>

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
            {completed ? "MODULE COMPLETE" : "MARK MODULE COMPLETE"}
          </Text>
        </Pressable>

        <View style={styles.navRow}>
          <Pressable
            onPress={() => router.push("/training/orientation" as any)}
            android_ripple={{ color: "#E2E2E8" }}
            style={({ pressed }) => [
              styles.navBtnGhost,
              pressed && styles.navBtnPressed,
            ]}
          >
            <ArrowLeft2 size={16} color="#222" variant="Linear" />
            <Text style={styles.navBtnGhostText}>ORIENTATION</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/training/procedures" as any)}
            android_ripple={{ color: "#2A5BFF" }}
            style={({ pressed }) => [
              styles.navBtnSolid,
              pressed && styles.navBtnPressed,
            ]}
          >
            <Text style={styles.navBtnSolidText}>PROCEDURES</Text>
            <ArrowRight2 size={16} color="#FFFFFF" variant="Linear" />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F4F8" },
  scroll: { flex: 1, paddingTop: 48 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },

  pageTitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: "#1A1A1A",
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  intro: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: "#3D3D3D",
    lineHeight: 23,
    letterSpacing: -0.2,
  },
  assemblyBtn: {
    marginTop: 20,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#0749FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  assemblyBtnPressed: {
    backgroundColor: "#0640DB",
    transform: [{ scale: 0.99 }],
  },
  assemblyBtnText: {
    fontSize: 14,
    fontFamily: fontFamily.semibold,
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  sectionHeading: {
    marginTop: 30,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: "#1A1A1A",
    letterSpacing: -0.3,
  },
  card: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  photo: {
    height: 150,
    margin: 12,
    marginBottom: 0,
    borderRadius: 12,
    backgroundColor: "#ECECEF",
    alignItems: "center",
    justifyContent: "center",
  },
  photoLabel: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: "#9A9AA0",
    letterSpacing: 1,
  },
  cardBody: { padding: 16, gap: 8 },
  cardTitle: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: "#1A1A1A",
    letterSpacing: -0.3,
  },
  cardDesc: {
    fontSize: 13.5,
    fontFamily: fontFamily.regular,
    color: "#6B6B6B",
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  locateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 16,
  },
  locateText: {
    fontSize: 15,
    fontFamily: fontFamily.semibold,
    color: "#0749FF",
    letterSpacing: -0.2,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E2E8",
    marginTop: 24,
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: "#3D3D3D",
    lineHeight: 23,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  subHeading: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: "#1A1A1A",
    letterSpacing: -0.2,
  },
  loopBox: {
    marginTop: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  loopLabel: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: "#9A9AA0",
    letterSpacing: 1,
    marginBottom: 14,
  },
  loopStep: {
    height: 50,
    borderRadius: 12,
    backgroundColor: "#1B2B3F",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  loopStepText: {
    fontSize: 14,
    fontFamily: fontFamily.semibold,
    color: "#FFFFFF",
    letterSpacing: -0.2,
    textAlign: "center",
  },
  loopArrow: {
    textAlign: "center",
    fontSize: 16,
    color: "#0749FF",
    paddingVertical: 6,
  },
  loopDashed: {
    height: 1,
    marginTop: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: "#C9A88E",
  },
  loopFeedback: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    color: "#6B6B6B",
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  alarmGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 4 },
  alarmChip: {
    width: "47%",
    minHeight: 56,
    flexGrow: 1,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  alarmChipText: {
    fontSize: 13.5,
    fontFamily: fontFamily.medium,
    color: "#1A1A1A",
    letterSpacing: -0.2,
    lineHeight: 19,
  },
  callout: {
    marginTop: 28,
  },
  calloutLabel: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: "#1A1A1A",
    letterSpacing: 1,
    marginBottom: 8,
  },
  calloutBody: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: "#3D3D3D",
    lineHeight: 21,
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
  navRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  navBtnGhost: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#ecececff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  navBtnGhostText: {
    fontSize: 14,
    fontFamily: fontFamily.semibold,
    color: "#1A1A1A",
    letterSpacing: -0.2,
  },
  navBtnSolid: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#2A5BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  navBtnSolidText: {
    fontSize: 14,
    fontFamily: fontFamily.semibold,
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  navBtnPressed: { transform: [{ scale: 0.99 }] },
});
