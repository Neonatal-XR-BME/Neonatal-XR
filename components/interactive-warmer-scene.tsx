import {
  MODULE_ORDER,
  ModuleId,
  SceneKey,
  Vec3,
  WARMER_MODULES,
  WARMER_SCENES,
  WarmerPart,
} from "@/constants/warmer-parts";
import {
  Viro360Image,
  Viro3DObject,
  ViroAmbientLight,
  ViroAnimations,
  ViroARScene,
  ViroMaterials,
  ViroNode,
  ViroPolyline,
  ViroSphere,
  ViroSpotLight,
  ViroText,
} from "@reactvision/react-viro";
import React from "react";

// The 5 module GLBs split from the original scan. Exported in place,
// so loading all of them at the same position reassembles the warmer.
const MODULE_SOURCES: Record<ModuleId, any> = {
  heater: require("@/assets/models/heater_module.glb"),
  bassinet: require("@/assets/models/bassinet_module.glb"),
  controller: require("@/assets/models/controller_module.glb"),
  tray: require("@/assets/models/tray_module.glb"),
  stand: require("@/assets/models/stand_module.glb"),
};

const DIMMED_OPACITY = 0.3; // non-focused modules in detail scenes

ViroMaterials.createMaterials({
  hotspot: { diffuseColor: "#00A651", lightingModel: "Constant" },
  hotspotSelected: { diffuseColor: "#FFD60A", lightingModel: "Constant" },
  guideLine: { diffuseColor: "#9BE7C4", lightingModel: "Constant" },
});

// Per-module explode/assemble animations. Registered once from the
// offsets in WARMER_MODULES so the data file stays the single source
// of truth for removal paths.
const animationDefs: Record<string, any> = {
  pulseUp: {
    properties: { scaleX: 1.3, scaleY: 1.3, scaleZ: 1.3 },
    duration: 600,
    easing: "EaseInEaseOut",
  },
  pulseDown: {
    properties: { scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0 },
    duration: 600,
    easing: "EaseInEaseOut",
  },
  pulse: [["pulseUp", "pulseDown"]] as unknown as any,
};
MODULE_ORDER.forEach((id) => {
  const [ox, oy, oz] = WARMER_MODULES[id].explodeOffset;
  animationDefs[`explode_${id}`] = {
    properties: { positionX: ox, positionY: oy, positionZ: oz },
    duration: 700,
    easing: "EaseInEaseOut",
  };
  animationDefs[`assemble_${id}`] = {
    properties: { positionX: 0, positionY: 0, positionZ: 0 },
    duration: 700,
    easing: "EaseInEaseOut",
  };
});
ViroAnimations.registerAnimations(animationDefs);

const MAX_DELAY = Math.max(
  ...MODULE_ORDER.map((id) => WARMER_MODULES[id].explodeDelay)
);

// viroAppProps contract between the RN layer (app/vrscene.tsx) and this scene
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

function addVec(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function Hotspot({
  part,
  isSelected,
  onClick,
}: {
  part: WarmerPart;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <ViroNode position={part.position} onClick={onClick}>
      <ViroSphere
        radius={0.045}
        materials={[isSelected ? "hotspotSelected" : "hotspot"]}
        opacity={0.85}
        animation={{ name: "pulse", run: true, loop: true }}
      />
      <ViroText
        text={part.label}
        position={[0, 0.09, 0]}
        scale={[0.18, 0.18, 0.18]}
        style={{
          fontSize: 16,
          color: "#FFFFFF",
          fontWeight: "bold",
          textAlign: "center",
        }}
        outerStroke={{ type: "Outline", width: 2, color: "#000000" }}
        transformBehaviors={["billboard"]}
      />
    </ViroNode>
  );
}

export default function InteractiveWarmerScene(props: ViroSceneProps) {
  const { sceneKey, exploded, selectedPartId, onSelectPart, onNavigate } =
    props.sceneNavigator.viroAppProps;

  const scene = WARMER_SCENES[sceneKey] ?? WARMER_SCENES.overview;
  const isOverview = scene.key === "overview";

  const handleModuleClick = (moduleId: ModuleId) => {
    const mod = WARMER_MODULES[moduleId];
    if (mod.targetScene && mod.targetScene !== scene.key) {
      onNavigate(mod.targetScene);
      return;
    }
    onSelectPart({
      id: `module-${mod.id}`,
      label: mod.label,
      description: mod.description,
      position: [0, 0, 0],
    });
  };

  return (
    <ViroARScene>
      {/* 360 background */}
      <Viro360Image source={require("@/assets/models/hospital_room.jpg")} />

      {/* Lighting */}
      <ViroAmbientLight color="#FFFFFF" intensity={500} />
      <ViroSpotLight
        position={[0, 5, 0]}
        direction={[0, -1, 0]}
        color="#ffffff"
        intensity={800}
        castsShadow={true}
      />
      <ViroSpotLight
        position={[0, 0, 5]}
        direction={[0, 0, -1]}
        color="#ffffff"
        intensity={400}
      />

      <ViroNode
        position={scene.modelPosition}
        scale={scene.modelScale}
        rotation={scene.modelRotation}
      >
        {/* Same [0,-0.9,0] offset the single model used, so the existing
            per-scene framing presets still apply */}
        <ViroNode position={[0, -0.9, 0]}>
          {MODULE_ORDER.map((moduleId) => {
            const mod = WARMER_MODULES[moduleId];
            const isFocused =
              !scene.focusModule || scene.focusModule === moduleId;
            const isAnchor = mod.explodeOffset.every((v) => v === 0);

            // Explode delays run smallest-first (tray, controller,
            // bassinet, heater); assembling runs in reverse order.
            const delay = exploded
              ? mod.explodeDelay
              : MAX_DELAY - mod.explodeDelay;

            return (
              <ViroNode
                key={moduleId}
                animation={{
                  name: exploded
                    ? `explode_${moduleId}`
                    : `assemble_${moduleId}`,
                  run: true,
                  delay,
                }}
              >
                <Viro3DObject
                  source={MODULE_SOURCES[moduleId]}
                  type="GLB"
                  opacity={isFocused ? 1.0 : DIMMED_OPACITY}
                  onClick={() => handleModuleClick(moduleId)}
                  onLoadEnd={() => console.log(`module loaded: ${moduleId}`)}
                  onError={(event: any) =>
                    console.error(`module error (${moduleId}):`, event)
                  }
                />
              </ViroNode>
            );
          })}

          {/* Exploded-view extras: guide lines back to the attachment
              point, plus tappable billboard labels per separated module */}
          {exploded &&
            MODULE_ORDER.map((moduleId) => {
              const mod = WARMER_MODULES[moduleId];
              if (mod.explodeOffset.every((v) => v === 0)) return null;
              const end = addVec(mod.anchor, mod.explodeOffset);
              return (
                <ViroNode key={`guide-${moduleId}`}>
                  <ViroPolyline
                    points={[mod.anchor, end]}
                    thickness={0.006}
                    materials={["guideLine"]}
                    opacity={0.8}
                  />
                  <ViroNode
                    position={addVec(end, [0, 0, -0.12])}
                    onClick={() => handleModuleClick(moduleId)}
                  >
                    <ViroText
                      text={mod.label}
                      scale={[0.22, 0.22, 0.22]}
                      style={{
                        fontSize: 16,
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                      outerStroke={{
                        type: "Outline",
                        width: 2,
                        color: "#000000",
                      }}
                      transformBehaviors={["billboard"]}
                    />
                  </ViroNode>
                </ViroNode>
              );
            })}
        </ViroNode>

        {/* Sub-part hotspots for the current detail scene */}
        {!isOverview &&
          scene.parts.map((part) => (
            <Hotspot
              key={part.id}
              part={part}
              isSelected={selectedPartId === part.id}
              onClick={() => onSelectPart(part)}
            />
          ))}
      </ViroNode>
    </ViroARScene>
  );
}
