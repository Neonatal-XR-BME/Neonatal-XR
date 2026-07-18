// import InteractiveWarmerARScene from "@/components/interactive-warmer-arscene";
// import { fontFamily } from "@/constants/fontFamily";
// import { SceneKey, WARMER_SCENES, WarmerPart } from "@/constants/warmer-parts";
// import { ViroARSceneNavigator } from "@reactvision/react-viro";
// import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
// import { router } from "expo-router";
// import { ArrowLeft2, CloseCircle, Refresh } from "iconsax-react-nativejs";
// import React, { useMemo, useState } from "react";
// import {
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// // AR sibling of app/vrscene.tsx. Same overlay structure (back button, title
// // box, tooltip card, explode/assemble toggle, bottom scene tabs) driven by
// // the same sceneKey/selectedPart/exploded state -- the two additions are
// // markerFound (AR needs to know whether the physical marker is currently
// // tracked, since the tabs/explode toggle don't make sense until there's a
// // model on screen) and resetSignal (bumps InteractiveWarmerARScene back to
// // its default placement after a pinch/rotate).

// function GlassBackButton() {
//   // Liquid Glass only works on iOS 26+
//   if (Platform.OS === "ios" && isLiquidGlassAvailable()) {
//     return (
//       <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
//         <GlassView style={styles.glassButton}>
//           <ArrowLeft2 size={20} color="#fff" />
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

// export default function ARSceneScreen() {
//   const [sceneKey, setSceneKey] = useState<SceneKey>("overview");
//   const [selectedPart, setSelectedPart] = useState<WarmerPart | null>(null);
//   const [exploded, setExploded] = useState(false);
//   const [markerFound, setMarkerFound] = useState(false);
//   const [resetSignal, setResetSignal] = useState(0);
//   const [viewLocked, setViewLocked] = useState(false);

//   const navigateTo = (target: SceneKey) => {
//     setSelectedPart(null); // clear tooltip when switching scenes
//     if (target !== "overview") setExploded(false); // detail scenes are assembled
//     setSceneKey(target);
//   };

//   const viroAppProps = useMemo(
//     () => ({
//       sceneKey,
//       exploded,
//       selectedPartId: selectedPart?.id ?? null,
//       viewLocked,
//       onSelectPart: (part: WarmerPart) =>
//         setSelectedPart((prev: any) => (prev?.id === part.id ? null : part)),
//       onNavigate: navigateTo,
//       onMarkerFound: () => setMarkerFound(true),
//       onMarkerLost: () => setMarkerFound(false),
//       resetSignal,
//     }),
//     [sceneKey, exploded, selectedPart?.id, viewLocked, resetSignal]
//   );

//   const scene = WARMER_SCENES[sceneKey];
//   const isOverview = sceneKey === "overview";

//   return (
//     <View style={{ flex: 1 }}>
//       <ViroARSceneNavigator
//         initialScene={{ scene: InteractiveWarmerARScene as any }}
//         viroAppProps={viroAppProps}
//         style={{ flex: 1 }}
//         autofocus={true}
//         videoQuality="High"
//       />

//       {/* Top overlay: back button + scene title */}
//       <View style={styles.topOverlay}>
//         <GlassBackButton />
//         <View style={styles.titleBox}>
//           <Text style={styles.titleText}>{scene.title}</Text>
//           <Text style={styles.subtitleText}>
//             {!markerFound
//               ? "Point your camera at the marker to begin"
//               : isOverview && exploded
//               ? "Tap a part or label to explore it"
//               : scene.subtitle}
//           </Text>
//         </View>
//       </View>

//       {/* Scanning hint until the marker is tracked */}
//       {!markerFound && (
//         <View style={styles.scanHint}>
//           <Text style={styles.scanHintText}>Scanning for marker…</Text>
//         </View>
//       )}

//       {/* Tooltip card for the selected part */}
//       {selectedPart && (
//         <View style={styles.tooltipCard}>
//           <View style={styles.tooltipHeader}>
//             <Text style={styles.tooltipTitle}>{selectedPart.label}</Text>
//             <TouchableOpacity onPress={() => setSelectedPart(null)}>
//               <CloseCircle size={22} color="#fff" />
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.tooltipBody}>{selectedPart.description}</Text>
//         </View>
//       )}

//       {markerFound && (
//         <>
//           <TouchableOpacity
//             style={[styles.lockButton, viewLocked && styles.lockButtonActive]}
//             onPress={() => setViewLocked((locked) => !locked)}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.lockButtonText}>
//               {viewLocked ? "Unlock" : "Lock"}
//             </Text>
//           </TouchableOpacity>

//           {/* Reset placement (AR-only: pinch/rotate can throw the model off) */}
//           <TouchableOpacity
//             style={styles.resetButton}
//             onPress={() => {
//               setViewLocked(false);
//               setResetSignal((n) => n + 1);
//             }}
//             activeOpacity={0.8}
//           >
//             <Refresh size={16} color="#fff" />
//             <Text style={styles.resetButtonText}>Reset</Text>
//           </TouchableOpacity>

//           {/* Explode / Assemble toggle (overview only) */}
//           {isOverview && (
//             <TouchableOpacity
//               style={[
//                 styles.explodeButton,
//                 exploded && styles.explodeButtonActive,
//               ]}
//               onPress={() => setExploded((e) => !e)}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.explodeButtonText}>
//                 {exploded ? "Assemble" : "Explode"}
//               </Text>
//             </TouchableOpacity>
//           )}
//         </>
//       )}
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
//   scanHint: {
//     position: "absolute",
//     top: 130,
//     alignSelf: "center",
//     backgroundColor: "rgba(0,0,0,0.55)",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 18,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.2)",
//   },
//   scanHintText: {
//     color: "#fff",
//     fontSize: 12,
//     fontFamily: fontFamily.medium,
//   },
//   tooltipCard: {
//     position: "absolute",
//     bottom: 130,
//     left: 20,
//     right: 20,
//     backgroundColor: "rgba(0,0,0,0.78)",
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
//     fontFamily: fontFamily.semibold,
//   },
//   tooltipBody: {
//     color: "#fff",
//     fontSize: 13,
//     lineHeight: 19,
//     fontFamily: fontFamily.regular,
//   },
//   resetButton: {
//     position: "absolute",
//     bottom: 20,
//     left: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 22,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.2)",
//   },
//   resetButtonText: {
//     color: "#fff",
//     fontSize: 13,
//     fontWeight: "700",
//     fontFamily: fontFamily.semibold,
//   },
//   lockButton: {
//     position: "absolute",
//     bottom: 68,
//     left: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 22,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.2)",
//   },
//   lockButtonActive: {
//     backgroundColor: "#0749FF",
//     borderColor: "#0749FF",
//   },
//   lockButtonText: {
//     color: "#fff",
//     fontSize: 13,
//     fontWeight: "700",
//     fontFamily: fontFamily.semibold,
//   },
//   explodeButton: {
//     position: "absolute",
//     bottom: 20,
//     right: 20,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 22,
//     borderWidth: 1,
//     borderColor: "#0749FF",
//   },
//   explodeButtonActive: {
//     backgroundColor: "#0749FF",
//   },
//   explodeButtonText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "700",
//     fontFamily: fontFamily.semibold,
//   },
// });

import InteractiveWarmerARScene from "@/components/interactive-warmer-arscene";
import { fontFamily } from "@/constants/fontFamily";
import { SceneKey, WARMER_SCENES, WarmerPart } from "@/constants/warmer-parts";
import { useLiveParameters } from "@/hooks/use-live-parameters";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { router } from "expo-router";
import { ArrowLeft2, CloseCircle, Refresh } from "iconsax-react-nativejs";
import React, { useMemo, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function GlassBackButton() {
  if (Platform.OS === "ios" && isLiquidGlassAvailable()) {
    return (
      <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
        <GlassView style={styles.glassButton}>
          <ArrowLeft2 size={20} color="#fff" />
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

export default function ARSceneScreen() {
  const [sceneKey, setSceneKey] = useState<SceneKey>("overview");
  const [selectedPart, setSelectedPart] = useState<WarmerPart | null>(null);
  const [exploded, setExploded] = useState(false);
  const [markerFound, setMarkerFound] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [viewLocked, setViewLocked] = useState(false);

  // Fetch live parameters
  const { row } = useLiveParameters();

  const navigateTo = (target: SceneKey) => {
    setSelectedPart(null);
    if (target !== "overview") setExploded(false);
    setSceneKey(target);
  };

  const viroAppProps = useMemo(
    () => ({
      sceneKey,
      exploded,
      selectedPartId: selectedPart?.id ?? null,
      viewLocked,
      onSelectPart: (part: WarmerPart) =>
        setSelectedPart((prev: any) => (prev?.id === part.id ? null : part)),
      onNavigate: navigateTo,
      onMarkerFound: () => setMarkerFound(true),
      onMarkerLost: () => setMarkerFound(false),
      resetSignal,
    }),
    [sceneKey, exploded, selectedPart?.id, viewLocked, resetSignal]
  );

  const scene = WARMER_SCENES[sceneKey];
  const isOverview = sceneKey === "overview";

  return (
    <View style={{ flex: 1 }}>
      <ViroARSceneNavigator
        initialScene={{ scene: InteractiveWarmerARScene as any }}
        viroAppProps={viroAppProps}
        style={{ flex: 1 }}
        autofocus={true}
        videoQuality="High"
      />

      <View style={styles.topOverlay}>
        <GlassBackButton />
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>{scene.title}</Text>
          <Text style={styles.subtitleText}>
            {!markerFound
              ? "Point your camera at the marker to begin"
              : isOverview && exploded
              ? "Tap a part or label to explore it"
              : scene.subtitle}
          </Text>
        </View>
      </View>

      {!markerFound && (
        <View style={styles.scanHint}>
          <Text style={styles.scanHintText}>Scanning for marker…</Text>
        </View>
      )}

      {selectedPart && (
        <View style={styles.tooltipCard}>
          <View style={styles.tooltipHeader}>
            <Text style={styles.tooltipTitle}>{selectedPart.label}</Text>
            <TouchableOpacity onPress={() => setSelectedPart(null)}>
              <CloseCircle size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Conditionally render Live Params if control board is selected */}
          {selectedPart.id === "control_board" ? (
            <View style={{ marginTop: 4, gap: 4 }}>
              <Text style={styles.tooltipBody}>
                Core Temp:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {row?.core_temp ?? "--"} °C
                </Text>
              </Text>
              <Text style={styles.tooltipBody}>
                Ambient Temp:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {row?.ambient_temp ?? "--"} °C
                </Text>
              </Text>
              <Text style={styles.tooltipBody}>
                Humidity:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {row?.humidity ?? "--"} %
                </Text>
              </Text>
            </View>
          ) : (
            <Text style={styles.tooltipBody}>{selectedPart.description}</Text>
          )}
        </View>
      )}

      {markerFound && (
        <>
          <TouchableOpacity
            style={[styles.lockButton, viewLocked && styles.lockButtonActive]}
            onPress={() => setViewLocked((locked) => !locked)}
            activeOpacity={0.8}
          >
            <Text style={styles.lockButtonText}>
              {viewLocked ? "Unlock" : "Lock"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setViewLocked(false);
              setResetSignal((n) => n + 1);
            }}
            activeOpacity={0.8}
          >
            <Refresh size={16} color="#fff" />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>

          {isOverview && (
            <TouchableOpacity
              style={[
                styles.explodeButton,
                exploded && styles.explodeButtonActive,
              ]}
              onPress={() => setExploded((e) => !e)}
              activeOpacity={0.8}
            >
              <Text style={styles.explodeButtonText}>
                {exploded ? "Assemble" : "Explode"}
              </Text>
            </TouchableOpacity>
          )}
        </>
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
    gap: 12,
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
  scanHint: {
    position: "absolute",
    top: 130,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  scanHintText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: fontFamily.medium,
  },
  tooltipCard: {
    position: "absolute",
    bottom: 130,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.78)",
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
    fontFamily: fontFamily.semibold,
  },
  tooltipBody: {
    color: "#fff",
    fontSize: 13,
    lineHeight: 19,
    fontFamily: fontFamily.regular,
  },
  resetButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    fontFamily: fontFamily.semibold,
  },
  lockButton: {
    position: "absolute",
    bottom: 68,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  lockButtonActive: {
    backgroundColor: "#0749FF",
    borderColor: "#0749FF",
  },
  lockButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    fontFamily: fontFamily.semibold,
  },
  explodeButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#0749FF",
  },
  explodeButtonActive: {
    backgroundColor: "#0749FF",
  },
  explodeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: fontFamily.semibold,
  },
});
