import SwipeableScreen from "@/components/swipeablewrapper";
import {
  Viro3DObject,
  ViroAmbientLight,
  ViroARScene,
  ViroARSceneNavigator,
  ViroImage,
  ViroNode,
  ViroSpotLight,
} from "@reactvision/react-viro";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// The AR Scene component
function NeonatalARScene() {
  const [scale, setScale] = useState<[number, number, number]>([
    0.01, 0.01, 0.01,
  ]);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [position, setPosition] = useState<[number, number, number]>([
    0, -0.5, -2,
  ]);

  return (
    <ViroARScene>
      {/* Lighting */}
      <ViroAmbientLight color="#FFFFFF" intensity={200} />
      <ViroSpotLight
        innerAngle={5}
        outerAngle={45}
        direction={[0, -1, -0.2]}
        position={[0, 3, 1]}
        color="#ffffff"
        castsShadow={true}
      />

      <ViroNode position={position}>
        {/* 3D Model */}
        <Viro3DObject
          source={require("@/assets/models/damn.obj")}
          resources={[require("@/assets/models/damn.mtl")]}
          type="OBJ"
          scale={scale}
          rotation={rotation}
          onDrag={() => {}}
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
              setRotation((prev) => [
                prev[0],
                prev[1] + rotationFactor,
                prev[2],
              ]);
            }
          }}
        />

        {/* Logo floating above the model */}
        <ViroImage
          source={require("@/assets/models/logo.jpg")}
          position={[0, 1.5, 0]}
          height={0.3}
          width={0.3}
        />
      </ViroNode>
    </ViroARScene>
  );
}

// Main AR View screen
export default function ARView() {
  const [arEnabled, setArEnabled] = useState(false);

  return (
    <SafeAreaProvider>
      {arEnabled ? (
        <View style={{ flex: 1 }}>
          <ViroARSceneNavigator
            initialScene={{ scene: NeonatalARScene }}
            style={{ flex: 1 }}
          />
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => setArEnabled(false)}
          >
            <Text style={styles.exitText}>Exit AR</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SwipeableScreen>
          <SafeAreaView style={styles.container}>
            <View style={styles.content}>
              <Text style={styles.title}>AR View</Text>
              <Text style={styles.subtitle}>
                View the neonatal incubator in augmented reality
              </Text>
              <TouchableOpacity
                style={styles.arButton}
                onPress={() => setArEnabled(true)}
              >
                <Text style={styles.arButtonText}>Launch AR</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </SwipeableScreen>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F8",
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  arButton: {
    backgroundColor: "#0749FF",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 20,
  },
  arButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  exitButton: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  exitText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
