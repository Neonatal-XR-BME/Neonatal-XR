import {
  Viro360Image,
  Viro3DObject,
  ViroAmbientLight,
  ViroNode,
  ViroQuad,
  ViroScene,
  ViroSpotLight,
  ViroText,
} from "@reactvision/react-viro";
import React, { useState } from "react";

// Degrees the model turns per click.
const STEP = 30;

/**
 * Gaze-controlled VR room scene for Google Cardboard / Shinecon (Android GVR).
 *
 * Interaction model: the user looks at a floating arrow (gaze) and presses the
 * Bluetooth remote, which Android delivers as a mouse click and Viro surfaces
 * as onClick — the same path as the Cardboard trigger. Each arrow rotates the
 * warmer about an axis. A small center reticle shows the gaze point.
 *
 * Why gaze + click and not direct remote-to-rotation: the remote only emits
 * BTN_MOUSE (a click), no directional/movement events, so direction comes from
 * where the user looks, and the click commits the rotation.
 */

type Axis = "x" | "y";

function ArrowTarget({
  label,
  position,
  onPress,
}: {
  label: string;
  position: [number, number, number];
  onPress: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <ViroNode position={position}>
      {/* Invisible-ish backing quad gives a comfortable gaze/click area */}
      <ViroQuad
        height={0.5}
        width={0.5}
        materials={hovered ? ["arrowActive"] : ["arrowIdle"]}
        onHover={(isHovering: boolean) => setHovered(isHovering)}
        onClick={() => onPress()}
      />
      <ViroText
        text={label}
        position={[0, 0, 0.01]}
        scale={[0.5, 0.5, 0.5]}
        style={{
          fontSize: 36,
          color: hovered ? "#FFD60A" : "#FFFFFF",
          fontWeight: "bold",
          textAlign: "center",
        }}
        outerStroke={{ type: "Outline", width: 2, color: "#000000" }}
      />
    </ViroNode>
  );
}

export default function VRRoomScene() {
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);

  const rotate = (axis: Axis, dir: number) => {
    if (axis === "x") setRotX((r) => r + dir * STEP);
    else setRotY((r) => r + dir * STEP);
  };

  return (
    <ViroScene>
      <Viro360Image source={require("@/assets/models/hospital_room.jpg")} />
      <ViroAmbientLight color="#FFFFFF" intensity={500} />
      <ViroSpotLight
        position={[0, 5, 0]}
        direction={[0, -1, 0]}
        color="#ffffff"
        intensity={800}
      />

      {/* Warmer model, rotated by gaze+click */}
      <ViroNode position={[0, -0.5, -2]} rotation={[rotX, rotY, 0]}>
        <Viro3DObject
          source={require("@/assets/models/neonatalXR.glb")}
          type="GLB"
          scale={[1.6, 1.6, 1.6]}
          position={[0, -0.9, 0]}
          onError={(e: any) => console.error("VR model error:", e)}
        />
      </ViroNode>

      {/* Arrow controls around the model */}
      <ArrowTarget
        label="<"
        position={[-1.4, -0.5, -2]}
        onPress={() => rotate("y", -1)}
      />
      <ArrowTarget
        label=">"
        position={[1.4, -0.5, -2]}
        onPress={() => rotate("y", 1)}
      />
      <ArrowTarget
        label="^"
        position={[0, 0.6, -2]}
        onPress={() => rotate("x", -1)}
      />
      <ArrowTarget
        label="v"
        position={[0, -1.6, -2]}
        onPress={() => rotate("x", 1)}
      />

      {/* Center gaze reticle: a small dot fixed in front of the camera */}
      <ViroNode position={[0, 0, -1]}>
        <ViroQuad height={0.015} width={0.015} materials={["reticle"]} />
      </ViroNode>
    </ViroScene>
  );
}
