// Scene + part definitions for the interactive neonatal warmer VR experience.
//
// COORDINATE SYSTEM (measured from the scan GLB):
//   - The raw scan is Z-up-negative: floor at z=0, top of heater at z=-1.06.
//   - Model FRONT (control panel / caregiver side) is -Y.
//   - The scene stands the model upright with a [90,0,0] rotation wrapper,
//     so all anchors, explodeOffsets, and hotspot positions below are in
//     RAW MODEL SPACE and rotate together with the geometry.
//
// Measured module centroids (raw model space):
//   stand base [0.02, 0.01, -0.07] | column [0, 0, -0.34]
//   bassinet   [0.01, 0.04, -0.46] | tray   [-0.22, -0.08, -0.72]
//   controller [-0.01,-0.13, -0.73] | heater [0.01, 0.02, -0.92]

export type Vec3 = [number, number, number];

export type ModuleId = "heater" | "bassinet" | "controller" | "tray" | "stand";

export type SceneKey = "overview" | "heater" | "bassinet" | "controller";

export type WarmerModule = {
  id: ModuleId;
  label: string;
  description: string;
  /** Scene to open when this module is tapped in the overview (optional) */
  targetScene?: SceneKey;
  /** Module centroid in raw model space (start of guide line, label anchor) */
  anchor: Vec3;
  /**
   * Removal-path offset applied in exploded view, in raw model axes:
   *   up = -Z, front = -Y, tray side = -X.
   */
  explodeOffset: Vec3;
  /** Stagger delay (ms) so parts separate sequentially, not all at once */
  explodeDelay: number;
};

export const WARMER_MODULES: Record<ModuleId, WarmerModule> = {
  heater: {
    id: "heater",
    label: "Radiant Heater Unit",
    description: "Tap to explore the radiant heater assembly.",
    targetScene: "heater",
    anchor: [0.01, 0.02, -0.92],
    explodeOffset: [0, 0, -0.45], // lifts UP off the pole (model up = -Z)
    explodeDelay: 600,
  },
  bassinet: {
    id: "bassinet",
    label: "Baby Carriage (Bassinet)",
    description: "Tap to explore the bassinet and mattress platform.",
    targetScene: "bassinet",
    anchor: [0.01, 0.04, -0.46],
    explodeOffset: [0, -0.45, 0], // slides FORWARD off the column (front = -Y)
    explodeDelay: 400,
  },
  controller: {
    id: "controller",
    label: "Control Panel",
    description: "Tap to explore the controller and alarm system.",
    targetScene: "controller",
    anchor: [-0.01, -0.13, -0.73],
    explodeOffset: [0.5, 0, 0], // pulls out sideways (away from the tray side)
    explodeDelay: 200,
  },
  tray: {
    id: "tray",
    label: "Instrument Tray",
    description:
      "Side shelf for instruments and supplies, keeping essentials within the caregiver's reach during procedures.",
    anchor: [-0.22, -0.08, -0.72],
    explodeOffset: [-0.5, 0, 0], // slides out on its own side (-X)
    explodeDelay: 0,
  },
  stand: {
    id: "stand",
    label: "Stand & IV Pole",
    description:
      "Support column, legs and casters that carry the unit, plus the IV pole hooks for fluid bags. Casters lock to keep the warmer stationary.",
    anchor: [0.02, 0.01, -0.3],
    explodeOffset: [0, 0, 0], // the stand is the fixed anchor of the assembly
    explodeDelay: 0,
  },
};

export const MODULE_ORDER: ModuleId[] = [
  "heater",
  "bassinet",
  "controller",
  "tray",
  "stand",
];

export type WarmerPart = {
  id: string;
  label: string;
  description: string;
  /** Hotspot position in RAW MODEL SPACE (inside the rotation wrapper) */
  position: Vec3;
};

export type WarmerScene = {
  key: SceneKey;
  title: string;
  subtitle: string;
  /** Module visually focused in this scene; others get dimmed */
  focusModule?: ModuleId;
  /** Model transform preset for this scene (lets each scene "focus" a part) */
  modelPosition: Vec3;
  modelScale: Vec3;
  modelRotation: Vec3;
  parts: WarmerPart[];
};

// Framing math: with the [0,-0.9,0] inner offset and the upright wrapper,
// world height of a model point z is:  pos.y + scale * (-0.9 - z)
// (z is negative going up, so -z is the point's height above the floor).
export const WARMER_SCENES: Record<SceneKey, WarmerScene> = {
  // ----- SCENE 1: principal / overview -----
  overview: {
    key: "overview",
    title: "Neonatal Warmer Overview",
    subtitle: "Tap a part of the warmer to explore it",
    // Bigger: 1.6 -> 2.4. Lowered for handheld AR viewing (phone camera
    // height, not standing eye height).
    modelPosition: [0, -0.1, -2.4],
    modelScale: [2.4, 2.4, 2.4],
    modelRotation: [0, 0, 0],
    parts: [],
  },

  // ----- SCENE 2: heater -----
  heater: {
    key: "heater",
    title: "Radiant Heater Unit",
    subtitle: "Tap a marker to learn what each component does",
    focusModule: "heater",
    // Heater head (z=-0.92) near camera height, lowered for handheld AR
    modelPosition: [0, -0.4, -1.6],
    modelScale: [2.2, 2.2, 2.2],
    modelRotation: [0, 0, 0],
    parts: [
      {
        id: "heating-element",
        label: "Heating Element",
        description:
          "Quartz/ceramic radiant element that emits infrared energy downward to warm the infant without warming the surrounding air.",
        position: [0, 0.02, -0.96],
      },
      {
        id: "reflector",
        label: "Parabolic Reflector",
        description:
          "Focuses and evenly distributes infrared radiation across the mattress area so there are no hot or cold spots.",
        position: [0.06, 0.12, -0.93],
      },
      {
        id: "heater-guard",
        label: "Protective Grill",
        description:
          "Metal guard that prevents accidental contact with the hot element and stops objects falling onto the infant.",
        position: [0, 0.02, -0.85],
      },
    ],
  },

  // ----- SCENE 3: baby carriage / bassinet -----
  bassinet: {
    key: "bassinet",
    title: "Baby Carriage (Bassinet)",
    subtitle: "Tap a marker to learn what each component does",
    focusModule: "bassinet",
    // Bassinet (z=-0.46) near camera height, lowered for handheld AR
    modelPosition: [0, 0.4, -1.5],
    modelScale: [2.0, 2.0, 2.0],
    modelRotation: [0, 0, 0],
    parts: [
      {
        id: "mattress",
        label: "Mattress Platform",
        description:
          "X-ray translucent platform that supports the infant. Often tiltable (Trendelenburg / reverse) for clinical procedures.",
        position: [0, 0.04, -0.58],
      },
      {
        id: "side-panels",
        label: "Drop-down Side Panels",
        description:
          "Transparent side walls that keep the infant safe while allowing observation. They fold down for full access during procedures.",
        position: [0.15, 0.04, -0.55],
      },
      {
        id: "skin-probe",
        label: "Skin Temperature Probe",
        description:
          "Sensor attached to the infant's skin. Feeds temperature readings to the controller for servo (baby-controlled) mode.",
        position: [-0.08, -0.14, -0.55],
      },
    ],
  },

  // ----- SCENE 4: controller -----
  controller: {
    key: "controller",
    title: "Control Panel",
    subtitle: "Tap a marker to learn what each component does",
    focusModule: "controller",
    // Controller (z=-0.73) near camera height, lowered for handheld AR
    modelPosition: [0, 0, -1.4],
    modelScale: [2.2, 2.2, 2.2],
    modelRotation: [0, -20, 0],
    parts: [
      {
        id: "display",
        label: "Temperature Display",
        description:
          "Shows set temperature, measured skin temperature, and heater output percentage at a glance.",
        position: [0, -0.21, -0.75],
      },
      {
        id: "mode-select",
        label: "Mode Selector",
        description:
          "Switches between Manual mode (fixed heater power) and Servo mode (auto-adjusts power based on the skin probe).",
        position: [0.06, -0.21, -0.7],
      },
      {
        id: "alarms",
        label: "Alarm System",
        description:
          "Audible and visual alarms for high/low temperature, probe failure, and power interruption to keep the infant safe.",
        position: [-0.06, -0.21, -0.77],
      },
    ],
  },
};

export const SCENE_ORDER: SceneKey[] = [
  "overview",
  "heater",
  "bassinet",
  "controller",
];
