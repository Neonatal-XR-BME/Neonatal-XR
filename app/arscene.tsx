import {
  Viro3DObject,
  ViroAmbientLight,
  ViroARImageMarker,
  ViroARScene,
  ViroARSceneNavigator,
  ViroARTrackingTargets,
  ViroMaterials,
  ViroNode,
  ViroSpotLight,
  ViroText,
} from "@reactvision/react-viro";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

ViroARTrackingTargets.createTargets({
  logo: {
    source: require("@/assets/models/imgggg.webp"),
    orientation: "Up",
    physicalWidth: 0.1,
  },
});

ViroMaterials.createMaterials({
  steel: {
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

const DEFAULT_SCALE: [number, number, number] = [0.05, 0.05, 0.05];
const DEFAULT_ROTATION: [number, number, number] = [-90, 0, 0];
const DEFAULT_POSITION: [number, number, number] = [0, 0.05, 0];

function NeonatalARScene() {
  const [scale, setScale] = useState<[number, number, number]>([
    ...DEFAULT_SCALE,
  ]);
  const [rotation, setRotation] = useState<[number, number, number]>([
    ...DEFAULT_ROTATION,
  ]);
  const [position, setPosition] = useState<[number, number, number]>([
    ...DEFAULT_POSITION,
  ]);
  const [modelVisible, setModelVisible] = useState(false);
  const lastScaleRef = useRef<number>(1);
  const lastRotationRef = useRef<number>(0);

  const handlePinch = (
    pinchState: number,
    scaleFactor: number,
    source: any
  ) => {
    if (pinchState === 2) {
      const delta = scaleFactor / lastScaleRef.current;
      lastScaleRef.current = scaleFactor;
      setScale(
        (prev) =>
          prev.map((s) => Math.max(s * delta, 0.001)) as [
            number,
            number,
            number
          ]
      );
    } else if (pinchState === 3) {
      lastScaleRef.current = 1;
    }
  };

  const handleRotate = (
    rotateState: number,
    rotationFactor: number,
    source: any
  ) => {
    if (rotateState === 2) {
      const delta = rotationFactor - lastRotationRef.current;
      lastRotationRef.current = rotationFactor;
      setRotation(
        (prev) =>
          [prev[0], prev[1] + delta, prev[2]] as [number, number, number]
      );
    } else if (rotateState === 3) {
      lastRotationRef.current = 0;
    }
  };

  const resetModel = () => {
    setScale([...DEFAULT_SCALE]);
    setRotation([...DEFAULT_ROTATION]);
    setPosition([...DEFAULT_POSITION]);
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
        onAnchorFound={() => setModelVisible(true)}
        onAnchorRemoved={() => setModelVisible(false)}
      >
        {modelVisible && (
          <ViroNode position={position}>
            <Viro3DObject
              source={require("@/assets/models/neonatalXR.glb")}
              type="GLB"
              scale={scale}
              rotation={rotation}
              dragType="FixedToWorld"
              onDrag={() => {}}
              onPinch={handlePinch}
              onRotate={handleRotate}
            />
            <ViroText
              text="↺ Reset"
              position={[0, 0.25, 0]}
              scale={[0.15, 0.15, 0.15]}
              style={{ fontSize: 12, color: "#FFFFFF", fontWeight: "bold" }}
              outerStroke={{ type: "Outline", width: 2, color: "#000000" }}
              onClick={resetModel}
            />
          </ViroNode>
        )}
      </ViroARImageMarker>
    </ViroARScene>
  );
}

export default function ARSceneScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ViroARSceneNavigator
        initialScene={{ scene: NeonatalARScene }}
        style={{ flex: 1 }}
        autofocus={true}
        videoQuality="High"
      />
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.exitButton}
          onPress={() => router.back()}
        >
          <Text style={styles.exitText}>← Exit AR</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Check</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 10,
  },
  exitButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  exitText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  hint: {
    color: "#fff",
    fontSize: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    textAlign: "center",
  },
});
