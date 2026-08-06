// Element-level manifest for the new, higher-fidelity part set (separate
// .obj/.mtl per physical component, exported from Fusion/Inventor via
// Autodesk ATF). This is a finer-grained sibling to constants/warmer-parts.ts
// -- that file drives the 5-module explode view on the OLD single-scan
// model; this one drives per-element focus/explode on the NEW part set.
//
// COORDINATE SYSTEM (measured directly from the .obj files, source units = cm):
//   - Height is +Z (taller = higher Z). This is the OPPOSITE of the old scan
//     model, which was Z-up-NEGATIVE. Don't reuse old sign conventions.
//   - Front (caregiver-facing side) is -X, confirmed by Abdul and consistent
//     with Control_Board sitting at the most-negative X of any part.
//   - Side/depth is Y.
//   - Scale: these files are in cm, Viro works in meters, so apply a uniform
//     0.01 scale on the wrapper node. Do NOT reuse the old model's 0.05
//     scale constant -- that was calibrated for a different source model.
//   - Axis-up fix: Abdul found a 90 degree rotation on X is needed in
//     Blender to align these (CAD Z-up -> Viro/AR Y-up). Sign not yet
//     confirmed for Viro (old model used [-90,0,0]) -- apply once on a
//     single wrapper ViroNode around ALL elements, test in AR, flip if the
//     assembly renders upside down or on its side.
//
// ASSEMBLY FRAME:
//   Five of six parts were exported "in place" and share one coordinate
//   frame -- load them all at restPosition [0,0,0] and they reassemble
//   correctly, same trick the old MODULE_SOURCES setup used for the GLBs.
//   bed_bassinet is the one exception: it was exported at its own local
//   origin (bbox starts at [0,0,0] instead of sharing the ~z:97-172 frame
//   the rest of the bassinet/heater assembly sits in). restPosition below
//   is a COMPUTED offset (aligning its footprint to bassinet_shields' inner
//   corner), not a measured one -- confirm visually once this loads.
//
// STILL MISSING: support_frame.obj (only the .mtl was sent). This is very
// likely the main vertical column connecting wheels -> the rest of the
// stack; collimator_support (thin, 75cm tall, spans z:97.5-172.5) looks
// like a separate mounting rail for the heater head, not the main column.
// Treat support_frame as part of the "stand" module once it arrives.
//
// PERFORMANCE WARNING: wheels.obj (89,664 verts / 179,360 tris) and
// collimator_support.obj (65,944 verts / 131,888 tris) are raw CAD
// tessellation -- ~300k triangles between just these two parts. Decimate
// in Blender (or re-export at coarser tessellation) before shipping in the
// AR app; this will hurt load time and frame rate on-device as-is.

export type Vec3 = [number, number, number];

export type ElementId =
  | "wheels"
  | "support_frame" // pending -- file not yet provided
  | "real_bed_bassinet"
  | "bassinet_shields"
  | "control_board"
  | "collimator_support"
  | "collimator_dissemble";

export type ElementModuleId = "stand" | "bassinet" | "controller" | "heater";

export interface WarmerElement {
  id: ElementId;
  label: string;
  module: ElementModuleId;
  /** Filenames only -- place alongside their .mtl in assets/models/ */
  glbFile: string;
  materials: string[];
  /** Named sub-meshes/groups inside this OBJ -- useful for finer hotspots later */
  groups: string[];
  vertexCount: number;
  faceCount: number;
  bbox: { min: Vec3; max: Vec3 };
  /** bbox center, in this element's own file-local coordinates */
  centroid: Vec3;
  /**
   * Offset to apply so this element sits correctly in the shared assembly
   * frame. [0,0,0] for elements exported in place. Non-zero currently only
   * for bed_bassinet (see ASSEMBLY FRAME note above).
   */
  restPosition: Vec3;
  /**
   * Removal-path offset applied ON TOP of restPosition when exploded.
   * FIRST-PASS DIRECTIONAL GUESSES based on -X=front, +Z=up, Y=side --
   * not yet confirmed in AR/Blender. Magnitudes are rough (cm, pre-0.01
   * scale) sized off each part's own bbox. Tune visually once loaded.
   */
  explodeOffset: Vec3 | null;
  explodeDelay: number;
  notes?: string;
}

export const WARMER_ELEMENTS: Record<ElementId, WarmerElement> = {
  wheels: {
    id: "wheels",
    label: "Casters & Base",
    module: "stand",
    glbFile: "Wheels.glb",
    materials: ["Steel_-_Satin"],
    groups: [], // ~76 CAD "Body" sub-parts (individual bolts/washers/etc.) -- too granular to list here
    vertexCount: 89664,
    faceCount: 179360,
    bbox: { min: [-63.302, -6.696, -11.525], max: [3.302, 52.6335, 5.9375] },
    centroid: [-30.0, 22.9688, -2.7938],
    restPosition: [0, 0, 0],
    explodeOffset: [0, -15, 0], // fixed anchor of the assembly, like "stand" in the old model
    explodeDelay: 300,
    notes:
      "The wheeled base the whole warmer stands on. Lockable casters let staff roll the unit between rooms and hold it steady at the bedside.",
  },

  support_frame: {
    id: "support_frame",
    label: "Support Frame / Column",
    module: "stand",
    glbFile: "support_frame.glb",
    materials: [
      "Aluminum_-_Anodized_Glossy_(Grey)",
      "Steel_-_Satin",
      "Aluminum_-_Anodized_Rough_(Grey)",
    ],
    groups: [],
    vertexCount: 0,
    faceCount: 0,
    bbox: { min: [0, 0, 0], max: [0, 0, 0] },
    centroid: [0, 0, 0],
    restPosition: [0, 0, 0],
    explodeOffset: [0, -10, 0], // likely near-anchor like wheels, revisit once geometry is known
    explodeDelay: 400,
    notes:
      "The vertical column that carries the load from the base up to the bassinet and heater head, holding the radiant warmer at the right height above the baby.",
  },

  real_bed_bassinet: {
    id: "real_bed_bassinet",
    label: "Mattress Platform",
    module: "bassinet",
    glbFile: "Real_Bed_Bassinet.glb",
    materials: ["Acrylic_(Clear)", "Fabric_(White)"],
    groups: ["Body1", "Body2"],
    vertexCount: 144,
    faceCount: 284,
    bbox: { min: [0, 0, 0], max: [58, 40, 6] },
    centroid: [29.0, 20.0, 3.0],
    // COMPUTED, not measured -- nests the mattress footprint inside
    // bassinet_shields' inner-corner. Confirm visually.
    restPosition: [0, 0, 0],
    explodeOffset: [0, 40, 0], // slides toward the front (-X) with the shields
    explodeDelay: 400,
    notes:
      "The padded platform the newborn lies on. Positioned directly under the radiant heater so warmth reaches the baby evenly, and sized to keep the infant within reach for care.",
  },

  bassinet_shields: {
    id: "bassinet_shields",
    label: "Bassinet Side Shields",
    module: "bassinet",
    glbFile: "Bassinet_Shields.glb",
    materials: ["Acrylic_(Clear)"],
    groups: [
      "bassinet shield back",
      "bassinet shield front",
      "bassinet shield left",
      "bassinet shield right",
      "bassinet base",
    ],
    vertexCount: 262,
    faceCount: 504,
    bbox: {
      min: [-60.1433, -0.0647, 97.8863],
      max: [0.3269, 46.1557, 128.3566],
    },
    centroid: [-29.9082, 23.0455, 113.1214],
    restPosition: [0, 0, 0],
    explodeOffset: [0, 0, 0], // slides toward the front (-X), same direction as the mattress
    explodeDelay: 400,
    notes:
      "Clear acrylic walls on all four sides of the bassinet. They stop the baby from rolling out, cut down on draughts, and stay transparent so staff keep a full view of the infant.",
  },

  control_board: {
    id: "control_board",
    label: "Control Panel",
    module: "controller",
    glbFile: "Control_Board.glb",
    materials: [
      "Plastic_-_Textured_-_Regular",
      "Display_-_4x20_-_LCD_(White_on_Blue)",
      "LED_(Red)",
      "LED_(Green)",
      "LED_(Blue)",
    ],
    groups: ["control board", "Body23", "Body25", "Body26", "Body27"],
    vertexCount: 418,
    faceCount: 816,
    bbox: { min: [-37.5, -6.0647, 102.5], max: [-22.5, -0.0647, 112.5] },
    centroid: [-30.0, -3.0647, 107.5],
    restPosition: [0, 0, 0],
    explodeOffset: [0, 0, 20], // pulls out along Y, its thin/mount axis
    explodeDelay: 200,
    notes:
      "The operator's interface. Its display and status LEDs show the set and measured temperature, and the controls let staff adjust the target and respond to alarms.",
  },

  collimator_support: {
    id: "collimator_support",
    label: "Heater Mounting Rail",
    module: "heater",
    glbFile: "Collimator_support.glb    ",
    materials: ["Steel_-_Satin"],
    groups: ["r right vertical (4)", "r right vertical (4) (1)"],
    vertexCount: 65944,
    faceCount: 131888,
    bbox: {
      min: [-41.0131, 22.5456, 97.4966],
      max: [0.9668, 24.5454, 172.4964],
    },
    centroid: [-20.0231, 23.5455, 134.9965],
    restPosition: [0, 0, 0],
    explodeOffset: [0, 32, 0], // lifts up (+Z) with the heater head
    explodeDelay: 400,
    notes:
      "The arm that holds the radiant heater head out over the mattress, keeping the heat source aimed down at the baby from a safe, fixed distance.",
  },

  collimator_dissemble: {
    id: "collimator_dissemble",
    label: "Radiant Heater Head",
    module: "heater",
    glbFile: "Collimator_dissemble.glb",
    materials: ["ABS_(White)"],
    groups: ["Body1"],
    vertexCount: 179,
    faceCount: 354,
    bbox: { min: [-47.0, 14.7043, 161.0], max: [-2.0, 30.2957, 170.9536] },
    centroid: [-24.5, 22.5, 165.9768],
    restPosition: [0, 0, 0],
    explodeOffset: [0, 30, 0], // lifts up (+Z), further than the rail beneath it
    explodeDelay: 600,
    notes:
      "The radiant heater at the top of the unit. It delivers infrared warmth down onto the mattress, and the controller drives it to hold the baby's temperature at the set point.",
  },
};

export const ELEMENT_ORDER: ElementId[] = [
  "wheels",
  "support_frame",
  "real_bed_bassinet",
  "bassinet_shields",
  "control_board",
  "collimator_support",
  "collimator_dissemble",
];

export const MODULE_ELEMENTS: Record<ElementModuleId, ElementId[]> = {
  heater: ["collimator_dissemble", "collimator_support"],
  bassinet: ["bassinet_shields", "real_bed_bassinet"],
  controller: ["control_board"],
  stand: ["support_frame", "wheels"],
};
