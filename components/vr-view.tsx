import {
  Viro360Image,
  Viro3DObject,
  ViroARScene,
  ViroAmbientLight,
  ViroMaterials,
  ViroNode,
  ViroSpotLight,
  ViroText,
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
  const [distance, setDistance] = useState<number>(0);
  const modelPosition: [number, number, number] = [0, -0.5, -2];

  const handleCameraTransform = (cameraTransform: any) => {
    const camPos = cameraTransform.cameraTransform.position;
    const dx = camPos[0] - modelPosition[0];
    const dy = camPos[1] - modelPosition[1];
    const dz = camPos[2] - modelPosition[2];
    setDistance(Math.sqrt(dx * dx + dy * dy + dz * dz));
  };

  return (
    <ViroARScene onCameraTransformUpdate={handleCameraTransform}>
      {/* 360 background — rendered first */}
      <Viro360Image source={require("@/assets/models/hospital_room.jpg")} />

      {/* Lighting — increase intensity so model is visible against 360 */}
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

      {/* 3D model — larger scale, closer position */}
      <ViroNode position={modelPosition}>
        <Viro3DObject
          source={require("@/assets/models/neonatalXR.glb")}
          type="GLB"
          scale={[1.6, 1.6, 1.6]}
          position={[0, -0.9, 0]}
          rotation={[0, 0, 0]}
          onLoadStart={() => console.log("VR model loading...")}
          onLoadEnd={() => console.log("VR model loaded!")}
          onError={(event: any) => console.error("VR model error:", event)}
        />

        <ViroText
          text={`${distance.toFixed(1)}m away`}
          position={[0, 0.5, 0]}
          scale={[0.2, 0.2, 0.2]}
          style={{
            fontSize: 14,
            color: "#FFFFFF",
            fontWeight: "bold",
            textAlign: "center",
          }}
          outerStroke={{ type: "Outline", width: 2, color: "#000000" }}
        />
      </ViroNode>
    </ViroARScene>
  );
}
