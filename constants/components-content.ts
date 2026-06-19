// Content for Module 02: Components and Logic (merged Components & Anatomy +
// Systems & Control Logic). Verified against the same sources as the
// orientation module (NEST360 Biomedical Engineer Education Module and
// corroborating clinical/manufacturer references). Generic radiant-warmer
// baseline; a specific model's service manual overrides this.

export interface ComponentItem {
  photo: string;
  name: string;
  description: string;
}

export interface LoopStep {
  label: string;
}

export interface AlarmItem {
  label: string;
}

export const COMPONENTS = {
  moduleLabel: "MODULE 02 OF 06",
  number: "2",
  title: "COMPONENTS & LOGIC",
  intro:
    "Every safe intervention starts with knowing the hardware, then understanding how those parts work as one system. Below is each major subsystem, what it is and what it does, followed by how the warmer decides how much heat to deliver and how it protects the infant when something goes wrong.",

  componentsNumber: "2.1",
  componentsHeading: "COMPONENTS & ANATOMY",
  parts: [
    {
      photo: "HEATING HEAD",
      name: "Overhead infrared heating assembly",
      description:
        "Quartz or ceramic element behind a parabolic reflector that focuses infrared heat downward onto the bassinet.",
    },
    {
      photo: "SKIN PROBE",
      name: "Skin temperature probe",
      description:
        "Adhesive thermistor placed on the infant's abdomen or flank; reports skin temperature to the control unit.",
    },
    {
      photo: "CONTROL BOARD",
      name: "Microprocessor control unit",
      description:
        "The brain of the device. Reads the probe, drives heater output, and manages modes and alarm logic.",
    },
    {
      photo: "CONTROL PANEL",
      name: "Control panel & LCD display",
      description:
        "Shows setpoint, current skin temperature, heater output percent, active mode, and alarm status.",
    },
    {
      photo: "ALARM INDICATORS",
      name: "Alarm system",
      description:
        "Audible and visual alerts for high and low temperature, probe failure, manual-mode timer, and power loss.",
    },
    {
      photo: "THERMAL CUTOUT",
      name: "Over-temperature cutout",
      description:
        "Independent hardware safety that cuts heater power if a maximum threshold is exceeded, separate from the control unit.",
    },
    {
      photo: "POWER MODULE",
      name: "Power switch & supply",
      description:
        "Mains input with fuse protection. Many units include a battery backup to power the power-loss alarm.",
    },
    {
      photo: "BASSINET",
      name: "Bassinet & platform",
      description:
        "Tilting, padded infant surface with clear side walls. Some include an integrated scale and X-ray tray.",
    },
    {
      photo: "CASTOR + BRAKE",
      name: "Castors with brakes",
      description:
        "Lockable wheels for repositioning between bays and securing the unit in place during care.",
    },
  ] as ComponentItem[],

  logicNumber: "2.2",
  logicHeading: "SYSTEMS & CONTROL LOGIC",
  logicIntro:
    "The components only matter as connected systems. This is the why: how the warmer decides how much heat to deliver, and how it protects the infant when something goes wrong.",

  servoNumber: "2.3",
  servoHeading: "THE SERVO (FEEDBACK) CONTROL LOOP",
  servoBody:
    "In servo mode the warmer runs a closed loop. The skin probe measures the infant's temperature; the control unit compares it to the setpoint (commonly around 36.5 C) and raises or lowers heater output to close the gap. The heat reaches the infant, the probe re-measures, and the loop repeats.",
  servoLoop: [
    { label: "Skin probe measures temp" },
    { label: "Control unit compares to setpoint" },
    { label: "Heater adjusts output" },
    { label: "Infant warms" },
  ] as LoopStep[],
  servoFeedbackNote:
    "Feedback: the probe re-measures and the loop repeats continuously, holding the setpoint.",

  manualNumber: "2.4",
  manualHeading: "MANUAL MODE",
  manualBody:
    "In manual mode the heater runs at a fixed output percentage, regardless of skin temperature. There is no feedback, so it demands constant clinical vigilance, and a mandatory timer alarm reminds staff to re-check the infant at set intervals.",

  fallbackNumber: "2.5",
  fallbackHeading: "PROBE-FAILURE FALLBACK",
  fallbackBody:
    "If the skin probe fails or disconnects during servo operation, the loop goes blind and can no longer read temperature. The control unit detects this, raises an alarm, and falls back to a safe state rather than continuing to heat unmonitored.",

  alarmNumber: "2.6",
  alarmHeading: "THE ALARM CHAIN",
  alarms: [
    { label: "High skin temperature" },
    { label: "Low skin temperature" },
    { label: "Probe failure / disconnect" },
    { label: "Manual-mode timer" },
    { label: "Power loss" },
  ] as AlarmItem[],

  overTempLabel: "OVER-TEMPERATURE PROTECTION",
  overTempBody:
    "An independent hardware cutout sits outside the control loop entirely. If a maximum threshold is exceeded, it cuts heater power on its own, the last line of defense, even if the control unit itself fails.",
};
