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

const pages = [
  {
    title: "Web Interface",
    body: "Noosi has a web interface in which Doctors interact with and monitor patient vitals and drug administration. They input patient drug details and Noosi can be controlled remotely with the interface.",
  },
  {
    title: "Microcontrollers",
    body: "Noosi is composed majorly of two microcontrollers, ESP 32 cam, and ESP 32. The ESP 32 cam transmits live feed to the interface to help the doctors control it remotely.",
  },
  {
    title: "System Brain",
    body: "The ESP 32 is the brain of the Noosi system. It collects the patients vitals, and controls all the Noosi sensors. Noosi comprises of 5 DC motors, 4 of which Noosi uses to move around and the last one used to control the drug dispensing mechanism.",
  },
];

export default function ElectricalVRRoomScene() {
  const [modelHovered, setModelHovered] = useState(false);
  const [showSequence, setShowSequence] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const openSequence = () => {
    setPageIndex(0);
    setShowSequence(true);
  };

  const nextPage = () => {
    if (pageIndex < pages.length - 1) {
      setPageIndex((current) => current + 1);
      return;
    }

    setShowSequence(false);
    setPageIndex(0);
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

      <ViroNode position={[0, -0.5, -1.5]}>
        <Viro3DObject
          source={require("@/assets/models/3D/noosi_circuit.glb")}
          type="GLB"
          scale={[0.4, 0.4, 0.4]}
          position={[0, -1.9, 0.25]}
          onHover={(isHovering: boolean) => setModelHovered(isHovering)}
          onClick={openSequence}
          onError={(e: any) => console.error("VR model error:", e)}
        />

        {modelHovered && !showSequence && (
          <ViroNode position={[0, 0.55, 0]} transformBehaviors={["billboardY"]}>
            <ViroQuad height={0.3} width={1.0} materials={["arrowActive"]} />
            <ViroText
              text="Click to inspect Noosi"
              position={[0, 0, 0.01]}
              scale={[0.18, 0.18, 0.18]}
              style={{
                fontSize: 20,
                color: "#FFFFFF",
                fontWeight: "700",
                textAlign: "center",
              }}
              outerStroke={{ type: "Outline", width: 2, color: "#000000" }}
            />
          </ViroNode>
        )}
      </ViroNode>

      {showSequence && (
        <ViroNode
          position={[0, 0.35, -1.8]}
          transformBehaviors={["billboardY"]}
        >
          <ViroQuad height={1.0} width={1.6} materials={["infoPanel"]} />
          <ViroText
            text={`${pages[pageIndex].title}\n\n${pages[pageIndex].body}`}
            position={[0, 0.16, 0.01]}
            scale={[0.18, 0.18, 0.18]}
            style={{
              fontSize: 18,
              color: "#FFFFFF",
              fontWeight: "600",
              textAlign: "center",
            }}
            outerStroke={{ type: "Outline", width: 2, color: "#000000" }}
          />

          <ViroNode position={[0, -0.33, 0.01]} onClick={nextPage}>
            <ViroQuad height={0.18} width={0.5} materials={["arrowActive"]} />
            <ViroText
              text={pageIndex < pages.length - 1 ? "NEXT" : "CLOSE"}
              position={[0, 0, 0.01]}
              scale={[0.12, 0.12, 0.12]}
              style={{
                fontSize: 18,
                color: "#FFFFFF",
                fontWeight: "700",
                textAlign: "center",
              }}
            />
          </ViroNode>
        </ViroNode>
      )}

      <ViroNode position={[0, 0, -1]}>
        <ViroQuad height={0.015} width={0.015} materials={["reticle"]} />
      </ViroNode>
    </ViroScene>
  );
}
