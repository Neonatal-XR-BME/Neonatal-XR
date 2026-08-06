// import CircuitSchematicViewer from "@/components/circuit-schematic-viewer";
// import { fontFamily } from "@/constants/fontFamily";
// import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
// import { router } from "expo-router";
// import { ArrowLeft2 } from "iconsax-react-nativejs";
// import React from "react";
// import {
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// // Was the Cardboard VR "Electrical" scene (ViroVRSceneNavigator +
// // ElectricalVRRoomScene, gaze/click on the Noosi robot). Replaced with a
// // flat, pinch/pan schematic viewer per the actual circuit_image.svg export
// // -- same "tap a part, see an annotation" idea as the VR/AR warmer scenes,
// // just for the electrical side and without needing a headset. The old
// // Cardboard scene component (electrical-vr-room-scene.tsx) is unused now
// // but left in place in case you want it back for something else.

// function GlassBackButton() {
//   if (Platform.OS === "ios" && isLiquidGlassAvailable()) {
//     return (
//       <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
//         <GlassView style={styles.glassButton} colorScheme="dark">
//           <ArrowLeft2 size={20} color="#110303" />
//         </GlassView>
//       </TouchableOpacity>
//     );
//   }

//   return (
//     <TouchableOpacity
//       style={styles.fallbackButton}
//       onPress={() => router.back()}
//     >
//       <ArrowLeft2 size={20} color="#fff" />
//       <Text style={styles.fallbackButtonText}>Back</Text>
//     </TouchableOpacity>
//   );
// }

// export default function ElectricalSchematicScreen() {
//   return (
//     <View style={{ flex: 1 }}>
//       <CircuitSchematicViewer />

//       <View style={styles.topOverlay}>
//         <GlassBackButton />
//         <View style={styles.titleBox}>
//           <Text style={styles.titleText}>Electrical Layout</Text>
//           <Text style={styles.subtitleText}>
//             Pinch to zoom, drag to pan, tap a part for details
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   topOverlay: {
//     position: "absolute",
//     top: 60,
//     left: 20,
//     right: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   titleBox: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.45)",
//     borderRadius: 14,
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//   },
//   titleText: {
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "700",
//     fontFamily: fontFamily.semibold,
//   },
//   subtitleText: {
//     color: "rgba(255,255,255,0.75)",
//     fontSize: 11,
//     marginTop: 2,
//     fontFamily: fontFamily.regular,
//   },
//   glassButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 4,
//     width: 42,
//     height: 42,
//     paddingLeft: 8,
//     paddingRight: 12,
//     borderRadius: 100,
//   },
//   fallbackButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//     borderRadius: 22,
//   },
//   fallbackButtonText: {
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "600",
//   },
// });

import CircuitSchematicViewer from "@/components/circuit-schematic-viewer";
import TroubleshootSimulator from "@/components/troubleshoot-simulator";
import { fontFamily } from "@/constants/fontFamily";
import {
  FAULT_SCENARIOS,
  FaultScenario,
} from "@/constants/troubleshoot-scenarios";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { router } from "expo-router";
import { ArrowLeft2, Warning2 } from "iconsax-react-nativejs";
import React, { useCallback, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ElectricalSchematicScreen hosts the pinch/pan circuit-schematic viewer plus
// an optional troubleshooting simulation. The user can:
//   1. Browse the schematic normally (tap hotspots for descriptions).
//   2. Tap "Simulate Fault" to pick a fault scenario from a bottom sheet.
//   3. Work through the guided step-by-step simulation; the viewer highlights
//      the active component at each step.

type ScreenState =
  | { kind: "browse" }
  | { kind: "scenario_picker" }
  | { kind: "simulating"; scenario: FaultScenario; activeId: string | null };

function GlassBackButton() {
  if (Platform.OS === "ios" && isLiquidGlassAvailable()) {
    return (
      <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
        <GlassView style={styles.glassButton} colorScheme="dark">
          <ArrowLeft2 size={20} color="#110303" />
        </GlassView>
      </TouchableOpacity>
    );
  }

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

// Bottom sheet modal for picking a fault scenario.
function ScenarioPicker({
  visible,
  onSelect,
  onClose,
}: {
  visible: boolean;
  onSelect: (s: FaultScenario) => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.pickerBackdrop} onPress={onClose} />
      <View style={styles.pickerSheet}>
        <View style={styles.pickerHandle} />
        <Text style={styles.pickerTitle}>Choose a Fault Scenario</Text>
        <Text style={styles.pickerSubtitle}>
          Walk through a step-by-step simulation to diagnose the fault on the
          circuit schematic.
        </Text>
        <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
          {FAULT_SCENARIOS.map((scenario) => (
            <Pressable
              key={scenario.id}
              style={styles.scenarioCard}
              onPress={() => onSelect(scenario)}
            >
              <View style={styles.scenarioIconBox}>
                <Warning2 size={20} color="#F59E0B" variant="Bold" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.scenarioCardTitle}>{scenario.symptom}</Text>
                <Text style={styles.scenarioCardMeta}>
                  {scenario.steps.length} steps ·{" "}
                  {scenario.affectedComponents.length} components
                </Text>
              </View>
              <Text style={styles.scenarioArrow}>›</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function ElectricalSchematicScreen() {
  const [screen, setScreen] = useState<ScreenState>({ kind: "browse" });

  // Called by TroubleshootSimulator whenever the active component changes.
  const handleActiveComponent = useCallback((id: string | null) => {
    setScreen((prev) => {
      if (prev.kind !== "simulating") return prev;
      return { ...prev, activeId: id };
    });
  }, []);

  const startScenario = useCallback((scenario: FaultScenario) => {
    setScreen({
      kind: "simulating",
      scenario,
      activeId: scenario.steps[0]?.componentId ?? null,
    });
  }, []);

  const exitSim = useCallback(() => {
    setScreen({ kind: "browse" });
  }, []);

  const isSimulating = screen.kind === "simulating";

  // Derive what to pass to the schematic viewer.
  const activeComponentId =
    screen.kind === "simulating" ? screen.activeId : null;
  const faultedComponents =
    screen.kind === "simulating" ? screen.scenario.affectedComponents : [];

  return (
    <View style={{ flex: 1 }}>
      {/* The schematic viewer always renders underneath. */}
      <CircuitSchematicViewer
        activeComponentId={activeComponentId}
        faultedComponents={faultedComponents}
        onStartScenario={startScenario}
      />

      {/* Top overlay: back button + title + simulate-fault button */}
      <View style={styles.topOverlay}>
        <GlassBackButton />
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>
            {isSimulating ? "Fault Simulation" : "Electrical Layout"}
          </Text>
          <Text style={styles.subtitleText}>
            {isSimulating
              ? screen.scenario.symptom
              : "Pinch to zoom, drag to pan, tap a part for details"}
          </Text>
        </View>
      </View>

      {/* Floating Simulate button, anchored to the bottom */}
      {!isSimulating && (
        <TouchableOpacity
          style={styles.simButton}
          activeOpacity={0.82}
          onPress={() => setScreen({ kind: "scenario_picker" })}
        >
          <Warning2 size={18} color="#fff" variant="Bold" />
          <Text style={styles.simButtonText}>Simulate Fault</Text>
        </TouchableOpacity>
      )}

      {/* Scenario picker modal */}
      <ScenarioPicker
        visible={screen.kind === "scenario_picker"}
        onSelect={startScenario}
        onClose={() => setScreen({ kind: "browse" })}
      />

      {/* Sim panel — bottom sheet overlay */}
      {screen.kind === "simulating" && (
        <TroubleshootSimulator
          scenario={screen.scenario}
          onActiveComponent={handleActiveComponent}
          onClose={exitSim}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topOverlay: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  titleBox: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  titleText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: fontFamily.semibold,
  },
  subtitleText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
    marginTop: 2,
    fontFamily: fontFamily.regular,
  },
  glassButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    width: 42,
    height: 42,
    paddingLeft: 8,
    paddingRight: 12,
    borderRadius: 100,
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
  simButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F59E0B",
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  simButtonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: fontFamily.semibold,
  },
  // Scenario picker modal
  pickerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pickerSheet: {
    backgroundColor: "#111",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    maxHeight: "60%",
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  pickerHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  pickerTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fontFamily.semibold,
    marginBottom: 6,
  },
  pickerSubtitle: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    fontFamily: fontFamily.regular,
    lineHeight: 19,
    marginBottom: 20,
  },
  scenarioCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  scenarioIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(245,158,11,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  scenarioCardTitle: {
    color: "#fff",
    fontSize: 15,
    fontFamily: fontFamily.semibold,
  },
  scenarioCardMeta: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    fontFamily: fontFamily.regular,
    marginTop: 2,
  },
  scenarioArrow: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 22,
  },
});
