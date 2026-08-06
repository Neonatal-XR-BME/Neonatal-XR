// import {
//   ELEMENT_ORDER,
//   ElementId,
//   Vec3,
//   WARMER_ELEMENTS,
//   WarmerElement,
// } from "@/constants/warmer-elements";
// import { SceneKey, WarmerPart } from "@/constants/warmer-parts";
// import {
//   Viro3DObject,
//   ViroAmbientLight,
//   ViroAnimations,
//   ViroARImageMarker,
//   ViroARScene,
//   ViroARTrackingTargets,
//   ViroNode,
//   ViroSpotLight,
// } from "@reactvision/react-viro";
// import React, { useEffect, useRef, useState } from "react";

// // AR sibling of components/interactive-warmer-scene.tsx. Same element set,
// // same explode/assemble + select-pulse animations, same dimming rules --
// // the only real difference is WHERE the assembly is anchored: instead of a
// // fixed position in front of the camera inside a 360 room, it's parented to
// // a ViroARImageMarker so it appears on top of the physical marker, and the
// // whole assembly can be pinched/rotated/reset the way the old single-GLB
// // arscene.tsx let you adjust a model.

// ViroARTrackingTargets.createTargets({
//   logo: {
//     source: require("@/assets/models/imgggg.webp"),
//     orientation: "Up",
//     physicalWidth: 0.1,
//   },
// });

// const ELEMENT_SOURCES: Partial<Record<ElementId, { glbFile: any }>> = {
//   wheels: {
//     glbFile: require("@/assets/models/3D/wheels.glb"),
//   },
//   support_frame: {
//     glbFile: require("@/assets/models/3D/support_frame.glb"),
//   },
//   real_bed_bassinet: {
//     glbFile: require("@/assets/models/3D/real_bed_bassinet.glb"),
//   },
//   bassinet_shields: {
//     glbFile: require("@/assets/models/3D/bassinet_shields.glb"),
//   },
//   control_board: {
//     glbFile: require("@/assets/models/3D/control_board.glb"),
//   },
//   collimator_support: {
//     glbFile: require("@/assets/models/3D/collimator_support.glb"),
//   },
//   collimator_dissemble: {
//     glbFile: require("@/assets/models/3D/collimator_dissemble.glb"),
//   },
//   // support_frame: add once Support_Frame.obj arrives
// };

// const DIMMED_OPACITY = 0.3;

// // Marker-relative starting placement -- NOT yet tuned. The VR version sits
// // the assembly at a fixed spot inside a 360 room; here it needs to sit on
// // top of whatever the "logo" marker is printed on. Same 0.013 scale as the
// // VR file (same source files, same cm->m fix), rotation/position are a
// // first guess -- adjust once you see it relative to the marker.
// const DEFAULT_SCALE: Vec3 = [0.0013, 0.0013, 0.0013];
// const DEFAULT_ROTATION: Vec3 = [90, -180, 90];
// const DEFAULT_POSITION: Vec3 = [0, 0, 0];

// const animationDefs: Record<string, any> = {
//   selectPulseUp: {
//     properties: { scaleX: 1.15, scaleY: 1.15, scaleZ: 1.15 },
//     duration: 220,
//     easing: "EaseOut",
//   },

//   selectPulseDown: {
//     properties: { scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0 },
//     duration: 220,
//     easing: "EaseIn",
//   },
//   selectPulse: [["selectPulseUp", "selectPulseDown"]] as unknown as any,
// };
// ELEMENT_ORDER.forEach((id) => {
//   const el = WARMER_ELEMENTS[id];
//   if (!el.explodeOffset) return;
//   const [rx, ry, rz] = el.restPosition;
//   const [ox, oy, oz] = el.explodeOffset;
//   animationDefs[`explode_${id}`] = {
//     properties: { positionX: rx + ox, positionY: ry + oy, positionZ: rz + oz },
//     duration: 700,
//     easing: "EaseInEaseOut",
//   };
//   animationDefs[`assemble_${id}`] = {
//     properties: { positionX: rx, positionY: ry, positionZ: rz },
//     duration: 700,
//     easing: "EaseInEaseOut",
//   };
// });
// ViroAnimations.registerAnimations(animationDefs);

// const MAX_DELAY = Math.max(
//   ...ELEMENT_ORDER.map((id) => WARMER_ELEMENTS[id].explodeDelay)
// );

// // Same contract as components/interactive-warmer-scene.tsx's
// // WarmerSceneAppProps, plus the AR-only bits: marker status needs to be
// // surfaced up to the RN overlay (app/arscene.tsx) since it decides whether
// // to show "point your camera at the marker" vs. the scene tabs, and
// // resetSignal lets the RN "Reset" button ask this scene to snap the
// // assembly back to DEFAULT_SCALE/ROTATION/POSITION.
// export type WarmerARSceneAppProps = {
//   sceneKey: SceneKey;
//   exploded: boolean;
//   selectedPartId: string | null;
//   viewLocked?: boolean;
//   onSelectPart: (part: WarmerPart) => void;
//   onNavigate: (target: SceneKey) => void;
//   onMarkerFound?: () => void;
//   onMarkerLost?: () => void;
//   resetSignal?: number;
// };

// type ViroSceneProps = {
//   sceneNavigator: { viroAppProps: WarmerARSceneAppProps };
// };

// export default function InteractiveWarmerARScene(props: ViroSceneProps) {
//   const {
//     sceneKey,
//     exploded,
//     selectedPartId,
//     viewLocked,
//     onSelectPart,
//     onMarkerFound,
//     onMarkerLost,
//     resetSignal,
//   } = props.sceneNavigator.viroAppProps;

//   const [modelVisible, setModelVisible] = useState(false);
//   const [scale, setScale] = useState<Vec3>([...DEFAULT_SCALE]);
//   const [rotation, setRotation] = useState<Vec3>([...DEFAULT_ROTATION]);
//   const [position, setPosition] = useState<Vec3>([...DEFAULT_POSITION]);
//   const lastScaleRef = useRef<number>(1);
//   const lastRotationRef = useRef<number>(0);

//   const isOverview = sceneKey === "overview";

//   // Snap back to defaults whenever the RN "Reset" button bumps resetSignal.
//   useEffect(() => {
//     if (resetSignal === undefined) return;
//     setScale([...DEFAULT_SCALE]);
//     setRotation([...DEFAULT_ROTATION]);
//     setPosition([...DEFAULT_POSITION]);
//     lastScaleRef.current = 1;
//     lastRotationRef.current = 0;
//   }, [resetSignal]);

//   const handlePinch = (pinchState: number, scaleFactor: number) => {
//     if (pinchState === 2) {
//       const delta = scaleFactor / lastScaleRef.current;
//       lastScaleRef.current = scaleFactor;
//       setScale((prev) => prev.map((s) => Math.max(s * delta, 0.001)) as Vec3);
//     } else if (pinchState === 3) {
//       lastScaleRef.current = 1;
//     }
//   };

//   const handleRotate = (rotateState: number, rotationFactor: number) => {
//     if (rotateState === 2) {
//       const delta = rotationFactor - lastRotationRef.current;
//       lastRotationRef.current = rotationFactor;
//       setRotation((prev) => [prev[0], prev[1] + delta, prev[2]] as Vec3);
//     } else if (rotateState === 3) {
//       lastRotationRef.current = 0;
//     }
//   };

//   const handleAnchorFound = () => {
//     setModelVisible(true);
//     onMarkerFound?.();
//   };

//   const handleAnchorRemoved = () => {
//     setModelVisible(false);
//     onMarkerLost?.();
//   };

//   const movementProps = viewLocked
//     ? {}
//     : {
//         dragType: "FixedToWorld" as const,
//         onDrag: () => {},
//         onPinch: handlePinch,
//         onRotate: handleRotate,
//       };

//   const handleElementClick = (element: WarmerElement) => {
//     onSelectPart({
//       id: element.id,
//       label: element.label,
//       description: element.notes ?? element.label,
//       position: [0, 0, 0], // unused by the RN tooltip overlay, kept for type compatibility
//     });
//   };

//   return (
//     <ViroARScene>
//       <ViroAmbientLight color="#FFFFFF" intensity={400} />
//       <ViroSpotLight
//         innerAngle={5}
//         outerAngle={45}
//         direction={[0, -1, -0.2]}
//         position={[0, 5, 1]}
//         color="#ffffff"
//         castsShadow={true}
//         shadowMapSize={2048}
//         shadowNearZ={2}
//         shadowFarZ={5}
//         shadowOpacity={0.7}
//         intensity={500}
//       />

//       <ViroARImageMarker
//         target="logo"
//         onAnchorFound={handleAnchorFound}
//         onAnchorRemoved={handleAnchorRemoved}
//       >
//         {modelVisible && (
//           <ViroNode
//             position={position}
//             rotation={rotation}
//             scale={scale}
//             {...movementProps}
//           >
//             {ELEMENT_ORDER.map((id) => {
//               const element = WARMER_ELEMENTS[id];
//               const source = ELEMENT_SOURCES[id];
//               if (!source) return null; // support_frame -- not loaded yet

//               const isSelected = selectedPartId === element.id;
//               // Same rule as the VR scene: an explicit tap always wins over
//               // scene-based focus dimming.
//               const dimmed = selectedPartId
//                 ? !isSelected
//                 : !isOverview && element.module !== sceneKey;

//               const delay = exploded
//                 ? element.explodeDelay
//                 : MAX_DELAY - element.explodeDelay;

//               return (
//                 <ViroNode
//                   key={id}
//                   position={element.restPosition}
//                   animation={{
//                     name: exploded ? `explode_${id}` : `assemble_${id}`,
//                     run: true,
//                     delay,
//                   }}
//                 >
//                   <Viro3DObject
//                     source={source.glbFile}
//                     type="GLB"
//                     opacity={dimmed ? DIMMED_OPACITY : 1.0}
//                     onClick={() => handleElementClick(element)}
//                     onLoadEnd={() => console.log(`AR element loaded: ${id}`)}
//                     onError={(event: any) =>
//                       console.error(`AR element error (${id}):`, event)
//                     }
//                     animation={{
//                       name: "selectPulse",
//                       run: isSelected,
//                       loop: false,
//                     }}
//                   />
//                 </ViroNode>
//               );
//             })}
//           </ViroNode>
//         )}
//       </ViroARImageMarker>
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
  Viro3DObject,
  ViroAmbientLight,
  ViroAnimations,
  ViroARImageMarker,
  ViroARScene,
  ViroARTrackingTargets,
  ViroNode,
  ViroSpotLight,
} from "@reactvision/react-viro";
import React, { useEffect, useRef, useState } from "react";

ViroARTrackingTargets.createTargets({
  logo: {
    source: require("@/assets/models/logo.webp"),
    orientation: "Up",
    physicalWidth: 0.5,
  },
});

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
};

const DIMMED_OPACITY = 0.3;

const DEFAULT_SCALE: Vec3 = [0.0013, 0.0013, 0.0013];
const DEFAULT_ROTATION: Vec3 = [90, -180, 90];
const DEFAULT_POSITION: Vec3 = [0, 0, 0];

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

export type WarmerARSceneAppProps = {
  sceneKey: SceneKey;
  exploded: boolean;
  selectedPartId: string | null;
  viewLocked?: boolean;
  onSelectPart: (part: WarmerPart) => void;
  onNavigate: (target: SceneKey) => void;
  onMarkerFound?: () => void;
  onMarkerLost?: () => void;
  resetSignal?: number;
};

type ViroSceneProps = {
  sceneNavigator: { viroAppProps: WarmerARSceneAppProps };
};

export default function InteractiveWarmerARScene(props: ViroSceneProps) {
  const {
    sceneKey,
    exploded,
    selectedPartId,
    viewLocked,
    onSelectPart,
    onMarkerFound,
    onMarkerLost,
    resetSignal,
  } = props.sceneNavigator.viroAppProps;

  const [modelVisible, setModelVisible] = useState(false);
  const [scale, setScale] = useState<Vec3>([...DEFAULT_SCALE]);
  const [rotation, setRotation] = useState<Vec3>([...DEFAULT_ROTATION]);
  const [position, setPosition] = useState<Vec3>([...DEFAULT_POSITION]);
  const lastScaleRef = useRef<number>(1);
  const lastRotationRef = useRef<number>(0);

  const isOverview = sceneKey === "overview";

  useEffect(() => {
    if (resetSignal === undefined) return;
    setScale([...DEFAULT_SCALE]);
    setRotation([...DEFAULT_ROTATION]);
    setPosition([...DEFAULT_POSITION]);
    lastScaleRef.current = 1;
    lastRotationRef.current = 0;
  }, [resetSignal]);

  const handlePinch = (pinchState: number, scaleFactor: number) => {
    if (pinchState === 2) {
      const delta = scaleFactor / lastScaleRef.current;
      lastScaleRef.current = scaleFactor;
      setScale((prev) => prev.map((s) => Math.max(s * delta, 0.001)) as Vec3);
    } else if (pinchState === 3) {
      lastScaleRef.current = 1;
    }
  };

  const handleRotate = (rotateState: number, rotationFactor: number) => {
    if (rotateState === 2) {
      const delta = rotationFactor - lastRotationRef.current;
      lastRotationRef.current = rotationFactor;
      setRotation((prev) => [prev[0], prev[1] + delta, prev[2]] as Vec3);
    } else if (rotateState === 3) {
      lastRotationRef.current = 0;
    }
  };

  const handleAnchorFound = () => {
    setModelVisible(true);
    onMarkerFound?.();
  };

  const handleAnchorRemoved = () => {
    setModelVisible(false);
    onMarkerLost?.();
  };

  const movementProps = viewLocked
    ? {}
    : {
        dragType: "FixedToWorld" as const,
        onDrag: () => {},
        onPinch: handlePinch,
        onRotate: handleRotate,
      };

  const handleElementClick = (element: WarmerElement) => {
    onSelectPart({
      id: element.id,
      label: element.label,
      description: element.notes ?? element.label,
      position: [0, 0, 0],
    });
  };

  return (
    <ViroARScene>
      <ViroAmbientLight color="#FFFFFF" intensity={400} />
      <ViroSpotLight
        innerAngle={5}
        outerAngle={45}
        direction={[0, -1, -0.2]}
        position={[0, 5, 1]}
        color="#ffffff"
        castsShadow={true}
        shadowMapSize={2048}
        shadowNearZ={2}
        shadowFarZ={5}
        shadowOpacity={0.7}
        intensity={500}
      />

      <ViroARImageMarker
        target="logo"
        onAnchorFound={handleAnchorFound}
        onAnchorRemoved={handleAnchorRemoved}
      >
        {modelVisible && (
          <ViroNode
            position={position}
            rotation={rotation}
            scale={scale}
            {...movementProps}
          >
            {ELEMENT_ORDER.map((id) => {
              const element = WARMER_ELEMENTS[id];
              const source = ELEMENT_SOURCES[id];
              if (!source) return null;

              const isSelected = selectedPartId === element.id;
              const dimmed = selectedPartId
                ? !isSelected
                : !isOverview && element.module !== sceneKey;

              const delay = exploded
                ? element.explodeDelay
                : MAX_DELAY - element.explodeDelay;

              // Apply billboard behavior ONLY to the control board when it is selected
              const transformBehaviors =
                isSelected && id === "control_board" ? ["billboardY"] : [];

              return (
                <ViroNode
                  key={id}
                  position={element.restPosition}
                  transformBehaviors={transformBehaviors as any}
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
                    onLoadEnd={() => console.log(`AR element loaded: ${id}`)}
                    onError={(event: any) =>
                      console.error(`AR element error (${id}):`, event)
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
        )}
      </ViroARImageMarker>
    </ViroARScene>
  );
}
