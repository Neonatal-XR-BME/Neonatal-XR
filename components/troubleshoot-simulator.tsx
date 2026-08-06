// TroubleshootSimulator — step-by-step fault simulation panel.
//
// Designed to sit over the CircuitSchematicViewer in electricVr.tsx.
// The parent passes a scenario and a callback to highlight the active
// component on the schematic. The panel itself handles the step
// progression, findings reveal, and the final resolved card.

import { fontFamily } from "@/constants/fontFamily";
import { FaultScenario, SimStep } from "@/constants/troubleshoot-scenarios";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type SimulatorState = "intro" | "stepping" | "resolved";

type Props = {
  scenario: FaultScenario;
  onActiveComponent: (id: string | null) => void;
  onClose: () => void;
};

// Color tokens kept local so this component has no dependency on theme.ts.
// Light theme: white surfaces with dark text, matching the schematic's own
// light background so the sheet reads as part of the same surface.
const C = {
  blue: "#0749FF",
  blueSoft: "#DEE6FE",
  amber: "#F59E0B",
  amberSoft: "#FEF3C7",
  green: "#00A651",
  greenSoft: "#D1FAE5",
  red: "#DC2626",
  redSoft: "#FEE2E2",
  surface: "#FFFFFF",
  surfaceElevated: "#F5F6FA",
  border: "rgba(0,0,0,0.08)",
  textPrimary: "#111120",
  textSecondary: "rgba(17,17,32,0.68)",
  textMuted: "rgba(17,17,32,0.42)",
  badge: "rgba(7,73,255,0.05)",
};

function StepBadge({
  step,
  total,
  done,
}: {
  step: number;
  total: number;
  done: boolean;
}) {
  return (
    <View
      style={[
        styles.stepBadge,
        done ? { backgroundColor: C.green } : { backgroundColor: C.blue },
      ]}
    >
      <Text style={styles.stepBadgeText}>
        {done ? "✓" : `${step}/${total}`}
      </Text>
    </View>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total === 0 ? 0 : (current / total) * 100;
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${pct}%` as any }]} />
    </View>
  );
}

export default function TroubleshootSimulator({
  scenario,
  onActiveComponent,
  onClose,
}: Props) {
  const [state, setState] = useState<SimulatorState>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [findingVisible, setFindingVisible] = useState(false);

  const totalSteps = scenario.steps.length;
  const currentStep: SimStep | undefined = scenario.steps[stepIndex];

  const startSim = useCallback(() => {
    setStepIndex(0);
    setFindingVisible(false);
    setState("stepping");
    onActiveComponent(scenario.steps[0]?.componentId ?? null);
  }, [scenario, onActiveComponent]);

  const revealFinding = useCallback(() => {
    setFindingVisible(true);
  }, []);

  const nextStep = useCallback(() => {
    const next = stepIndex + 1;
    if (next >= totalSteps) {
      setState("resolved");
      onActiveComponent(null);
    } else {
      setStepIndex(next);
      setFindingVisible(false);
      onActiveComponent(scenario.steps[next].componentId);
    }
  }, [stepIndex, totalSteps, scenario, onActiveComponent]);

  const reset = useCallback(() => {
    setState("intro");
    setStepIndex(0);
    setFindingVisible(false);
    onActiveComponent(null);
  }, [onActiveComponent]);

  // ── Intro card ────────────────────────────────────────────────────────────
  if (state === "intro") {
    return (
      <View style={styles.panel}>
        <View style={styles.grabber} />

        <View style={styles.headerRow}>
          <View style={styles.symptomBadge}>
            <View style={styles.badgeDot} />
            <Text style={styles.symptomBadgeText}>FAULT SIM</Text>
          </View>
          <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
            <Text style={styles.closeX}>×</Text>
          </Pressable>
        </View>

        <Text style={styles.scenarioTitle}>{scenario.symptom}</Text>
        <Text style={styles.overviewText}>{scenario.overview}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalSteps}</Text>
            <Text style={styles.statLabel}>Steps</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {scenario.affectedComponents.length}
            </Text>
            <Text style={styles.statLabel}>Components</Text>
          </View>
        </View>

        <Pressable style={styles.primaryBtn} onPress={startSim}>
          <Text style={styles.primaryBtnText}>Start Simulation</Text>
        </Pressable>
      </View>
    );
  }

  // ── Resolved card ─────────────────────────────────────────────────────────
  if (state === "resolved") {
    return (
      <View style={styles.panel}>
        <View style={styles.grabber} />

        <View style={styles.headerRow}>
          <View style={[styles.symptomBadge, { backgroundColor: C.green }]}>
            <Text style={styles.symptomBadgeText}>✓ RESOLVED</Text>
          </View>
          <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
            <Text style={styles.closeX}>×</Text>
          </Pressable>
        </View>

        <Text style={styles.scenarioTitle}>Fault Diagnosed</Text>

        <View style={[styles.resultBlock, { borderLeftColor: C.green }]}>
          <Text style={styles.findingLabel}>Root Cause</Text>
          <Text style={[styles.resultValue, { color: "#047850" }]}>
            {scenario.rootCause}
          </Text>
        </View>

        <View
          style={[
            styles.resultBlock,
            { borderLeftColor: C.amber, marginTop: 10 },
          ]}
        >
          <Text style={styles.findingLabel}>Corrective Action</Text>
          <Text style={[styles.resultValue, { color: "#B45309" }]}>
            {scenario.correctiveAction}
          </Text>
        </View>

        <Pressable style={styles.secondaryBtn} onPress={reset}>
          <Text style={styles.secondaryBtnText}>Restart Simulation</Text>
        </Pressable>
      </View>
    );
  }

  // ── Stepping ──────────────────────────────────────────────────────────────
  if (!currentStep) return null;

  return (
    <View style={styles.panel}>
      <View style={styles.grabber} />

      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.stepHeaderLeft}>
          <StepBadge step={stepIndex + 1} total={totalSteps} done={false} />
          <Text style={styles.stepCounter}>
            Step {stepIndex + 1} of {totalSteps}
          </Text>
        </View>
        <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
          <Text style={styles.closeX}>×</Text>
        </Pressable>
      </View>

      <ProgressBar current={stepIndex + 1} total={totalSteps} />

      <ScrollView
        style={{ flex: 1, marginTop: 4 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 12 }}
      >
        {/* Component spotlight */}
        <View style={styles.componentCard}>
          <Text style={styles.componentLabel}>INVESTIGATING</Text>
          <Text style={styles.componentName}>
            {currentStep.componentId
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}
          </Text>
        </View>

        {/* Action title */}
        <Text style={styles.stepActionTitle}>{currentStep.action}</Text>

        {/* Instruction */}
        <View style={styles.instructionCard}>
          <View style={styles.instructionHeader}>
            <View style={styles.instructionDot} />
            <Text style={styles.instructionLabel}>What to do</Text>
          </View>
          <Text style={styles.instructionText}>{currentStep.instruction}</Text>
        </View>

        {/* Expected */}
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Expected reading</Text>
          <Text style={styles.dataValue}>{currentStep.expected}</Text>
        </View>

        {/* Reveal finding */}
        {!findingVisible ? (
          <Pressable style={styles.revealBtn} onPress={revealFinding}>
            <Text style={styles.revealBtnText}>Reveal Finding</Text>
          </Pressable>
        ) : (
          <>
            <View style={[styles.resultBlock, { borderLeftColor: C.amber }]}>
              <Text style={styles.findingLabel}>Finding</Text>
              <Text style={[styles.resultValue, { color: "#B45309" }]}>
                {currentStep.finding}
              </Text>
            </View>

            <View
              style={[
                styles.resultBlock,
                { borderLeftColor: C.blue, marginTop: 8 },
              ]}
            >
              <Text style={styles.findingLabel}>Deduction</Text>
              <Text style={[styles.resultValue, { color: C.blue }]}>
                {currentStep.deduction}
              </Text>
            </View>

            <Pressable style={styles.primaryBtn} onPress={nextStep}>
              <Text style={styles.primaryBtnText}>
                {stepIndex + 1 >= totalSteps ? "View Diagnosis" : "Next Step →"}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 34,
    maxHeight: "66%",
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.12)",
    alignSelf: "center",
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  stepHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepCounter: {
    color: C.textSecondary,
    fontSize: 13,
    fontFamily: fontFamily.medium,
  },
  symptomBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.blue,
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  symptomBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: fontFamily.semibold,
    letterSpacing: 0.8,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeX: {
    color: C.textSecondary,
    fontSize: 22,
    fontWeight: "400",
    lineHeight: 24,
  },
  scenarioTitle: {
    color: C.textPrimary,
    fontSize: 22,
    fontFamily: fontFamily.semibold,
    marginBottom: 10,
    lineHeight: 28,
  },
  overviewText: {
    color: C.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: fontFamily.regular,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: C.badge,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    color: C.textPrimary,
    fontSize: 26,
    fontFamily: fontFamily.semibold,
  },
  statLabel: {
    color: C.textMuted,
    fontSize: 12,
    fontFamily: fontFamily.regular,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: C.border,
  },
  primaryBtn: {
    backgroundColor: C.blue,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 6,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: fontFamily.semibold,
  },
  secondaryBtn: {
    backgroundColor: C.surfaceElevated,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 16,
  },
  secondaryBtnText: {
    color: C.textSecondary,
    fontSize: 15,
    fontFamily: fontFamily.semibold,
  },
  stepBadge: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stepBadgeText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: fontFamily.semibold,
    letterSpacing: 0.4,
  },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 2,
    marginBottom: 18,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    backgroundColor: C.blue,
    borderRadius: 2,
  },
  componentCard: {
    backgroundColor: C.surfaceElevated,
    borderRadius: 14,
    borderWidth: 1,
    borderLeftWidth: 3,
    borderColor: C.border,
    borderLeftColor: "#FFD60A",
    padding: 14,
    marginBottom: 16,
  },
  componentLabel: {
    color: C.textMuted,
    fontSize: 10,
    fontFamily: fontFamily.semibold,
    letterSpacing: 1,
    marginBottom: 6,
  },
  componentName: {
    color: "#FFD60A",
    fontSize: 16,
    fontFamily: fontFamily.semibold,
    lineHeight: 22,
  },
  stepActionTitle: {
    color: C.textPrimary,
    fontSize: 18,
    fontFamily: fontFamily.semibold,
    marginBottom: 14,
    lineHeight: 24,
  },
  instructionCard: {
    backgroundColor: C.badge,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  instructionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 8,
  },
  instructionDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: C.blue,
  },
  instructionLabel: {
    color: C.textMuted,
    fontSize: 11,
    fontFamily: fontFamily.semibold,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  instructionText: {
    color: C.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: fontFamily.regular,
  },
  dataRow: {
    marginBottom: 14,
  },
  dataLabel: {
    color: C.textMuted,
    fontSize: 11,
    fontFamily: fontFamily.semibold,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  dataValue: {
    color: C.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: fontFamily.regular,
  },
  findingLabel: {
    color: C.textMuted,
    fontSize: 11,
    fontFamily: fontFamily.semibold,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  resultBlock: {
    backgroundColor: C.surfaceElevated,
    borderRadius: 14,
    borderWidth: 1,
    borderLeftWidth: 3,
    borderColor: C.border,
    padding: 14,
    marginBottom: 6,
  },
  resultValue: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: fontFamily.regular,
  },
  revealBtn: {
    borderWidth: 1.5,
    borderColor: C.blue,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  revealBtnText: {
    color: C.blue,
    fontSize: 15,
    fontFamily: fontFamily.semibold,
  },
});
