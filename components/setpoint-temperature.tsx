import { fontFamily } from "@/constants/fontFamily";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import TemperatureSlider from "./temperature-slider";

export interface SetPointCardProps {
  title: string;
  temperature: number;
  state: string;
  min?: number;
  max?: number;
  step?: number;
  onUpdate?: (value: number) => void;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function SetPointCard({
  title,
  temperature,
  state,
  min = 33,
  max = 39.5,
  step = 0.5,
  onUpdate,
}: SetPointCardProps) {
  // Draft value the slider/input edit. Seeded from the live target.
  const [draft, setDraft] = useState(temperature);
  const [editing, setEditing] = useState(false);
  const [inputText, setInputText] = useState(String(temperature));
  const inputRef = useRef<TextInput>(null);

  // Re-seed when the live target changes (e.g. new value from device).
  React.useEffect(() => {
    setDraft(temperature);
    setInputText(String(temperature));
  }, [temperature]);

  // Active only when the user has actually changed the value.
  const isDirty = draft !== temperature;

  const startEditing = () => {
    setInputText(String(draft));
    setEditing(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const commitInput = () => {
    const parsed = parseFloat(inputText.replace(",", "."));
    if (!Number.isNaN(parsed)) {
      setDraft(clamp(Number(parsed.toFixed(2)), min, max));
    } else {
      setInputText(String(draft));
    }
    setEditing(false);
  };

  const handleUpdate = () => {
    if (!isDirty) return;
    onUpdate?.(draft); // UI only for now.
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.tempValue}>
        <View style={styles.indicatorsContainer}>
          <View style={styles.indicator} />
          <View style={styles.indicator} />
        </View>

        <View style={{ justifyContent: "center" }}>
          <View style={styles.valueContainer}>
            {editing ? (
              <TextInput
                ref={inputRef}
                value={inputText}
                onChangeText={setInputText}
                onBlur={commitInput}
                onSubmitEditing={commitInput}
                keyboardType="decimal-pad"
                returnKeyType="done"
                style={styles.valueInput}
                selectTextOnFocus
              />
            ) : (
              <Pressable onPress={startEditing} hitSlop={8}>
                <Text style={styles.value}>{draft}</Text>
              </Pressable>
            )}
            <Text style={styles.unit}>°C</Text>
          </View>
        </View>

        <View style={styles.indicatorsContainer}>
          <View style={styles.indicator} />
          <View style={styles.indicator} />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.headText}>ADJUST HEATER TEMPERATURE</Text>
        <Text style={styles.text}>
          Slide or tap the value above to set the temperature for the heater
        </Text>
      </View>

      <TemperatureSlider
        min={min}
        max={max}
        step={step}
        value={draft}
        onChange={setDraft}
      />

      <Pressable
        onPress={handleUpdate}
        disabled={!isDirty}
        android_ripple={isDirty ? { color: "#2A5BFF" } : undefined}
        style={({ pressed }) => [
          styles.updateBtn,
          !isDirty && styles.updateBtnDisabled,
          isDirty && pressed && styles.updateBtnPressed,
        ]}
      >
        <Text
          style={[
            styles.updateBtnText,
            !isDirty && styles.updateBtnTextDisabled,
          ]}
        >
          UPDATE TEMPERATURE
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 0.5,
    borderColor: "#F0F0F0",
    gap: 14,
  },
  title: {
    fontSize: 11,
    fontFamily: fontFamily.medium,
    paddingHorizontal: 5,
    paddingVertical: 3,
    color: "#575757",
    backgroundColor: "#EEEEEE",
    alignSelf: "flex-start",
    borderRadius: 3,
  },
  tempValue: {
    backgroundColor: "#F4F4F4",
    height: 120,
    borderRadius: 12,
    borderColor: "#E1F3FF",
    borderWidth: 1,
    flexDirection: "row",
    padding: 8,
    justifyContent: "space-between",
    gap: 4,
  },
  unit: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    marginTop: 4,
  },
  value: {
    fontSize: 28,
    fontFamily: fontFamily.bold,
  },
  valueInput: {
    fontSize: 28,
    fontFamily: fontFamily.bold,
    color: "#272727ff",
    minWidth: 40,
    padding: 0,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#272727ff",
  },
  text: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    lineHeight: 16,
    color: "#A0A0A0",
  },
  indicatorsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#B0BEC5",
  },
  valueContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headText: {
    fontSize: 15,
    fontFamily: fontFamily.semibold,
    lineHeight: 16,
    color: "#393939",
  },
  textContainer: {
    marginTop: 8,
    gap: 6,
  },
  updateBtn: {
    marginTop: 6,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#0749FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0749FF",
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  updateBtnDisabled: {
    backgroundColor: "#C7D0DD",
    shadowOpacity: 0,
    elevation: 0,
  },
  updateBtnPressed: {
    backgroundColor: "#0640DB",
    transform: [{ scale: 0.99 }],
  },
  updateBtnText: {
    fontSize: 14,
    fontFamily: fontFamily.semibold,
    color: "#fff",
    letterSpacing: 0.3,
  },
  updateBtnTextDisabled: {
    color: "#fff",
  },
});
