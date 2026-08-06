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

import {
  CIRCUIT_COMPONENTS,
  CircuitComponent,
  SVG_VIEWBOX,
} from "@/constants/circuit-components";
import {
  ELEMENT_ORDER,
  ElementId,
  Vec3,
  WARMER_ELEMENTS,
  WarmerElement,
} from "@/constants/warmer-elements";
import {
  Viro360Image,
  Viro3DObject,
  ViroAmbientLight,
  ViroAnimations,
  ViroImage,
  ViroMaterials,
  ViroNode,
  ViroQuad,
  ViroScene,
  ViroSpotLight,
  ViroText,
} from "@reactvision/react-viro";
import React, { useState } from "react";

// Cardboard/stereo sibling of components/interactive-warmer-scene.tsx, built
// for app/mobilevr.tsx's ViroVRSceneNavigator. Same element set + the same
// explode/assemble animations as the touch VR/AR scenes, but there's no
// touchscreen inside a headset, so every interaction here is gaze
// (onHover, for a highlight/label) + the Cardboard trigger button (onClick)
// instead of RN overlay buttons and taps.
//
// Root MUST be a plain <ViroScene> -- not <ViroARScene>, and not an RN
// <View>. This file previously had app/vrscene.tsx's screen code pasted
// into it by mistake (a <View> wrapping its own nested
// ViroARSceneNavigator), which is exactly why Viro threw "Attempted to add
// non-scene element": the navigator handed a plain RN View to native code
// that expected a Viro scene.
//
// No scene-switching tabs here (Overview/Heater/Bassinet/Controller) --
// that's a touch-UI concept with no gaze equivalent yet. This shows the
// full assembly with per-part gaze-select info and an Explode/Assemble
// gaze-button, matching the pattern already proven out in
// electrical-vr-room-scene.tsx. Multi-scene framing could be added later
// as a gaze-driven menu if you want full parity.

// Registered locally so this file doesn't depend on whichever screen
// happens to mount it first. Guarded so Fast Refresh doesn't throw on
// duplicate registration.
try {
  ViroMaterials.createMaterials({
    arrowIdle: { diffuseColor: "rgba(255,255,255,0.18)" },
    arrowActive: { diffuseColor: "rgba(7,73,255,0.55)" },
    reticle: { diffuseColor: "rgba(255,255,255,0.9)" },
    infoPanel: { diffuseColor: "rgba(0,0,0,0.72)" },
    // Schematic panel backing + gaze hotspots. hotspotIdle is nearly
    // transparent so it doesn't obscure the artwork but still receives the
    // gaze ray; hotspotActive tints the part currently under the reticle.
    schematicBoard: { diffuseColor: "rgba(255,255,255,1.0)" },
    hotspotIdle: { diffuseColor: "rgba(7,73,255,0.001)" },
    hotspotActive: { diffuseColor: "rgba(7,73,255,0.30)" },
  });
} catch {
  // already registered
}

const ELEMENT_SOURCES: Partial<Record<ElementId, { glbFile: any }>> = {
  wheels: {
    glbFile: require("@/assets/models/3D/wheels.glb"),
  },
  support_frame: {
    glbFile: require("@/assets/models/3D/support_frame.glb"),
  },
  real_bed_bassinet: {
    glbFile: require("@/assets/models/3D/real_bed_bassinet.glb"),
  },
  bassinet_shields: {
    glbFile: require("@/assets/models/3D/bassinet_shields.glb"),
  },
  control_board: {
    glbFile: require("@/assets/models/3D/control_board.glb"),
  },
  collimator_support: {
    glbFile: require("@/assets/models/3D/collimator_support.glb"),
  },
  collimator_dissemble: {
    glbFile: require("@/assets/models/3D/collimator_dissemble.glb"),
  },
  // support_frame: add once Support_Frame.obj arrives
};

const DIMMED_OPACITY = 0.3;

// Same assembly framing as interactive-warmer-scene.tsx -- same source
// files, same cm->m / Z-up fix, so it should look identical to the touch
// VR scene, just rendered in stereo.
const ASSEMBLY_POSITION: Vec3 = [0, -2.4, -2.2];
const ASSEMBLY_SCALE: Vec3 = [0.013, 0.013, 0.013];
const ASSEMBLY_ROTATION: Vec3 = [0, 90, 0];

const animationDefs: Record<string, any> = {
  selectPulseUp: {
    properties: { scaleX: 1.15, scaleY: 1.15, scaleZ: 1.15 },
    duration: 220,
    easing: "EaseOut",
  },
  selectPulseDown: {
    properties: { scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0 },
    duration: 220,
    easing: "EaseIn",
  },
  selectPulse: [["selectPulseUp", "selectPulseDown"]] as unknown as any,
};
ELEMENT_ORDER.forEach((id) => {
  const el = WARMER_ELEMENTS[id];
  if (!el.explodeOffset) return;
  const [rx, ry, rz] = el.restPosition;
  const [ox, oy, oz] = el.explodeOffset;
  animationDefs[`explode_${id}`] = {
    properties: { positionX: rx + ox, positionY: ry + oy, positionZ: rz + oz },
    duration: 700,
    easing: "EaseInEaseOut",
  };
  animationDefs[`assemble_${id}`] = {
    properties: { positionX: rx, positionY: ry, positionZ: rz },
    duration: 700,
    easing: "EaseInEaseOut",
  };
});
ViroAnimations.registerAnimations(animationDefs);

const MAX_DELAY = Math.max(
  ...ELEMENT_ORDER.map((id) => WARMER_ELEMENTS[id].explodeDelay)
);

// --- Schematic panel -------------------------------------------------------
// The circuit schematic (assets/images/circuit_image.png, 3000x1844, same
// crop as circuit_image.svg) is shown on a flat board floating in the room,
// as the stereo/gaze counterpart to the 2D pinch-pan CircuitSchematicViewer.
//
// PANEL_WIDTH is the board's width in metres; height is derived from the SVG
// viewBox ratio so the artwork isn't stretched. The board sits at Z =
// -PANEL_DISTANCE facing the viewer. ZOOM_SCALE enlarges the whole board (and
// its hotspots, since they're children) for reading dense schematic text.
const PANEL_WIDTH = 3.0;
const PANEL_HEIGHT = PANEL_WIDTH * (SVG_VIEWBOX.height / SVG_VIEWBOX.width);
const PANEL_POSITION: Vec3 = [0, 0.1, -2.7];
const ZOOM_SCALE = 1.8;
// Hotspots sit a hair in front of the board so they win the gaze ray and
// don't z-fight the image.
const HOTSPOT_Z = 0.02;

// Map each CIRCUIT_COMPONENTS box from SVG-viewBox space into board-local
// metres, once. u/v are 0..1 across the viewBox (v grows downward, like the
// 2D viewer); board-local X grows right and Y grows up, hence the v flip.
type SchematicHotspot = {
  component: CircuitComponent;
  x: number;
  y: number;
  width: number;
  height: number;
};

const SCHEMATIC_HOTSPOTS: SchematicHotspot[] = CIRCUIT_COMPONENTS.map((c) => {
  const cx = c.hotspot.x + c.hotspot.width / 2;
  const cy = c.hotspot.y + c.hotspot.height / 2;
  const u = (cx - SVG_VIEWBOX.minX) / SVG_VIEWBOX.width;
  const v = (cy - SVG_VIEWBOX.minY) / SVG_VIEWBOX.height;
  return {
    component: c,
    x: (u - 0.5) * PANEL_WIDTH,
    y: (0.5 - v) * PANEL_HEIGHT,
    width: (c.hotspot.width / SVG_VIEWBOX.width) * PANEL_WIDTH,
    height: (c.hotspot.height / SVG_VIEWBOX.height) * PANEL_HEIGHT,
  };
});

export default function VRRoomScene() {
  // Which element the gaze reticle is currently resting on -- drives the
  // small floating label. Approximate for adjacent parts (Viro fires the
  // new element's onHover(true) and the old one's onHover(false) in
  // whichever order the native side settles the ray in that frame), same
  // as the single-object hover pattern in electrical-vr-room-scene.tsx,
  // just extended to multiple objects.
  const [hoveredId, setHoveredId] = useState<ElementId | null>(null);
  const [selected, setSelected] = useState<WarmerElement | null>(null);
  const [exploded, setExploded] = useState(false);

  // Schematic mode: which view is active, the gaze-hovered/selected part on
  // the schematic board, and whether the board is zoomed in for reading.
  const [mode, setMode] = useState<"warmer" | "schematic">("warmer");
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] =
    useState<CircuitComponent | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const handleElementClick = (element: WarmerElement) => {
    setSelected((prev) => (prev?.id === element.id ? null : element));
  };

  const toggleMode = () => {
    // Clear any open selection/label so it doesn't leak across views.
    setSelected(null);
    setSelectedComponent(null);
    setHoveredId(null);
    setHoveredHotspotId(null);
    setMode((m) => (m === "warmer" ? "schematic" : "warmer"));
  };

  const handleHotspotClick = (component: CircuitComponent) => {
    setSelectedComponent((prev) =>
      prev?.id === component.id ? null : component
    );
  };

  const isWarmer = mode === "warmer";

  return (
    <ViroScene>
      {/* 360 background */}
      <Viro360Image source={require("@/assets/models/hospital_room.jpg")} />

      {/* Lighting */}
      <ViroAmbientLight color="#FFFFFF" intensity={400} />
      <ViroSpotLight
        position={[0, 6, 2]}
        direction={[0, -1, -0.2]}
        color="#FFFFFF"
        intensity={900}
        castsShadow={true}
      />
      <ViroSpotLight
        position={[0, 2, 4]}
        direction={[0, -0.3, -1]}
        color="#FFFFFF"
        intensity={250}
      />

      <ViroNode
        position={ASSEMBLY_POSITION}
        scale={ASSEMBLY_SCALE}
        rotation={ASSEMBLY_ROTATION}
        visible={isWarmer}
      >
        {ELEMENT_ORDER.map((id) => {
          const element = WARMER_ELEMENTS[id];
          const source = ELEMENT_SOURCES[id];
          if (!source) return null; // support_frame -- not loaded yet

          const isSelected = selected?.id === element.id;
          const dimmed = selected ? !isSelected : false;

          const delay = exploded
            ? element.explodeDelay
            : MAX_DELAY - element.explodeDelay;

          return (
            <ViroNode
              key={id}
              position={element.restPosition}
              animation={{
                name: exploded ? `explode_${id}` : `assemble_${id}`,
                run: true,
                delay,
              }}
            >
              <Viro3DObject
                source={source.glbFile}
                type="GLB"
                opacity={dimmed ? DIMMED_OPACITY : 1.0}
                onHover={(isHovering: boolean) =>
                  setHoveredId(isHovering ? id : null)
                }
                onClick={() => handleElementClick(element)}
                onLoadEnd={() => console.log(`vr element loaded: ${id}`)}
                onError={(event: any) =>
                  console.error(`vr element error (${id}):`, event)
                }
                animation={{
                  name: "selectPulse",
                  run: isSelected,
                  loop: false,
                }}
              />

              {/* Gaze label -- only while nothing is already open */}
              {hoveredId === id && !selected && (
                <ViroNode
                  position={[0, 0.7, 0]}
                  transformBehaviors={["billboardY"]}
                >
                  <ViroQuad
                    height={0.4}
                    width={1.4}
                    materials={["arrowActive"]}
                  />
                  <ViroText
                    text={`Click to inspect ${element.label}`}
                    position={[0, 0, 0.01]}
                    width={5}
                    height={1.4}
                    scale={[0.28, 0.28, 0.28]}
                    style={{
                      fontSize: 40,
                      color: "#FFFFFF",
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                    outerStroke={{
                      type: "Outline",
                      width: 2,
                      color: "#000000",
                    }}
                  />
                </ViroNode>
              )}
            </ViroNode>
          );
        })}
      </ViroNode>

      {/* Warmer info panel for the selected part -- gaze + click CLOSE */}
      {isWarmer && selected && (
        <ViroNode
          position={[0, 0.45, -1.8]}
          transformBehaviors={["billboardY"]}
        >
          <ViroQuad height={1.5} width={2.4} materials={["infoPanel"]} />
          <ViroText
            text={`${selected.label}\n\n${selected.notes ?? selected.label}`}
            position={[0, 0.22, 0.01]}
            width={5}
            height={3.5}
            scale={[0.4, 0.4, 0.4]}
            style={{
              fontSize: 34,
              color: "#FFFFFF",
              fontWeight: "600",
              textAlign: "center",
            }}
            outerStroke={{ type: "Outline", width: 2, color: "#000000" }}
          />

          <ViroNode
            position={[0, -0.55, 0.01]}
            onClick={() => setSelected(null)}
          >
            <ViroQuad height={0.24} width={0.7} materials={["arrowActive"]} />
            <ViroText
              text="CLOSE"
              position={[0, 0, 0.01]}
              scale={[0.18, 0.18, 0.18]}
              style={{
                fontSize: 32,
                color: "#FFFFFF",
                fontWeight: "700",
                textAlign: "center",
              }}
            />
          </ViroNode>
        </ViroNode>
      )}

      {/* Floating Explode / Assemble gaze-button (warmer only), off to the
          side so it doesn't sit on top of the assembly */}
      {isWarmer && (
        <ViroNode
          position={[0.9, -0.3, -1.6]}
          onClick={() => setExploded((e) => !e)}
        >
          <ViroQuad height={0.16} width={0.5} materials={["arrowActive"]} />
          <ViroText
            text={exploded ? "ASSEMBLE" : "EXPLODE"}
            position={[0, 0, 0.01]}
            scale={[0.12, 0.12, 0.12]}
            style={{
              fontSize: 24,
              color: "#FFFFFF",
              borderRadius: 24,
              fontWeight: "700",
              textAlign: "center",
            }}
          />
        </ViroNode>
      )}

      {/* ---- Schematic board (schematic mode only) ---- */}
      {!isWarmer && (
        <ViroNode
          position={PANEL_POSITION}
          scale={zoomed ? [ZOOM_SCALE, ZOOM_SCALE, ZOOM_SCALE] : [1, 1, 1]}
        >
          <ViroImage
            source={require("@/assets/images/circuit_image.png")}
            width={PANEL_WIDTH}
            height={PANEL_HEIGHT}
            position={[0, 0, 0]}
          />

          {/* Transparent gaze hotspots overlaid on the artwork */}
          {SCHEMATIC_HOTSPOTS.map((h) => {
            const active =
              hoveredHotspotId === h.component.id ||
              selectedComponent?.id === h.component.id;
            return (
              <ViroQuad
                key={h.component.id}
                position={[h.x, h.y, HOTSPOT_Z]}
                width={h.width}
                height={h.height}
                materials={[active ? "hotspotActive" : "hotspotIdle"]}
                onHover={(isHovering: boolean) =>
                  setHoveredHotspotId(isHovering ? h.component.id : null)
                }
                onClick={() => handleHotspotClick(h.component)}
              />
            );
          })}
        </ViroNode>
      )}

      {/* Schematic info panel -- gaze + click CLOSE to dismiss */}
      {!isWarmer && selectedComponent && (
        <ViroNode
          position={[0, 0.45, -1.8]}
          transformBehaviors={["billboardY"]}
        >
          <ViroQuad height={1.5} width={2.4} materials={["infoPanel"]} />
          <ViroText
            text={`${selectedComponent.label}\n\n${selectedComponent.description}`}
            position={[0, 0.22, 0.01]}
            width={5}
            height={3.5}
            scale={[0.4, 0.4, 0.4]}
            style={{
              fontSize: 34,
              color: "#FFFFFF",
              fontWeight: "600",
              textAlign: "center",
            }}
            outerStroke={{ type: "Outline", width: 2, color: "#000000" }}
          />

          <ViroNode
            position={[0, -0.55, 0.01]}
            onClick={() => setSelectedComponent(null)}
          >
            <ViroQuad height={0.24} width={0.7} materials={["arrowActive"]} />
            <ViroText
              text="CLOSE"
              position={[0, 0, 0.01]}
              scale={[0.18, 0.18, 0.18]}
              style={{
                fontSize: 32,
                color: "#FFFFFF",
                fontWeight: "700",
                textAlign: "center",
              }}
            />
          </ViroNode>
        </ViroNode>
      )}

      {/* Zoom gaze-button (schematic mode only) */}
      {!isWarmer && (
        <ViroNode
          position={[0.9, -0.3, -1.6]}
          onClick={() => setZoomed((z) => !z)}
        >
          <ViroQuad height={0.16} width={0.55} materials={["arrowActive"]} />
          <ViroText
            text={zoomed ? "ZOOM OUT" : "ZOOM IN"}
            position={[0, 0, 0.01]}
            scale={[0.12, 0.12, 0.12]}
            style={{
              fontSize: 32,
              color: "#FFFFFF",
              fontWeight: "700",
              textAlign: "center",
            }}
          />
        </ViroNode>
      )}

      {/* Mode toggle gaze-button (always) -- swap warmer <-> schematic in the
          same headset session */}
      <ViroNode position={[-0.9, -0.3, -1.6]} onClick={toggleMode}>
        <ViroQuad height={0.16} width={0.7} materials={["arrowActive"]} />
        <ViroText
          text={isWarmer ? "SCHEMATIC" : "WARMER"}
          position={[0, 0, 0.01]}
          scale={[0.12, 0.12, 0.12]}
          style={{
            fontSize: 32,
            color: "#FFFFFF",
            fontWeight: "700",
            textAlign: "center",
          }}
        />
      </ViroNode>

      {/* Fixed center reticle for gaze feedback */}
      <ViroNode position={[0, 0, -1]}>
        <ViroQuad height={0.015} width={0.015} materials={["reticle"]} />
      </ViroNode>
    </ViroScene>
  );
}
