// Content for Module 03: Procedures, Maintenance & Troubleshooting (merged).
// Verified against the same sources as the other modules (NEST360 Biomedical
// Engineer Education Module and corroborating clinical/manufacturer refs).
// Generic radiant-warmer baseline; a specific model's service manual overrides.

export interface MaintenanceItem {
  text: string;
}

export interface MaintenanceGroup {
  heading: string;
  tag: string; // EVERY USE, WEEKLY, ...
  items: MaintenanceItem[];
}

export interface FaultBlock {
  symptom: string;
  causes: string[];
}

export const PROCEDURES = {
  moduleLabel: "MODULE 03 OF 06",
  number: "3",
  title: "PROCEDURES & MAINTENANCES",
  intro:
    "Pre-use checks and preventive maintenance, organized by interval, followed by symptom-to-cause troubleshooting. Work through the checks in order, then use the fault guide to reason from what you observe.",

  calloutLabel: "TEST vs CALIBRATE",
  calloutBody:
    "Heating elements are tested with a digital multimeter for voltage and continuity, not calibrated. Temperature sensing must be calibrated to the manufacturer's schedule.",

  maintenanceNumber: "3.1",
  maintenanceHeading: "MAINTENANCE BY INTERVAL",
  groups: [
    {
      heading: "Pre-use checks",
      tag: "EVERY USE",
      items: [
        {
          text: "Visually inspect the unit, probe lead, and power cord for damage or wear.",
        },
        {
          text: "Confirm the skin probe reads a plausible temperature and is undamaged.",
        },
        {
          text: "Test audible and visual alarms (e.g. trigger a probe-disconnect alarm).",
        },
        { text: "Verify mains power and, if fitted, battery backup." },
        {
          text: "Check bassinet brakes lock and the platform tilts and holds.",
        },
      ],
    },
    {
      heading: "Weekly",
      tag: "WEEKLY",
      items: [
        {
          text: "Test the heating element with a digital multimeter for voltage and continuity.",
        },
        { text: "Inspect and function-test the skin temperature probe." },
      ],
    },
    {
      heading: "Monthly",
      tag: "MONTHLY",
      items: [
        {
          text: "Test the power-loss alarm by disconnecting mains with the unit running.",
        },
        { text: "Run the built-in self-diagnosis routine and log any codes." },
      ],
    },
    {
      heading: "Quarterly",
      tag: "QUARTERLY",
      items: [
        {
          text: "Perform functional checks across all modes (servo and manual).",
        },
        {
          text: "Complete electrical safety testing (earth continuity, leakage current).",
        },
      ],
    },
    {
      heading: "Annual",
      tag: "ANNUAL",
      items: [
        { text: "Full inspection per the manufacturer's service manual." },
        {
          text: "Calibrate temperature sensing to the manufacturer's schedule.",
        },
        {
          text: "Confirm critical spares (probe, fuses, heating element) are on hand.",
        },
      ],
    },
  ] as MaintenanceGroup[],

  safetyLabel: "SAFETY RULE",
  safetyBody:
    "Remove the unit from service on any alarm or control failure you cannot resolve. Stop immediately at any sign of smoke or a burning smell, do not continue use under any circumstances.",

  troubleshootingNumber: "3.2",
  troubleshootingHeading: "FAULTS & TROUBLESHOOTING",
  troubleshootingIntro:
    "Troubleshooting is symptom-to-cause reasoning. Start from what you observe, then work through the likely causes.",
  faults: [
    {
      symptom: "No heat from the element",
      causes: [
        "Faulty heating element",
        "Faulty control PCB",
        "Broken or loose wiring",
        "Blown fuse on the heater circuit",
      ],
    },
    {
      symptom: "Probe alarm or erratic skin temperature",
      causes: [
        "Probe disconnected or loose at the unit",
        "Damaged probe or lead",
        "Poor skin contact, probe detached from the infant",
      ],
    },
    {
      symptom: "Unit will not power on / battery fault",
      causes: [
        "No mains supply or tripped outlet",
        "Blown mains fuse",
        "Failing battery or power-supply board",
      ],
    },
    {
      symptom: "Blank or faulty display",
      causes: [
        "Display module failure",
        "Loose display ribbon connector",
        "Control PCB fault",
      ],
    },
    {
      symptom: "Unit overheats / over-temp alarm",
      causes: [
        "Control unit driving full output incorrectly",
        "Stuck heater relay",
        "Setpoint or mode misconfigured, verify the over-temp cutout engages",
      ],
    },
  ] as FaultBlock[],
};
