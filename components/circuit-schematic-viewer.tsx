// import CircuitDiagram from "@/assets/images/circuit_image.svg";
// import {
//   CIRCUIT_COMPONENTS,
//   CircuitComponent,
//   SVG_VIEWBOX,
// } from "@/constants/circuit-components";
// import React, { useState } from "react";
// import { Dimensions, Pressable, StyleSheet, View } from "react-native";
// import {
//   Gesture,
//   GestureDetector,
//   GestureHandlerRootView,
// } from "react-native-gesture-handler";
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated";

// // Pinch/pan viewer for the electrical schematic, replacing the old Cardboard
// // VR "Electrical" scene. The SVG (assets/schematics/circuit-diagram.svg) is
// // rendered once at its native viewBox size -- 4094.52 x 2517.5 "SVG units"
// // -- inside an Animated.View. Pinch and pan just update that one view's
// // transform, so the SVG and the hotspot overlay always move together
// // without any per-frame coordinate recalculation.
// //
// // Hotspots are plain RN Pressables positioned with CIRCUIT_COMPONENTS'
// // bounding boxes, converted from SVG-space to pixel offsets once (not
// // animated themselves -- they inherit the parent's transform). Regular RN
// // touch hit-testing on those Pressables works fine even though the parent
// // is visually transformed.

// const MIN_SCALE = 0.15;
// const MAX_SCALE = 4;

// export default function CircuitSchematicViewer() {
//   const [selected, setSelected] = useState<CircuitComponent | null>(null);

//   const screen = Dimensions.get("window");
//   // Fit the whole schematic to the screen width on first render.
//   const initialScale = Math.min(
//     (screen.width * 0.92) / SVG_VIEWBOX.width,
//     (screen.height * 0.7) / SVG_VIEWBOX.height
//   );

//   const scale = useSharedValue(initialScale);
//   const savedScale = useSharedValue(initialScale);
//   const translateX = useSharedValue(
//     (screen.width - SVG_VIEWBOX.width * initialScale) / 2
//   );
//   const translateY = useSharedValue(
//     (screen.height - SVG_VIEWBOX.height * initialScale) / 2
//   );
//   const savedX = useSharedValue(translateX.value);
//   const savedY = useSharedValue(translateY.value);

//   const handleSelect = (component: CircuitComponent) => {
//     setSelected((prev) => (prev?.id === component.id ? null : component));
//   };

//   const pinchGesture = Gesture.Pinch()
//     .onStart(() => {
//       savedScale.value = scale.value;
//     })
//     .onUpdate((e) => {
//       const next = savedScale.value * e.scale;
//       scale.value = Math.min(Math.max(next, MIN_SCALE), MAX_SCALE);
//     });

//   // minDistance keeps a quick tap from being swallowed as a pan, so the
//   // hotspot Pressables underneath still get their onPress.
//   const panGesture = Gesture.Pan()
//     .minDistance(10)
//     .onStart(() => {
//       savedX.value = translateX.value;
//       savedY.value = translateY.value;
//     })
//     .onUpdate((e) => {
//       translateX.value = savedX.value + e.translationX;
//       translateY.value = savedY.value + e.translationY;
//     });

//   const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

//   const resetView = () => {
//     scale.value = withTiming(initialScale);
//     translateX.value = withTiming(
//       (screen.width - SVG_VIEWBOX.width * initialScale) / 2
//     );
//     translateY.value = withTiming(
//       (screen.height - SVG_VIEWBOX.height * initialScale) / 2
//     );
//   };

//   const animatedStyle = useAnimatedStyle(() => ({
//     // transformOrigin pins scaling to the top-left corner instead of RN's
//     // default center pivot. Without this, translateX/Y below (which assume
//     // a top-left pivot) and the actual center-based scale fight each other
//     // -- with a content box this much bigger than the screen, that mismatch
//     // throws the whole SVG far outside the viewport, which is exactly the
//     // "blank/blue, nothing tappable" symptom.
//     transformOrigin: "0 0",
//     transform: [
//       { translateX: translateX.value },
//       { translateY: translateY.value },
//       { scale: scale.value },
//     ],
//   }));

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <View style={styles.container}>
//         <GestureDetector gesture={composedGesture}>
//           <Animated.View
//             style={[
//               {
//                 position: "absolute",
//                 left: 0,
//                 top: 0,
//                 width: SVG_VIEWBOX.width,
//                 height: SVG_VIEWBOX.height,
//               },
//               animatedStyle,
//             ]}
//           >
//             <CircuitDiagram
//               width={SVG_VIEWBOX.width}
//               height={SVG_VIEWBOX.height}
//             />

//             {CIRCUIT_COMPONENTS.map((component) => {
//               const { hotspot } = component;
//               const isSelected = selected?.id === component.id;
//               return (
//                 <Pressable
//                   key={component.id}
//                   onPress={() => handleSelect(component)}
//                   hitSlop={4}
//                   style={[
//                     styles.hotspot,
//                     isSelected && styles.hotspotActive,
//                     {
//                       left: hotspot.x - SVG_VIEWBOX.minX,
//                       top: hotspot.y - SVG_VIEWBOX.minY,
//                       width: hotspot.width,
//                       height: hotspot.height,
//                     },
//                   ]}
//                 />
//               );
//             })}
//           </Animated.View>
//         </GestureDetector>

//         <Pressable style={styles.resetButton} onPress={resetView}>
//           <View style={styles.resetDot} />
//         </Pressable>

//         {selected && (
//           <View style={styles.tooltipCard}>
//             <View style={styles.tooltipHeader}>
//               <Animated.Text style={styles.tooltipTitle}>
//                 {selected.label}
//               </Animated.Text>
//               <Pressable onPress={() => setSelected(null)}>
//                 <Animated.Text style={styles.closeText}>×</Animated.Text>
//               </Pressable>
//             </View>
//             <Animated.Text style={styles.tooltipBody}>
//               {selected.description}
//             </Animated.Text>
//           </View>
//         )}
//       </View>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "hsl(0, 0%, 97%)",
//     overflow: "hidden",
//   },
//   hotspot: {
//     position: "absolute",
//     borderRadius: 12,
//     // Fully transparent in normal use -- flip borderWidth/backgroundColor on
//     // below while tuning hotspot positions against the artwork, then flip
//     // back off.
//     backgroundColor: "transparent",
//   },
//   hotspotActive: {
//     backgroundColor: "rgba(7,73,255,0.18)",
//     borderWidth: 2,
//     borderColor: "#0749FF",
//   },
//   resetButton: {
//     position: "absolute",
//     bottom: 40,
//     right: 20,
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.25)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   resetDot: {
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     borderWidth: 2,
//     borderColor: "#fff",
//   },
//   tooltipCard: {
//     position: "absolute",
//     bottom: 100,
//     left: 20,
//     right: 20,
//     backgroundColor: "rgba(0,0,0,0.82)",
//     borderRadius: 18,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.15)",
//   },
//   tooltipHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 6,
//   },
//   tooltipTitle: {
//     color: "#FFD60A",
//     fontSize: 16,
//     fontWeight: "700",
//   },
//   closeText: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "600",
//     paddingHorizontal: 6,
//   },
//   tooltipBody: {
//     color: "#fff",
//     fontSize: 13,
//     lineHeight: 19,
//   },
// });

import CircuitDiagram from "@/assets/images/circuit_image.svg";
import {
  CIRCUIT_COMPONENTS,
  CircuitComponent,
  SVG_VIEWBOX,
} from "@/constants/circuit-components";
import {
  FaultScenario,
  getScenariosForComponent,
} from "@/constants/troubleshoot-scenarios";
import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// Pinch/pan viewer for the electrical schematic, replacing the old Cardboard
// VR "Electrical" scene. The SVG (assets/schematics/circuit-diagram.svg) is
// rendered once at its native viewBox size -- 4094.52 x 2517.5 "SVG units"
// -- inside an Animated.View. Pinch and pan just update that one view's
// transform, so the SVG and the hotspot overlay always move together
// without any per-frame coordinate recalculation.
//
// Hotspots are plain RN Pressables positioned with CIRCUIT_COMPONENTS'
// bounding boxes, converted from SVG-space to pixel offsets once (not
// animated themselves -- they inherit the parent's transform). Regular RN
// touch hit-testing on those Pressables works fine even though the parent
// is visually transformed.
//
// Simulation mode (activeComponentId / faultedComponents props):
//   When a troubleshoot simulation is running, the viewer highlights the
//   currently investigated component in amber and dims everything not in the
//   fault path. Tapping a non-active hotspot is suppressed so the sim panel
//   stays in control.

const MIN_SCALE = 0.15;
const MAX_SCALE = 4;

type Props = {
  // The component currently under the spotlight in a fault simulation.
  // null means normal browse mode.
  activeComponentId?: string | null;
  // All component ids involved in the active fault scenario.
  // Components not in this list are visually dimmed during simulation.
  faultedComponents?: string[];
  // Called when the user taps a "Troubleshoot" link on a component's tooltip.
  // Lets the browse-mode schematic launch straight into a fault simulation.
  onStartScenario?: (scenario: FaultScenario) => void;
};

export default function CircuitSchematicViewer({
  activeComponentId = null,
  faultedComponents = [],
  onStartScenario,
}: Props) {
  const [selected, setSelected] = useState<CircuitComponent | null>(null);

  const isSimMode = activeComponentId !== null;

  // When simulation mode exits (activeComponentId returns to null), clear any
  // manual selection so the tooltip doesn't linger.
  useEffect(() => {
    if (!isSimMode) setSelected(null);
  }, [isSimMode]);

  const screen = Dimensions.get("window");
  const initialScale = Math.min(
    (screen.width * 0.92) / SVG_VIEWBOX.width,
    (screen.height * 0.7) / SVG_VIEWBOX.height
  );

  const scale = useSharedValue(initialScale);
  const savedScale = useSharedValue(initialScale);
  const translateX = useSharedValue(
    (screen.width - SVG_VIEWBOX.width * initialScale) / 2
  );
  const translateY = useSharedValue(
    (screen.height - SVG_VIEWBOX.height * initialScale) / 2
  );
  const savedX = useSharedValue(translateX.value);
  const savedY = useSharedValue(translateY.value);

  const handleSelect = (component: CircuitComponent) => {
    // In sim mode, tapping any hotspot is a no-op; the sim panel owns focus.
    if (isSimMode) return;
    setSelected((prev) => (prev?.id === component.id ? null : component));
  };

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      const next = savedScale.value * e.scale;
      scale.value = Math.min(Math.max(next, MIN_SCALE), MAX_SCALE);
    });

  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onStart(() => {
      savedX.value = translateX.value;
      savedY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = savedX.value + e.translationX;
      translateY.value = savedY.value + e.translationY;
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const resetView = () => {
    scale.value = withTiming(initialScale);
    translateX.value = withTiming(
      (screen.width - SVG_VIEWBOX.width * initialScale) / 2
    );
    translateY.value = withTiming(
      (screen.height - SVG_VIEWBOX.height * initialScale) / 2
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    // transformOrigin pins scaling to the top-left corner instead of RN's
    // default center pivot. Without this, translateX/Y below (which assume
    // a top-left pivot) and the actual center-based scale fight each other
    // -- with a content box this much bigger than the screen, that mismatch
    // throws the whole SVG far outside the viewport.
    transformOrigin: "0 0",
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // Derive hotspot visual state for a given component.
  const getHotspotStyle = (id: string) => {
    if (!isSimMode) {
      // Normal browse mode: only highlight the tapped component.
      return selected?.id === id ? styles.hotspotSelected : null;
    }
    if (id === activeComponentId) return styles.hotspotActive;
    if (faultedComponents.includes(id)) return styles.hotspotFault;
    return styles.hotspotDimmed;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <GestureDetector gesture={composedGesture}>
          <Animated.View
            style={[
              {
                position: "absolute",
                left: 0,
                top: 0,
                width: SVG_VIEWBOX.width,
                height: SVG_VIEWBOX.height,
              },
              animatedStyle,
            ]}
          >
            <CircuitDiagram
              width={SVG_VIEWBOX.width}
              height={SVG_VIEWBOX.height}
            />

            {CIRCUIT_COMPONENTS.map((component) => {
              const { hotspot } = component;
              const hotspotStyle = getHotspotStyle(component.id);

              return (
                <Pressable
                  key={component.id}
                  onPress={() => handleSelect(component)}
                  hitSlop={4}
                  style={[
                    styles.hotspot,
                    hotspotStyle,
                    {
                      left: hotspot.x - SVG_VIEWBOX.minX,
                      top: hotspot.y - SVG_VIEWBOX.minY,
                      width: hotspot.width,
                      height: hotspot.height,
                    },
                  ]}
                />
              );
            })}
          </Animated.View>
        </GestureDetector>

        <Pressable style={styles.resetButton} onPress={resetView}>
          <View style={styles.resetDot} />
        </Pressable>

        {/* Tooltip only shown in browse (non-sim) mode */}
        {!isSimMode && selected && (
          <View style={styles.tooltipCard}>
            <View style={styles.tooltipHeader}>
              <Animated.Text style={styles.tooltipTitle}>
                {selected.label}
              </Animated.Text>
              <Pressable onPress={() => setSelected(null)}>
                <Animated.Text style={styles.closeText}>×</Animated.Text>
              </Pressable>
            </View>
            <Animated.Text style={styles.tooltipBody}>
              {selected.description}
            </Animated.Text>

            {/* Troubleshoot links -- any fault scenario involving this part */}
            {onStartScenario &&
              (() => {
                const scenarios = getScenariosForComponent(selected.id);
                if (scenarios.length === 0) return null;
                return (
                  <View style={styles.troubleshootSection}>
                    <Text style={styles.troubleshootLabel}>
                      TROUBLESHOOT THIS PART
                    </Text>
                    {scenarios.map((scenario) => (
                      <Pressable
                        key={scenario.id}
                        style={styles.scenarioLink}
                        onPress={() => onStartScenario(scenario)}
                      >
                        <View style={styles.scenarioLinkDot} />
                        <Text style={styles.scenarioLinkText}>
                          {scenario.symptom}
                        </Text>
                        <Text style={styles.scenarioLinkArrow}>›</Text>
                      </Pressable>
                    ))}
                  </View>
                );
              })()}
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "hsl(0, 0%, 97%)",
    overflow: "hidden",
  },
  hotspot: {
    position: "absolute",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  // Normal browse: tapped component.
  hotspotSelected: {
    backgroundColor: "rgba(7,73,255,0.18)",
    borderWidth: 2,
    borderColor: "#0749FF",
  },
  // Sim mode: the component under investigation right now.
  hotspotActive: {
    backgroundColor: "rgba(245,158,11,0.22)",
    borderWidth: 2.5,
    borderColor: "#F59E0B",
  },
  // Sim mode: in the fault path but not the current step.
  hotspotFault: {
    backgroundColor: "rgba(220,38,38,0.08)",
    borderWidth: 1,
    borderColor: "rgba(220,38,38,0.35)",
    borderStyle: "dashed",
  },
  // Sim mode: not involved in this fault.
  hotspotDimmed: {
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  resetButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  resetDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#fff",
  },
  tooltipCard: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.82)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  tooltipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  tooltipTitle: {
    color: "#FFD60A",
    fontSize: 16,
    fontWeight: "700",
  },
  closeText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    paddingHorizontal: 6,
  },
  tooltipBody: {
    color: "#fff",
    fontSize: 13,
    lineHeight: 19,
  },
  troubleshootSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
  },
  troubleshootLabel: {
    color: "rgba(245,158,11,0.9)",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  scenarioLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(245,158,11,0.12)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.30)",
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  scenarioLinkDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#F59E0B",
  },
  scenarioLinkText: {
    flex: 1,
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  scenarioLinkArrow: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 20,
    fontWeight: "400",
  },
});
