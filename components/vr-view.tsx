import {
  Viro360Image,
  Viro3DObject,
  ViroARScene,
  ViroAmbientLight,
  ViroMaterials,
  ViroNode,
  ViroSpotLight,
} from "@reactvision/react-viro";
import { useState } from "react";

ViroMaterials.createMaterials({
  wood: {
    diffuseColor: "#8B5E3C",
    lightingModel: "Blinn",
    shininess: 0.3,
  },
  acrylic: {
    diffuseColor: "#D2A679",
    lightingModel: "Blinn",
    shininess: 0.2,
  },
});

export default function VRSceneWith3D() {
  const [scale, setScale] = useState<[number, number, number]>([
    0.01, 0.01, 0.01,
  ]);
  const [rotation, setRotation] = useState<[number, number, number]>([
    -90, 0, 0,
  ]);
  const [position, setPosition] = useState<[number, number, number]>([
    0, -1, -3,
  ]);

  return (
    <ViroARScene>
      <Viro360Image
        source={require("@/assets/models/hospital_room.jpg")}
        isHdr={false}
      />

      <ViroAmbientLight color="#FFFFFF" intensity={300} />
      <ViroSpotLight
        position={[0, 5, 0]}
        direction={[0, -1, 0]}
        color="#ffffff"
        intensity={500}
        castsShadow={true}
      />

      <ViroNode position={position}>
        <Viro3DObject
          source={require("@/assets/models/neonatalXR.glb")}
          type="GLB"
          scale={scale}
          rotation={rotation}
          onDrag={(dragToPos) => {
            setPosition(dragToPos as [number, number, number]);
          }}
          onPinch={(pinchState, scaleFactor) => {
            if (pinchState === 3) {
              setScale(
                (prev) =>
                  prev.map((s) =>
                    Math.min(Math.max(s * scaleFactor, 0.005), 0.05)
                  ) as [number, number, number]
              );
            }
          }}
          onRotate={(rotateState, rotationFactor) => {
            if (rotateState === 3) {
              setRotation(
                (prev) =>
                  [prev[0], prev[1] + rotationFactor, prev[2]] as [
                    number,
                    number,
                    number
                  ]
              );
            }
          }}
        />
      </ViroNode>
    </ViroARScene>
  );
}
