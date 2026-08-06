// Guided fault-simulation scenarios for the ElectricalVR / CircuitSchematic
// troubleshooting mode. Each scenario has:
//   - A symptom the user observes ("Heater not turning on")
//   - An ordered list of investigation steps, each pointing at a circuit
//     component by id (matches CIRCUIT_COMPONENTS ids) with what to check,
//     what the tool/reading shows, and what conclusion to draw.
//   - A root cause and corrective action once all steps are done.

export type SimStep = {
  stepNumber: number;
  // Which circuit component is under the spotlight in this step.
  componentId: string;
  // Short label shown in the step header.
  action: string;
  // What the technician actually does (measurement, visual, toggle test …).
  instruction: string;
  // What the reading / observation looks like on a healthy unit vs. a faulted one.
  expected: string;
  // What is found in this fault scenario (the "bad" reading that points forward).
  finding: string;
  // One-line reasoning that connects this finding to the next step.
  deduction: string;
};

export type FaultScenario = {
  id: string;
  symptom: string;
  // Brief intro shown before the simulation starts.
  overview: string;
  // IDs of every component that should be highlighted / dimmed during the sim.
  affectedComponents: string[];
  steps: SimStep[];
  // Shown on the final "resolved" card.
  rootCause: string;
  correctiveAction: string;
};

// Returns every fault scenario that involves a given circuit component, so the
// schematic viewer can offer "troubleshoot this part" links straight from a
// component's tooltip. A component counts as involved if it's in the
// scenario's affectedComponents or is the focus of any step.
export function getScenariosForComponent(
  componentId: string
): FaultScenario[] {
  return FAULT_SCENARIOS.filter(
    (s) =>
      s.affectedComponents.includes(componentId) ||
      s.steps.some((step) => step.componentId === componentId)
  );
}

export const FAULT_SCENARIOS: FaultScenario[] = [
  {
    id: "heater_not_turning_on",
    symptom: "Heater Not Turning On",
    overview:
      "The warmer is powered, the OLED shows a setpoint, but the bed temperature does not rise. Work through the power path from mains to heating coil to isolate the fault.",
    affectedComponents: [
      "ac_supply",
      "fuse",
      "rocker_switch_2",
      "ssr",
      "relay_module",
      "heating_coil",
      "esp32_38p_typec_cp2102",
      "ds18b20_digital_temperature_sensor",
    ],
    steps: [
      {
        stepNumber: 1,
        componentId: "ac_supply",
        action: "Check mains supply voltage",
        instruction:
          "Set a multimeter to AC voltage. Place probes across the AC supply input terminals on the PCB (L and N rails).",
        expected: "210–240 V AC present at all times when plugged in.",
        finding: "230 V AC confirmed. Mains supply is healthy.",
        deduction: "Supply is fine. The fault is downstream. Move to the fuse.",
      },
      {
        stepNumber: 2,
        componentId: "fuse",
        action: "Test the mains fuse continuity",
        instruction:
          "Power off the unit. Remove the fuse from its holder. Switch the multimeter to continuity mode and place probes across both fuse ends.",
        expected: "Beep / near-zero ohms — fuse is intact.",
        finding: "No beep, OL on display — fuse is open (blown).",
        deduction:
          "A blown fuse breaks the AC path to the SSR and heating coil. Before replacing, check why it blew — inspect downstream wiring for shorts.",
      },
      {
        stepNumber: 3,
        componentId: "ssr",
        action: "Inspect the SSR for visible damage",
        instruction:
          "With power still off, visually inspect the Solid State Relay body, screw terminals, and heat-sink for burn marks, cracked casing, or discoloration.",
        expected: "Clean body, no scorch marks, terminals secure.",
        finding:
          "No visible damage found. SSR exterior looks intact. Rule out SSR as the short source.",
        deduction:
          "SSR appears undamaged. The fuse likely blew from a transient or a wiring fault upstream. Replace fuse with the correct rating (check BOM) and test.",
      },
      {
        stepNumber: 4,
        componentId: "rocker_switch_2",
        action: "Verify the heater rocker switch continuity",
        instruction:
          "Power off. Use continuity mode across the rocker switch #2 terminals while toggling it to the ON position.",
        expected: "Continuity when switch is ON, open when OFF.",
        finding: "Continuity confirmed in both positions — switch is healthy.",
        deduction:
          "Switch is not the fault. Install a new fuse of the correct rating and restore power.",
      },
      {
        stepNumber: 5,
        componentId: "heating_coil",
        action: "Measure heating coil resistance",
        instruction:
          "Power off and disconnect the coil leads. Set multimeter to resistance (Ω) mode. Probe across the two coil terminals.",
        expected:
          "Resistance in the range specified for the quartz heating element (typically 10–50 Ω for this coil rating).",
        finding:
          "Reading is within expected range. Coil is not open or shorted.",
        deduction:
          "Coil is healthy. With the new fuse installed and coil confirmed good, restore power and monitor for a repeat blow.",
      },
      {
        stepNumber: 6,
        componentId: "esp32_38p_typec_cp2102",
        action: "Confirm ESP32 is sending SSR control signal",
        instruction:
          "With power restored and setpoint above current temperature, use the app dashboard to confirm the heater toggle is ON. Then probe the SSR control input pin (GPIO output from ESP32) with a multimeter or logic probe.",
        expected:
          "3.3 V (HIGH) on the control line when heater should be active.",
        finding:
          "3.3 V confirmed on control line. ESP32 is correctly commanding the SSR.",
        deduction:
          "All checked components are healthy after fuse replacement. The root cause was a blown fuse.",
      },
    ],
    rootCause:
      "Blown mains fuse broke the AC supply path to the SSR and heating coil, preventing any current from reaching the heater regardless of ESP32 commands.",
    correctiveAction:
      "Replace the blown fuse with a fuse of the correct current rating as per the BOM. Inspect mains wiring for any signs of a short that caused the initial blow. Monitor on next power-up.",
  },
  {
    id: "temperature_not_rising",
    symptom: "Temperature Not Rising to Setpoint",
    overview:
      "The heater appears to be switching on (relay clicks, SSR LED lights) but the bed temperature climbs very slowly or plateaus well below setpoint. Investigate the sensor and PID control path.",
    affectedComponents: [
      "ds18b20_digital_temperature_sensor",
      "esp32_38p_typec_cp2102",
      "ssr",
      "heating_coil",
      "buck_1",
      "buck_2",
    ],
    steps: [
      {
        stepNumber: 1,
        componentId: "ds18b20_digital_temperature_sensor",
        action: "Check DS18B20 sensor reading in the app",
        instruction:
          "Open the app dashboard. Compare the live temperature reading against an independent calibrated thermometer placed at the same location as the DS18B20 probe.",
        expected: "App reading matches reference thermometer within ±0.5°C.",
        finding:
          "App shows 25°C but the reference reads 33°C. Sensor is reporting 8°C below actual.",
        deduction:
          "The DS18B20 is under-reading. The PID loop sees a lower temperature than reality and may be driving the heater less than needed — but it could also mean the probe has shifted out of position or is degraded.",
      },
      {
        stepNumber: 2,
        componentId: "ds18b20_digital_temperature_sensor",
        action: "Inspect DS18B20 probe placement and connection",
        instruction:
          "Physically locate the DS18B20 probe inside the warmer. Check that it is seated against the mattress surface, not floating in air. Inspect the 3-wire connection at the ESP32 for loose joints.",
        expected:
          "Probe is flush against the measurement surface, wires are secure.",
        finding:
          "Probe is found suspended in air near the frame — it slipped from its mount bracket. Re-seat it against the surface and re-check the reading.",
        deduction:
          "Air-gap around the sensor caused it to read ambient rather than bed temperature. Restoring probe contact should fix the under-reading.",
      },
      {
        stepNumber: 3,
        componentId: "esp32_38p_typec_cp2102",
        action: "Re-check sensor reading after repositioning",
        instruction:
          "With probe re-seated, observe the app temperature reading for 2 minutes while the heater runs.",
        expected: "Reading now tracks the reference thermometer within ±0.5°C.",
        finding:
          "Reading climbs and now matches the reference. Temperature is rising normally toward setpoint.",
        deduction:
          "PID loop is now working with accurate sensor data. No further electrical fault.",
      },
    ],
    rootCause:
      "DS18B20 probe had slipped out of its bracket, leaving it sensing ambient air instead of bed temperature. The PID controller was working correctly but acting on a false (low) reading.",
    correctiveAction:
      "Re-seat the DS18B20 probe firmly in its mounting bracket against the mattress surface. If the bracket is damaged, fabricate or print a replacement clip. Verify reading stability before returning to service.",
  },
];
