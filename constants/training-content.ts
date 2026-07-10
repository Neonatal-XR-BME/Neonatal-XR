// Training module content for the Neonatal Radiant Warmer.
//
// Domain content is drawn from publicly verifiable sources (NEST360 Biomedical
// Engineer Education Module, Fluke Biomedical testing guidance, UNICEF Supply
// specification, and multiple manufacturer/clinical references). It is written
// against a generic radiant-warmer baseline. If you anchor this app to a
// specific make/model, that device's service manual overrides this content.

export type ModuleKey =
  | "orientation"
  | "components"
  | "procedures"
  | "assessment";

export interface ModuleMeta {
  key: ModuleKey;
  index: string; // "01"
  title: string;
  blurb: string;
  accent: string; // header background
  icon: "book" | "cpu" | "gear" | "warning" | "check";
  route: string;
}

export const MODULES: ModuleMeta[] = [
  {
    key: "orientation",
    index: "01",
    title: "Orientation",
    blurb: "This is the overview of the device, how it works and the part",
    accent: "#BCD0F7",
    icon: "book",
    route: "/training/orientation",
  },
  {
    key: "components",
    index: "02",
    title: "Components and Logic",
    blurb: "This is the overview of the device, how it works and the part",
    accent: "#9EE9C5",
    icon: "cpu",
    route: "/training/components",
  },
  {
    key: "procedures",
    index: "03",
    title: "Procedures & Maintenances",
    blurb: "This is the overview of the device, how it works and the part",
    accent: "#BCD0F7",
    icon: "gear",
    route: "/training/procedures",
  },
  {
    key: "assessment",
    index: "04",
    title: "Assessment",
    blurb: "Symptom to cause reasoning and the safety rules that follow",
    accent: "#9EE9C5",
    icon: "warning",
    route: "/training/assessment",
  },
];

// ----- Orientation page content -----

export interface OrientationSection {
  number: string; // "1.1"
  heading: string;
  // paragraphs render as separate <Text> blocks
  paragraphs?: string[];
  bullets?: string[];
}

export const ORIENTATION = {
  number: "1",
  title: "ORIENTATION",
  intro:
    "A radiant warmer is an open-bed thermoregulation device that delivers infrared heat from above to keep a newborn at a safe body temperature, while leaving the infant fully exposed for observation, resuscitation, and hands-on care.",
  sections: [
    {
      number: "1.1",
      heading: "CLINICAL PROBLEM",
      paragraphs: [
        "Newborns lose heat far faster than adults. They have a large surface-area-to-mass ratio, thin skin, little insulating fat, and a limited ability to generate heat by shivering. Left unsupported, core temperature can fall within minutes of birth, and hypothermia is linked to higher rates of illness and death in the first hours of life.",
        "The warmer counters this by directing controlled radiant heat onto the infant, replacing the heat lost to evaporation, conduction, convection, and radiation, without enclosing the baby.",
      ],
    },
    {
      number: "1.2",
      heading: "WHERE IT SITS IN WORKFLOW",
      paragraphs: [
        "The warmer lives where speed and access matter most: the delivery room for immediate post-birth stabilization and resuscitation, and the NICU for sick or preterm infants who need frequent intervention.",
      ],
    },
    {
      number: "1.3",
      heading: "WARMER vs INCUBATOR",
      paragraphs: [
        "A closed incubator surrounds the infant in a warm, humid microenvironment and excels at stable, long-term thermoregulation. A radiant warmer trades that enclosure for open access, the right choice when staff need to reach the infant quickly and often.",
      ],
    },
    {
      number: "1.4",
      heading: "KEY TAKEAWAYS",
      bullets: [
        "Open-bed design prioritizes access over enclosure.",
        "It exists to prevent newborn hypothermia, a major cause of early morbidity.",
        "As life-support equipment, reliable function and maintenance are non-negotiable.",
      ],
    },
  ] as OrientationSection[],
};
