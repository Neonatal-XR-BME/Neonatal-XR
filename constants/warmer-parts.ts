// Scene + part definitions for the interactive neonatal warmer VR experience.
//
// The warmer is now composed of 5 module GLBs (split from the original scan).
// All modules load at the same position and reassemble the full warmer.
// Each module is directly tappable:
//   - overview scene: tapping a module navigates to its detail scene
//     (or shows an info card for modules without a scene, like the tray)
//   - detail scenes: the focused module is fully visible, others are dimmed;
//     sub-part hotspots provide component-level tooltips
//
// Hotspot `position` values are in the LOCAL space of the model's parent
// ViroNode. Tune them by eye until each marker hugs its part.

export type Vec3 = [number, number, number];

export type ModuleId = "heater" | "bassinet" | "controller" | "tray" | "stand";

export type SceneKey = "overview" | "heater" | "bassinet" | "controller";

export type WarmerModule = {
  id: ModuleId;
  label: string;
  description: string;
  /** Scene to open when this module is tapped in the overview (optional) */
  targetScene?: SceneKey;
  /**
   * Where the module attaches to the stand, in the model's local space.
   * Derived from the scan's actual module centroids. Used as the start
   * point of the exploded-view guide line and as the label anchor.
   */
  anchor: Vec3;
  /**
   * Removal-path offset applied in exploded view, in model-local axes.
   * Mimics how the part physically comes off: heater lifts up the pole,
   * tray and controller pull out sideways, bassinet slides forward.
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
    anchor: [0, 0.03, -0.91],
    explodeOffset: [0, 0, -0.45], // lifts UP off the pole (model up = -Z)
    explodeDelay: 600,
  },
  bassinet: {
    id: "bassinet",
    label: "Baby Carriage (Bassinet)",
    description: "Tap to explore the bassinet and mattress platform.",
    targetScene: "bassinet",
    anchor: [0.01, 0.03, -0.48],
    explodeOffset: [0, 0.45, 0], // slides FORWARD off the column
    explodeDelay: 400,
  },
  controller: {
    id: "controller",
    label: "Control Panel",
    description: "Tap to explore the controller and alarm system.",
    targetScene: "controller",
    anchor: [0.03, -0.15, -0.69],
    explodeOffset: [0.5, 0, 0], // pulls out to the side
    explodeDelay: 200,
  },
  tray: {
    id: "tray",
    label: "Instrument Tray",
    description:
      "Side shelf for instruments and supplies, keeping essentials within the caregiver's reach during procedures.",
    anchor: [-0.19, -0.07, -0.71],
    explodeOffset: [-0.5, 0, 0], // slides out on its own side
    explodeDelay: 0,
  },
  stand: {
    id: "stand",
    label: "Stand & IV Pole",
    description:
      "Support column, legs and casters that carry the unit, plus the IV pole hooks for fluid bags. Casters lock to keep the warmer stationary.",
    anchor: [0, 0, -0.3],
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
  /** Hotspot position relative to the model node */
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

export const WARMER_SCENES: Record<SceneKey, WarmerScene> = {
  // ----- SCENE 1: principal / overview -----
  overview: {
    key: "overview",
    title: "Neonatal Warmer Overview",
    subtitle: "Tap a part of the warmer to explore it",
    modelPosition: [0, -0.5, -2],
    modelScale: [1.6, 1.6, 1.6],
    modelRotation: [0, 0, 0],
    // No floating nav markers anymore: the modules themselves are tappable.
    parts: [],
  },

  // ----- SCENE 2: heater -----
  heater: {
    key: "heater",
    title: "Radiant Heater Unit",
    subtitle: "Tap a marker to learn what each component does",
    focusModule: "heater",
    modelPosition: [0, -1.2, -1.6],
    modelScale: [2.2, 2.2, 2.2],
    modelRotation: [0, 0, 0],
    parts: [
      {
        id: "heating-element",
        label: "Heating Element",
        description:
          "Quartz/ceramic radiant element that emits infrared energy downward to warm the infant without warming the surrounding air.",
        position: [0, 0.95, 0],
      },
      {
        id: "reflector",
        label: "Parabolic Reflector",
        description:
          "Focuses and evenly distributes infrared radiation across the mattress area so there are no hot or cold spots.",
        position: [0.15, 0.9, 0.05],
      },
      {
        id: "heater-guard",
        label: "Protective Grill",
        description:
          "Metal guard that prevents accidental contact with the hot element and stops objects falling onto the infant.",
        position: [0, 0.82, 0.1],
      },
    ],
  },

  // ----- SCENE 3: baby carriage / bassinet -----
  bassinet: {
    key: "bassinet",
    title: "Baby Carriage (Bassinet)",
    subtitle: "Tap a marker to learn what each component does",
    focusModule: "bassinet",
    modelPosition: [0, -0.3, -1.4],
    modelScale: [2.0, 2.0, 2.0],
    modelRotation: [0, 0, 0],
    parts: [
      {
        id: "mattress",
        label: "Mattress Platform",
        description:
          "X-ray translucent platform that supports the infant. Often tiltable (Trendelenburg / reverse) for clinical procedures.",
        position: [0, -0.15, 0.2],
      },
      {
        id: "side-panels",
        label: "Drop-down Side Panels",
        description:
          "Transparent side walls that keep the infant safe while allowing observation. They fold down for full access during procedures.",
        position: [0.35, -0.05, 0.2],
      },
      {
        id: "skin-probe",
        label: "Skin Temperature Probe",
        description:
          "Sensor attached to the infant's skin. Feeds temperature readings to the controller for servo (baby-controlled) mode.",
        position: [-0.2, -0.12, 0.25],
      },
    ],
  },

  // ----- SCENE 4: controller -----
  controller: {
    key: "controller",
    title: "Control Panel",
    subtitle: "Tap a marker to learn what each component does",
    focusModule: "controller",
    modelPosition: [-0.4, -0.5, -1.3],
    modelScale: [2.2, 2.2, 2.2],
    modelRotation: [0, -20, 0],
    parts: [
      {
        id: "display",
        label: "Temperature Display",
        description:
          "Shows set temperature, measured skin temperature, and heater output percentage at a glance.",
        position: [0.45, 0.15, 0.2],
      },
      {
        id: "mode-select",
        label: "Mode Selector",
        description:
          "Switches between Manual mode (fixed heater power) and Servo mode (auto-adjusts power based on the skin probe).",
        position: [0.45, 0.05, 0.2],
      },
      {
        id: "alarms",
        label: "Alarm System",
        description:
          "Audible and visual alarms for high/low temperature, probe failure, and power interruption to keep the infant safe.",
        position: [0.52, 0.1, 0.2],
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
