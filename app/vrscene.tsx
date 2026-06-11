// import InteractiveWarmerScene from "@/components/interactive-warmer-scene";
// import { fontFamily } from "@/constants/fontFamily";
// import {
//   SCENE_ORDER,
//   SceneKey,
//   WARMER_SCENES,
//   WarmerPart,
// } from "@/constants/warmer-parts";
// import { ViroARSceneNavigator } from "@reactvision/react-viro";
// import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
// import { router } from "expo-router";
// import { ArrowLeft2, CloseCircle } from "iconsax-react-nativejs";
// import React, { useMemo, useState } from "react";
// import {
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

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

// const SCENE_LABELS: Record<SceneKey, string> = {
//   overview: "Overview",
//   heater: "Heater",
//   bassinet: "Bassinet",
//   controller: "Controller",
// };

// export default function VRSceneScreen() {
//   const [sceneKey, setSceneKey] = useState<SceneKey>("overview");
//   const [selectedPart, setSelectedPart] = useState<WarmerPart | null>(null);
//   const [exploded, setExploded] = useState(false);

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
//       onSelectPart: (part: WarmerPart) =>
//         setSelectedPart((prev: any) => (prev?.id === part.id ? null : part)),
//       onNavigate: navigateTo,
//     }),
//     [sceneKey, exploded, selectedPart?.id]
//   );

//   const scene = WARMER_SCENES[sceneKey];
//   const isOverview = sceneKey === "overview";

//   return (
//     <View style={{ flex: 1 }}>
//       <ViroARSceneNavigator
//         initialScene={{ scene: InteractiveWarmerScene as any }}
//         viroAppProps={viroAppProps}
//         style={{ flex: 1 }}
//       />

//       {/* Top overlay: back button + scene title */}
//       <View style={styles.topOverlay}>
//         <GlassBackButton />
//         <View style={styles.titleBox}>
//           <Text style={styles.titleText}>{scene.title}</Text>
//           <Text style={styles.subtitleText}>
//             {isOverview && exploded
//               ? "Tap a label or part to explore it"
//               : scene.subtitle}
//           </Text>
//         </View>
//       </View>

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

//       {/* Explode / Assemble toggle (overview only) */}
//       {isOverview && (
//         <TouchableOpacity
//           style={[styles.explodeButton, exploded && styles.explodeButtonActive]}
//           onPress={() => setExploded((e) => !e)}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.explodeButtonText}>
//             {exploded ? "Assemble" : "Explode"}
//           </Text>
//         </TouchableOpacity>
//       )}

//       {/* Bottom scene navigation */}
//       <View style={styles.bottomOverlay}>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.tabRow}
//         >
//           {SCENE_ORDER.map((key) => {
//             const active = key === sceneKey;
//             return (
//               <TouchableOpacity
//                 key={key}
//                 style={[styles.tab, active && styles.tabActive]}
//                 onPress={() => navigateTo(key)}
//                 activeOpacity={0.8}
//               >
//                 <Text style={[styles.tabText, active && styles.tabTextActive]}>
//                   {SCENE_LABELS[key]}
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </ScrollView>
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
//   explodeButton: {
//     position: "absolute",
//     bottom: 95,
//     right: 20,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 22,
//     borderWidth: 1,
//     borderColor: "#00A651",
//   },
//   explodeButtonActive: {
//     backgroundColor: "#00A651",
//   },
//   explodeButtonText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "700",
//     fontFamily: fontFamily.semibold,
//   },
//   bottomOverlay: {
//     position: "absolute",
//     bottom: 40,
//     left: 0,
//     right: 0,
//   },
//   tabRow: {
//     paddingHorizontal: 20,
//     gap: 10,
//   },
//   tab: {
//     backgroundColor: "rgba(0,0,0,0.5)",
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//     borderRadius: 22,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.2)",
//   },
//   tabActive: {
//     backgroundColor: "#00A651",
//     borderColor: "#00A651",
//   },
//   tabText: {
//     color: "rgba(255,255,255,0.8)",
//     fontSize: 13,
//     fontWeight: "600",
//     fontFamily: fontFamily.medium,
//   },
//   tabTextActive: {
//     color: "#fff",
//   },
// });

import VRNavigator from "@/components/vr-view";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VRSceneScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ViroARSceneNavigator
        style={{ flex: 1 }}
        initialScene={{ scene: VRNavigator }}
      />
      <TouchableOpacity style={styles.exitButton} onPress={() => router.back()}>
        <Text style={styles.exitText}>← Exit VR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  exitButton: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  exitText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
