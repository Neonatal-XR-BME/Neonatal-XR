import {
  Viro360Image,
  Viro3DObject,
  ViroARScene,
  ViroAmbientLight,
  ViroNode,
  ViroSpotLight,
} from "@reactvision/react-viro";
import React from "react";

export default function VRRoomScene() {
  return (
    <ViroARScene>
      <Viro360Image source={require("@/assets/models/hospital_room.jpg")} />
      <ViroAmbientLight color="#FFFFFF" intensity={500} />
      <ViroSpotLight
        position={[0, 5, 0]}
        direction={[0, -1, 0]}
        color="#ffffff"
        intensity={800}
      />
      <ViroNode position={[0, -0.5, -2]}>
        <Viro3DObject
          source={require("@/assets/models/neonatalXR.glb")}
          type="GLB"
          scale={[1.6, 1.6, 1.6]}
          position={[0, -0.9, 0]}
          onError={(e: any) => console.error("VR model error:", e)}
        />
      </ViroNode>
    </ViroARScene>
  );
}
