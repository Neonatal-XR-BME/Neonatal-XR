// Content for Module 04: Assessment (Knowledge Check).
// Questions are drawn from Modules 01-03 (orientation, components & logic,
// procedures & maintenance). Mixed formats: multiple choice, true/false,
// and symptom-to-cause matching.

export type QuestionType = "mcq" | "tf" | "match";

export interface AssessmentQuestion {
  id: string;
  type: QuestionType;
  /** Shown only for "match" questions, e.g. the observed symptom */
  symptom?: string;
  prompt: string;
  options: string[];
  /** Index into options */
  correctIndex: number;
  /** Short explanation shown in the results review */
  explanation: string;
}

export const ASSESSMENT = {
  number: "4",
  title: "ASSESSMENT",
  intro:
    "A knowledge check covering orientation, components and logic, and procedures. Answer every question, then submit to see your score. You can retake the assessment as many times as you like.",
  passMark: 70, // percent
  questions: [
    {
      id: "q1",
      type: "mcq",
      prompt:
        "What is the primary clinical purpose of a neonatal radiant warmer?",
      options: [
        "To enclose the infant in a humid microenvironment",
        "To prevent newborn hypothermia while keeping the infant accessible",
        "To provide respiratory support during resuscitation",
        "To sterilize the delivery-room environment",
      ],
      correctIndex: 1,
      explanation:
        "The warmer delivers radiant heat from above to prevent hypothermia while leaving the infant fully exposed for observation and hands-on care.",
    },
    {
      id: "q2",
      type: "tf",
      prompt:
        "A closed incubator is the better choice when staff need to reach the infant quickly and often.",
      options: ["True", "False"],
      correctIndex: 1,
      explanation:
        "False. The radiant warmer trades enclosure for open access; the incubator excels at stable long-term thermoregulation, not rapid access.",
    },
    {
      id: "q3",
      type: "mcq",
      prompt:
        "In servo mode, what does the controller use to adjust heater output?",
      options: [
        "A fixed timer set by the operator",
        "The ambient room temperature",
        "Readings from the skin temperature probe",
        "The heater element's internal resistance",
      ],
      correctIndex: 2,
      explanation:
        "Servo mode is a closed loop: the skin probe feeds the infant's temperature to the controller, which auto-adjusts heater power.",
    },
    {
      id: "q4",
      type: "tf",
      prompt:
        "The over-temperature cutout is part of the main control loop and depends on the control unit to function.",
      options: ["True", "False"],
      correctIndex: 1,
      explanation:
        "False. It is an independent hardware cutout outside the control loop, so it can cut heater power even if the control unit itself fails.",
    },
    {
      id: "q5",
      type: "mcq",
      prompt: "Which of these is a correct pre-use (every use) check?",
      options: [
        "Calibrate the temperature sensors",
        "Test audible and visual alarms, e.g. trigger a probe-disconnect alarm",
        "Test the heating element with a multimeter",
        "Complete electrical safety leakage testing",
      ],
      correctIndex: 1,
      explanation:
        "Alarm testing is done before every use. Multimeter element tests are weekly, electrical safety tests quarterly, and calibration follows the manufacturer's schedule.",
    },
    {
      id: "q6",
      type: "mcq",
      prompt:
        "How is the heating element checked, per the maintenance guidance?",
      options: [
        "It is calibrated against a reference thermometer",
        "It is tested with a digital multimeter for voltage and continuity",
        "It is visually inspected only",
        "It is swapped annually regardless of condition",
      ],
      correctIndex: 1,
      explanation:
        "Heating elements are tested (multimeter, voltage and continuity), not calibrated. Temperature sensing is what gets calibrated.",
    },
    {
      id: "q7",
      type: "match",
      symptom: "No heat from the element",
      prompt: "Which of these is a likely cause of this symptom?",
      options: [
        "Poor probe skin contact",
        "Blown fuse on the heater circuit",
        "Loose display ribbon connector",
        "Bassinet brakes not locked",
      ],
      correctIndex: 1,
      explanation:
        "No heat points to the heater path: faulty element, control PCB, broken wiring, or a blown heater-circuit fuse.",
    },
    {
      id: "q8",
      type: "match",
      symptom: "Probe alarm or erratic skin temperature",
      prompt: "Which of these is a likely cause of this symptom?",
      options: [
        "Stuck heater relay",
        "Blown mains fuse",
        "Probe detached from the infant or poor skin contact",
        "Display module failure",
      ],
      correctIndex: 2,
      explanation:
        "Probe alarms trace to the probe path: disconnected or loose probe, damaged lead, or poor skin contact.",
    },
    {
      id: "q9",
      type: "match",
      symptom: "Unit overheats / over-temp alarm",
      prompt: "Which of these is a likely cause of this symptom?",
      options: [
        "Control unit driving full output incorrectly",
        "Failing battery",
        "Damaged probe lead",
        "Tripped wall outlet",
      ],
      correctIndex: 0,
      explanation:
        "Overheating suggests the control unit driving full output, a stuck heater relay, or a misconfigured setpoint/mode. Verify the over-temp cutout engages.",
    },
    {
      id: "q10",
      type: "tf",
      prompt:
        "If a warmer shows smoke or a burning smell, it may remain in service while a technician is called, as long as it is supervised.",
      options: ["True", "False"],
      correctIndex: 1,
      explanation:
        "False. Stop immediately at any sign of smoke or a burning smell and remove the unit from service. Do not continue use under any circumstances.",
    },
  ] as AssessmentQuestion[],
};
