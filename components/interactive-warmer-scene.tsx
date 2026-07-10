// import {
//   MODULE_ORDER,
//   ModuleId,
//   SceneKey,
//   Vec3,
//   WARMER_MODULES,
//   WARMER_SCENES,
//   WarmerPart,
// } from "@/constants/warmer-parts";
// import {
//   Viro360Image,
//   Viro3DObject,
//   ViroAmbientLight,
//   ViroAnimations,
//   ViroARScene,
//   ViroMaterials,
//   ViroNode,
//   ViroPolyline,
//   ViroSphere,
//   ViroSpotLight,
//   ViroText,
// } from "@reactvision/react-viro";
// import React from "react";

// // The 5 module GLBs split from the original scan. Exported in place,
// // so loading all of them at the same position reassembles the warmer.
// const MODULE_SOURCES: Record<ModuleId, any> = {
//   heater: require("@/assets/models/heater_module.glb"),
//   bassinet: require("@/assets/models/bassinet_module.glb"),
//   controller: require("@/assets/models/controller_module.glb"),
//   tray: require("@/assets/models/tray_module.glb"),
//   stand: require("@/assets/models/stand_module.glb"),
// };

// const DIMMED_OPACITY = 0.3; // non-focused modules in detail scenes

// ViroMaterials.createMaterials({
//   hotspot: { diffuseColor: "#00A651", lightingModel: "Constant" },
//   hotspotSelected: { diffuseColor: "#FFD60A", lightingModel: "Constant" },
//   guideLine: { diffuseColor: "#9BE7C4", lightingModel: "Constant" },
// });

// // Per-module explode/assemble animations. Registered once from the
// // offsets in WARMER_MODULES so the data file stays the single source
// // of truth for removal paths.
// const animationDefs: Record<string, any> = {
//   pulseUp: {
//     properties: { scaleX: 1.3, scaleY: 1.3, scaleZ: 1.3 },
//     duration: 600,
//     easing: "EaseInEaseOut",
//   },
//   pulseDown: {
//     properties: { scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0 },
//     duration: 600,
//     easing: "EaseInEaseOut",
//   },
//   pulse: [["pulseUp", "pulseDown"]] as unknown as any,
// };
// MODULE_ORDER.forEach((id) => {
//   const [ox, oy, oz] = WARMER_MODULES[id].explodeOffset;
//   animationDefs[`explode_${id}`] = {
//     properties: { positionX: ox, positionY: oy, positionZ: oz },
//     duration: 700,
//     easing: "EaseInEaseOut",
//   };
//   animationDefs[`assemble_${id}`] = {
//     properties: { positionX: 0, positionY: 0, positionZ: 0 },
//     duration: 700,
//     easing: "EaseInEaseOut",
//   };
// });
// ViroAnimations.registerAnimations(animationDefs);

// const MAX_DELAY = Math.max(
//   ...MODULE_ORDER.map((id) => WARMER_MODULES[id].explodeDelay)
// );

// // viroAppProps contract between the RN layer (app/vrscene.tsx) and this scene
// export type WarmerSceneAppProps = {
//   sceneKey: SceneKey;
//   exploded: boolean;
//   selectedPartId: string | null;
//   onSelectPart: (part: WarmerPart) => void;
//   onNavigate: (target: SceneKey) => void;
// };

// type ViroSceneProps = {
//   sceneNavigator: { viroAppProps: WarmerSceneAppProps };
// };

// function addVec(a: Vec3, b: Vec3): Vec3 {
//   return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
// }

// function Hotspot({
//   part,
//   isSelected,
//   onClick,
// }: {
//   part: WarmerPart;
//   isSelected: boolean;
//   onClick: () => void;
// }) {
//   return (
//     <ViroNode position={part.position} onClick={onClick}>
//       <ViroSphere
//         radius={0.045}
//         materials={[isSelected ? "hotspotSelected" : "hotspot"]}
//         opacity={0.85}
//         animation={{ name: "pulse", run: true, loop: true }}
//       />
//       <ViroText
//         text={part.label}
//         position={[0, 0.09, 0]}
//         scale={[0.18, 0.18, 0.18]}
//         style={{
//           fontSize: 16,
//           color: "#FFFFFF",
//           fontWeight: "bold",
//           textAlign: "center",
//         }}
//         outerStroke={{ type: "Outline", width: 2, color: "#000000" }}
//         transformBehaviors={["billboard"]}
//       />
//     </ViroNode>
//   );
// }

// export default function InteractiveWarmerScene(props: ViroSceneProps) {
//   const { sceneKey, exploded, selectedPartId, onSelectPart, onNavigate } =
//     props.sceneNavigator.viroAppProps;

//   const scene = WARMER_SCENES[sceneKey] ?? WARMER_SCENES.overview;
//   const isOverview = scene.key === "overview";

//   const handleModuleClick = (moduleId: ModuleId) => {
//     const mod = WARMER_MODULES[moduleId];
//     if (mod.targetScene && mod.targetScene !== scene.key) {
//       onNavigate(mod.targetScene);
//       return;
//     }
//     onSelectPart({
//       id: `module-${mod.id}`,
//       label: mod.label,
//       description: mod.description,
//       position: [0, 0, 0],
//     });
//   };

//   return (
//     <ViroARScene>
//       {/* 360 background */}
//       <Viro360Image source={require("@/assets/models/hospital_room.jpg")} />

//       {/* Lighting */}
//       <ViroAmbientLight color="#FFFFFF" intensity={500} />
//       <ViroSpotLight
//         position={[0, 5, 0]}
//         direction={[0, -1, 0]}
//         color="#ffffff"
//         intensity={800}
//         castsShadow={true}
//       />
//       <ViroSpotLight
//         position={[0, 0, 5]}
//         direction={[0, 0, -1]}
//         color="#ffffff"
//         intensity={400}
//       />

//       <ViroNode
//         position={scene.modelPosition}
//         scale={scene.modelScale}
//         rotation={scene.modelRotation}
//       >
//         {/* Same [0,-0.9,0] offset the single model used, so the existing
//             per-scene framing presets still apply */}
//         <ViroNode position={[0, -0.9, 0]}>
//           {MODULE_ORDER.map((moduleId) => {
//             const mod = WARMER_MODULES[moduleId];
//             const isFocused =
//               !scene.focusModule || scene.focusModule === moduleId;
//             const isAnchor = mod.explodeOffset.every((v) => v === 0);

//             // Explode delays run smallest-first (tray, controller,
//             // bassinet, heater); assembling runs in reverse order.
//             const delay = exploded
//               ? mod.explodeDelay
//               : MAX_DELAY - mod.explodeDelay;

//             return (
//               <ViroNode
//                 key={moduleId}
//                 animation={{
//                   name: exploded
//                     ? `explode_${moduleId}`
//                     : `assemble_${moduleId}`,
//                   run: true,
//                   delay,
//                 }}
//               >
//                 <Viro3DObject
//                   source={MODULE_SOURCES[moduleId]}
//                   type="GLB"
//                   opacity={isFocused ? 1.0 : DIMMED_OPACITY}
//                   onClick={() => handleModuleClick(moduleId)}
//                   onLoadEnd={() => console.log(`module loaded: ${moduleId}`)}
//                   onError={(event: any) =>
//                     console.error(`module error (${moduleId}):`, event)
//                   }
//                 />
//               </ViroNode>
//             );
//           })}

//           {/* Exploded-view extras: guide lines back to the attachment
//               point, plus tappable billboard labels per separated module */}
//           {exploded &&
//             MODULE_ORDER.map((moduleId) => {
//               const mod = WARMER_MODULES[moduleId];
//               if (mod.explodeOffset.every((v) => v === 0)) return null;
//               const end = addVec(mod.anchor, mod.explodeOffset);
//               return (
//                 <ViroNode key={`guide-${moduleId}`}>
//                   <ViroPolyline
//                     points={[mod.anchor, end]}
//                     thickness={0.006}
//                     materials={["guideLine"]}
//                     opacity={0.8}
//                   />
//                   <ViroNode
//                     position={addVec(end, [0, 0, -0.12])}
//                     onClick={() => handleModuleClick(moduleId)}
//                   >
//                     <ViroText
//                       text={mod.label}
//                       scale={[0.22, 0.22, 0.22]}
//                       style={{
//                         fontSize: 16,
//                         color: "#FFFFFF",
//                         fontWeight: "bold",
//                         textAlign: "center",
//                       }}
//                       outerStroke={{
//                         type: "Outline",
//                         width: 2,
//                         color: "#000000",
//                       }}
//                       transformBehaviors={["billboard"]}
//                     />
//                   </ViroNode>
//                 </ViroNode>
//               );
//             })}
//         </ViroNode>

//         {/* Sub-part hotspots for the current detail scene */}
//         {!isOverview &&
//           scene.parts.map((part) => (
//             <Hotspot
//               key={part.id}
//               part={part}
//               isSelected={selectedPartId === part.id}
//               onClick={() => onSelectPart(part)}
//             />
//           ))}
//       </ViroNode>
//     </ViroARScene>
//   );
// }

import {
  ELEMENT_ORDER,
  ElementId,
  Vec3,
  WARMER_ELEMENTS,
  WarmerElement,
} from "@/constants/warmer-elements";
import { SceneKey, WarmerPart } from "@/constants/warmer-parts";
import {
  Viro360Image,
  Viro3DObject,
  ViroAmbientLight,
  ViroAnimations,
  ViroARScene,
  ViroNode,
  ViroSpotLight,
} from "@reactvision/react-viro";
import React from "react";

// v2: renders the new element-level OBJ/MTL part set (constants/warmer-elements.ts)
// instead of the old 5-module GLBs. No hotspots, no 3D text labels this pass --
// tapping an element selects + highlights it directly; info goes through the
// existing RN tooltip overlay in app/vrscene.tsx (unchanged).
//
// Original GLB-driven version is kept as interactive-warmer-scene.tsx.bak.

// ---- OBJ + MTL sources ---------------------------------------------------
// Keep each .mtl alongside its .obj in assets/models/. support_frame is
// still pending (see constants/warmer-elements.ts) -- its entry is left out
// on purpose, and the render loop below skips any element with no source.
// const ELEMENT_SOURCES: Partial<Record<ElementId, { obj: any; mtl: any }>> = {
//   wheels: {
//     obj: require("@/assets/models/Wheels.obj"),
//     mtl: require("@/assets/models/Wheels.mtl"),
//   },
//   bed_bassinet: {
//     obj: require("@/assets/models/Bed_Bassinet.obj"),
//     mtl: require("@/assets/models/Bed_Bassinet.mtl"),
//   },
//   bassinet_shields: {
//     obj: require("@/assets/models/Bassinet_Shields.obj"),
//     mtl: require("@/assets/models/Bassinet_Shields.mtl"),
//   },
//   control_board: {
//     obj: require("@/assets/models/Control_Board.obj"),
//     mtl: require("@/assets/models/Control_Board.mtl"),
//   },
//   collimator_support: {
//     obj: require("@/assets/models/Collimator_support.obj"),
//     mtl: require("@/assets/models/Collimator_support.mtl"),
//   },
//   collimator_dissembled: {
//     obj: require("@/assets/models/Collimator_dissembled.obj"),
//     mtl: require("@/assets/models/Collimator_dissembled.mtl"),
//   },
//   // support_frame: add once Support_Frame.obj arrives
// };

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

// Uniform fix for the whole assembly: source files are in cm (Viro works in
// meters) and CAD Z-up (Viro/AR is Y-up). Rotation sign is UNTESTED in Viro
// -- Abdul confirmed [?]90 on X in Blender but the sign there doesn't
// necessarily carry over. Flip to [90,0,0] if the model loads upside-down
// or on its side.
const GLOBAL_SCALE: Vec3 = [0.012, 0.012, 0.012];
const GLOBAL_ROTATION: Vec3 = [-90, 90, 0];
// Starting placement guess -- not yet tuned in AR. Adjust once you see it.
const GLOBAL_POSITION: Vec3 = [0, -1.6, -2.0];

// Explode/assemble animations, generated per element from restPosition +
// explodeOffset in warmer-elements.ts. Elements with explodeOffset: null
// (currently just the pending support_frame) are skipped.
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

// viroAppProps contract between the RN layer (app/vrscene.tsx) and this
// scene. Kept identical to the old module version -- sceneKey/WarmerPart
// still come from constants/warmer-parts.ts so app/vrscene.tsx (tabs,
// titles, tooltip UI) needs no changes.
export type WarmerSceneAppProps = {
  sceneKey: SceneKey;
  exploded: boolean;
  selectedPartId: string | null;
  onSelectPart: (part: WarmerPart) => void;
  onNavigate: (target: SceneKey) => void;
};

type ViroSceneProps = {
  sceneNavigator: { viroAppProps: WarmerSceneAppProps };
};

export default function InteractiveWarmerScene(props: ViroSceneProps) {
  const { sceneKey, exploded, selectedPartId, onSelectPart } =
    props.sceneNavigator.viroAppProps;

  const isOverview = sceneKey === "overview";

  const handleElementClick = (element: WarmerElement) => {
    onSelectPart({
      id: element.id,
      label: element.label,
      description: element.notes ?? element.label,
      position: [0, 0, 0], // unused by the RN tooltip overlay, kept for type compatibility
    });
  };

  return (
    <ViroARScene>
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
        position={[0, -2.4, -2.2]}
        scale={[0.013, 0.013, 0.013]}
        rotation={[0, 90, 0]}
      >
        {ELEMENT_ORDER.map((id) => {
          const element = WARMER_ELEMENTS[id];
          const source = ELEMENT_SOURCES[id];
          if (!source) return null; // support_frame -- not loaded yet

          const isSelected = selectedPartId === element.id;
          // A specific tap always wins: dim everything else regardless of
          // scene. With nothing selected, fall back to the scene's module
          // focus (same dimming behavior as the old version).
          const dimmed = selectedPartId
            ? !isSelected
            : !isOverview && element.module !== sceneKey;

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
                onClick={() => handleElementClick(element)}
                onLoadEnd={() => console.log(`element loaded: ${id}`)}
                onError={(event: any) =>
                  console.error(`element error (${id}):`, event)
                }
                animation={{
                  name: "selectPulse",
                  run: isSelected,
                  loop: false,
                }}
              />
            </ViroNode>
          );
        })}
      </ViroNode>
    </ViroARScene>
  );
}
