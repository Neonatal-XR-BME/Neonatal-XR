// TemperatureBar.jsx
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Rect } from "react-native-svg";

/**
 * TemperatureBar
 *
 * Props:
 *   temperature  – current temperature value (number)
 *   minTemp      – minimum of the full range (default 35)
 *   maxTemp      – maximum of the full range (default 42)
 *   normalMin    – start of the normal (green) zone (default 36.5)
 *   normalMax    – end of the normal (green) zone (default 37.5)
 *   width        – component width (default 328)
 */

const TOTAL_BARS = 55;
const BAR_WIDTH = 4;
const BAR_GAP = 2;
const BAR_HEIGHT = 30;
const BAR_RADIUS = 2;

const COLOR_LOW = "#FBEC47"; // yellow  – below normal
const COLOR_NORMAL = "#0AC084"; // green   – normal range
const COLOR_HIGH = "#FF5252"; // red     – above normal
const COLOR_EMPTY = "#EEEEEE"; // grey    – unfilled

export interface TemperatureBarProps {
  temperature: number;
  minTemp?: number;
  maxTemp?: number;
  normalMin?: number;
  normalMax?: number;
}

export default function TemperatureBar({
  temperature,
  minTemp = 35,
  maxTemp = 42,
  normalMin = 36.1,
  normalMax = 36.8,
}: TemperatureBarProps) {
  const [barWidth, setBarWidth] = useState(0);

  // How many bars should be "filled" based on current temperature
  const filledCount = Math.round(
    ((temperature - minTemp) / (maxTemp - minTemp)) * TOTAL_BARS
  );
  const clampedFilled = Math.max(0, Math.min(TOTAL_BARS, filledCount));

  // Which bar index does the normal zone start/end at?
  const normalStartBar = Math.round(
    ((normalMin - minTemp) / (maxTemp - minTemp)) * TOTAL_BARS
  );
  const normalEndBar = Math.round(
    ((normalMax - minTemp) / (maxTemp - minTemp)) * TOTAL_BARS
  );

  const bars = Array.from({ length: TOTAL_BARS }, (_, i) => {
    const x = i * (BAR_WIDTH + BAR_GAP);
    let fill = COLOR_EMPTY;

    if (i < clampedFilled) {
      if (i < normalStartBar) {
        fill = COLOR_LOW; // yellow: below normal
      } else if (i < normalEndBar) {
        fill = COLOR_NORMAL; // green: within normal range
      } else {
        fill = COLOR_HIGH; // red: above normal
      }
    }

    return { x, fill };
  });

  // Scale SVG to match the desired width prop
  const svgWidth = TOTAL_BARS * (BAR_WIDTH + BAR_GAP) - BAR_GAP; // 328
  const scaleX = barWidth / svgWidth;

  return (
    <View
      style={[styles.container]}
      onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
    >
      <Svg
        width={barWidth}
        height={BAR_HEIGHT}
        viewBox={`0 0 ${svgWidth} ${BAR_HEIGHT}`}
        preserveAspectRatio="none"
      >
        {bars.map((bar, i) => (
          <Rect
            key={i}
            x={bar.x}
            y={0}
            width={BAR_WIDTH}
            height={BAR_HEIGHT}
            rx={BAR_RADIUS}
            fill={bar.fill}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
