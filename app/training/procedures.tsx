import { fontFamily } from "@/constants/fontFamily";
import { PROCEDURES } from "@/constants/procedures-content";
import { useRouter } from "expo-router";
import { ArrowLeft, ArrowRight, TickCircle } from "iconsax-react-nativejs";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function MaintenanceRow({ text }: { text: string }) {
  return (
    <View style={styles.itemRow}>
      <TickCircle size={20} color="#0AC084" variant="Bold" />
      <Text style={styles.itemText}>{text}</Text>
    </View>
  );
}

export default function Procedures() {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>
          {PROCEDURES.number}. {PROCEDURES.title}
        </Text>
        <Text style={styles.intro}>{PROCEDURES.intro}</Text>

        <View style={styles.callout}>
          <Text style={styles.calloutLabel}>{PROCEDURES.calloutLabel}</Text>
          <Text style={styles.calloutBody}>{PROCEDURES.calloutBody}</Text>
        </View>

        <Text style={styles.sectionHeading}>
          {PROCEDURES.maintenanceNumber} {PROCEDURES.maintenanceHeading}
        </Text>

        {PROCEDURES.groups.map((group) => (
          <View key={group.heading} style={styles.group}>
            <View style={styles.groupHeadRow}>
              <Text style={styles.groupHeading}>{group.heading}</Text>
            </View>
            <View style={styles.itemsCard}>
              {group.items.map((item) => (
                <MaintenanceRow key={item.text} text={item.text} />
              ))}
            </View>
          </View>
        ))}

        <View style={styles.safetyCallout}>
          <Text style={styles.safetyLabel}>{PROCEDURES.safetyLabel}</Text>
          <Text style={styles.safetyBody}>{PROCEDURES.safetyBody}</Text>
        </View>

        <Text style={styles.sectionHeading}>
          {PROCEDURES.troubleshootingNumber} {PROCEDURES.troubleshootingHeading}
        </Text>
        <Text style={styles.body}>{PROCEDURES.troubleshootingIntro}</Text>

        {PROCEDURES.faults.map((fault) => (
          <View key={fault.symptom} style={styles.faultCard}>
            <Text style={styles.faultSymptom}>{fault.symptom}</Text>
            <Text style={styles.faultCausesLabel}>POSSIBLE CAUSES</Text>
            {fault.causes.map((cause) => (
              <View key={cause} style={styles.causeRow}>
                <Text style={styles.causeDot}>•</Text>
                <Text style={styles.causeText}>{cause}</Text>
              </View>
            ))}
          </View>
        ))}

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
            onPress={() => router.push("/training/components" as any)}
            android_ripple={{ color: "#E2E2E8" }}
            style={({ pressed }) => [
              styles.navBtnGhost,
              pressed && styles.navBtnPressed,
            ]}
          >
            <ArrowLeft size={16} color="#1A1A1A" variant="Linear" />
            <Text style={styles.navBtnGhostText}>Components</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/training/faults" as any)}
            android_ripple={{ color: "#2A5BFF" }}
            style={({ pressed }) => [
              styles.navBtnSolid,
              pressed && styles.navBtnPressed,
            ]}
          >
            <Text style={styles.navBtnSolidText}>Knowledge Check</Text>
            <ArrowRight size={16} color="#FFFFFF" variant="Linear" />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F4F8" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  moduleLabel: {
    fontSize: 12,
    fontFamily: fontFamily.bold,
    color: "#0749FF",
    letterSpacing: 1,
    marginBottom: 8,
  },
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
  callout: {
    marginTop: 18,
  },
  calloutLabel: {
    fontSize: 14,
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
  sectionHeading: {
    marginTop: 32,
    marginBottom: 24,
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: "#1A1A1A",
    letterSpacing: -0.3,
  },
  group: { marginBottom: 24 },
  groupHeadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 12,
  },
  groupHeading: {
    fontSize: 15,
    fontFamily: fontFamily.bold,
    color: "#1A1A1A",
    letterSpacing: -0.2,
    textTransform: "uppercase",
  },
  itemsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 13.5,
    fontFamily: fontFamily.regular,
    color: "#3D3D3D",
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  safetyCallout: {},
  safetyLabel: {
    fontSize: 14,
    fontFamily: fontFamily.bold,
    color: "#C0392B",
    letterSpacing: 1,
    marginBottom: 8,
  },
  safetyBody: {
    fontSize: 13.5,
    fontFamily: fontFamily.regular,
    color: "#9f1300ff",
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: "#3D3D3D",
    lineHeight: 23,
    letterSpacing: -0.2,
    marginBottom: 8,
  },
  faultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  faultSymptom: {
    fontSize: 15,
    fontFamily: fontFamily.bold,
    color: "#1A1A1A",
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  faultCausesLabel: {
    fontSize: 11,
    fontFamily: fontFamily.bold,
    color: "#9A9AA0",
    letterSpacing: 1,
    marginBottom: 8,
  },
  causeRow: { flexDirection: "row", marginBottom: 4 },
  causeDot: {
    fontSize: 14,
    color: "#0749FF",
    width: 14,
    lineHeight: 20,
  },
  causeText: {
    flex: 1,
    fontSize: 13.5,
    fontFamily: fontFamily.regular,
    color: "#3D3D3D",
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  completeBtn: {
    marginTop: 22,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#0749FF",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  completeBtnActive: { backgroundColor: "#E8F0FF" },
  completeBtnPressed: { transform: [{ scale: 0.99 }] },
  completeBtnText: {
    fontSize: 14,
    fontFamily: fontFamily.semibold,
    color: "#0749FF",
    letterSpacing: 0.2,
  },
  completeBtnTextActive: { color: "#0749FF" },
  navRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  navBtnGhost: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#1B2B3F",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  navBtnSolidText: {
    fontSize: 13,
    fontFamily: fontFamily.semibold,
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  navBtnPressed: { transform: [{ scale: 0.99 }] },
});
