// Auto-generated from circuit_image.svg via pin-cluster analysis, then
// hand-labeled. Hotspot boxes are approximate (padded bounding boxes around
// each component's tagged pins in the schematic's own coordinate space --
// close enough to tap reliably, but nudge x/y/width/height here directly if
// any region feels off relative to the artwork.

// Must match the source SVG's own viewBox exactly -- this is how hotspot
// coordinates get converted into on-screen pixel offsets in
// CircuitSchematicViewer. If circuit-diagram.svg is ever re-exported with a
// different viewBox, update this to match.
export const SVG_VIEWBOX = {
  minX: -3482.02132,
  minY: -1062.5,
  width: 4094.52132,
  height: 2517.5,
} as const;

export type CircuitComponent = {
  id: string;
  label: string;
  description: string;
  hotspot: { x: number; y: number; width: number; height: number };
};

export const CIRCUIT_COMPONENTS: CircuitComponent[] = [
  {
    id: "18650_12v_3s_li_ion_battery_1",
    label: "18650 3S Li-ion Battery Pack #1",
    description:
      "Backup power source, keeping the system running through brief mains interruptions.",
    hotspot: { x: -1880.6, y: 71.2, width: 406.9, height: 169.0 },
  },
  {
    id: "18650_12v_3s_li_ion_battery_2",
    label: "18650 3S Li-ion Battery Pack #2",
    description:
      "Backup power source, keeping the system running through brief mains interruptions.",
    hotspot: { x: -1874.0, y: 531.5, width: 280.4, height: 160.0 },
  },
  {
    id: "ac_supply",
    label: "AC Supply",
    description: "Mains power input to the system.",
    hotspot: { x: -3385.0, y: 765.0, width: 257.5, height: 160.0 },
  },
  {
    id: "bms_3s_1",
    label: "Battery Protection Board (BMS) #1",
    description:
      "Protects its Li-ion pack from overcharge, over-discharge, and short circuit.",
    hotspot: { x: -2170.0, y: 156.8, width: 346.1, height: 164.0 },
  },
  {
    id: "bms_3s_2",
    label: "Battery Protection Board (BMS) #2",
    description:
      "Protects its Li-ion pack from overcharge, over-discharge, and short circuit.",
    hotspot: { x: -2174.1, y: 457.4, width: 347.2, height: 168.5 },
  },
  {
    id: "buck_1",
    label: "LM2596 Buck Converter #1",
    description:
      "Steps down DC voltage to the level needed by a downstream stage.",
    hotspot: { x: -2118.0, y: -315.7, width: 265.5, height: 160.7 },
  },
  {
    id: "buck_2",
    label: "LM2596 Buck Converter #2",
    description: "Steps down DC voltage for a second downstream stage.",
    hotspot: { x: -2120.0, y: -82.9, width: 264.5, height: 160.6 },
  },
  {
    id: "buzzer",
    label: "Buzzer",
    description:
      "Audible alert for fault conditions such as overheat or low-temperature warnings.",
    hotspot: { x: -902.5, y: 840.0, width: 175.3, height: 160.3 },
  },
  {
    id: "dc_power_source",
    label: "DC Power Source",
    description: "Regulated DC supply feeding the low-voltage electronics.",
    hotspot: { x: -2117.5, y: 1035.0, width: 280.0, height: 160.0 },
  },
  {
    id: "dht22",
    label: "DHT22 Sensor",
    description: "Measures ambient temperature and humidity around the warmer.",
    hotspot: { x: 327.5, y: -225.0, width: 190.0, height: 160.0 },
  },
  {
    id: "ds18b20_digital_temperature_sensor",
    label: "DS18B20 Sensor",
    description:
      "Digital probe measuring core (bed-side) temperature, fed into the PID control loop.",
    hotspot: { x: -47.5, y: -225.6, width: 197.8, height: 161.3 },
  },
  {
    id: "diode",
    label: "Diode",
    description: "Protects the circuit from reverse current or voltage.",
    hotspot: { x: -2177.9, y: 821.8, width: 160.0, height: 160.0 },
  },
  {
    id: "fuse",
    label: "Fuse",
    description: "Overcurrent protection on the mains supply line.",
    hotspot: { x: -3212.5, y: 345.0, width: 355.0, height: 160.0 },
  },
  {
    id: "heating_coil",
    label: "Heating Coil",
    description: "The quartz tube heating element that warms the bassinet.",
    hotspot: { x: -3392.5, y: 195.0, width: 233.9, height: 160.1 },
  },
  {
    id: "ky_040",
    label: "KY-040 Rotary Encoder",
    description:
      "Lets the operator set the target temperature directly on the physical device.",
    hotspot: { x: 219.3, y: -675.0, width: 223.2, height: 160.9 },
  },
  {
    id: "rgb_led_module",
    label: "RGB LED Module",
    description:
      "Visual status indicator for system state (e.g. normal vs. fault).",
    hotspot: { x: -531.3, y: 840.0, width: 193.8, height: 160.0 },
  },
  {
    id: "relay_module",
    label: "Relay Module",
    description:
      "Logic-level relay switching a downstream load based on the microcontroller's control signal.",
    hotspot: { x: -2818.6, y: 660.0, width: 209.8, height: 296.9 },
  },
  {
    id: "resistor_1",
    label: "Resistor #1",
    description: "Sets current/voltage levels for its local circuit.",
    hotspot: { x: -55.0, y: -89.5, width: 160.0, height: 160.0 },
  },
  {
    id: "resistor_2",
    label: "Resistor #2",
    description: "Sets current/voltage levels for its local circuit.",
    hotspot: { x: 335.0, y: -74.5, width: 160.0, height: 160.0 },
  },
  {
    id: "resistor_3",
    label: "Resistor #3",
    description: "Sets current/voltage levels for its local circuit.",
    hotspot: { x: -1683.0, y: 1102.5, width: 362.5, height: 280.0 },
  },
  {
    id: "rocker_switch_1",
    label: "Rocker Switch #1",
    description: "Manual power switch for the unit.",
    hotspot: { x: -2387.5, y: 0.0, width: 190.0, height: 160.0 },
  },
  {
    id: "rocker_switch_2",
    label: "Rocker Switch #2",
    description: "Manual power switch for the unit.",
    hotspot: { x: -3107.5, y: 555.0, width: 190.0, height: 160.0 },
  },
  {
    id: "ssr",
    label: "Solid State Relay (SSR)",
    description:
      "Switches AC mains power to the heating coil based on the control signal, with no mechanical contacts.",
    hotspot: { x: -2835.2, y: 104.6, width: 217.7, height: 256.0 },
  },
  {
    id: "esp32_38p_typec_cp2102",
    label: "ESP32 (38-pin, USB-C, CP2102)",
    description:
      "Main microcontroller. Reads all sensors, runs the PID temperature control loop, drives the SSR and relay outputs, and syncs live data to the app.",
    hotspot: { x: -1080.6, y: -158.9, width: 491.3, height: 689.7 },
  },
  {
    id: "oled",
    label: '1.3" OLED Display',
    description:
      "Shows live readings and system status directly on the device.",
    hotspot: { x: -459.8, y: -819.1, width: 496.9, height: 208.9 },
  },
];
