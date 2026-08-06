import ARSVG from "@/assets/images/AR.svg";
import VRSVG from "@/assets/images/VR.svg";
import { router } from "expo-router";
import React, { useRef, useState } from "react";

import { fontFamily } from "@/constants/fontFamily";
import { LinearGradient } from "expo-linear-gradient";
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_SPACING = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;

const cards = [
  {
    id: "ar",
    title: "Augmented\nReality (AR)\nView",
    description:
      "Check your camera permission first. Then you point your camera at the physical neonatal warmer to see its 3D Version",
    route: "/arscene",
    buttonText: "LAUNCH AR",
    colors: ["#0749FF", "#1709B0"] as const,
    dotColor: "#0749FF",
    icon: "scan-outline" as const,
  },
  {
    id: "vr",
    title: "Virtual\nReality (VR)\nView",
    description:
      "Check your camera permission first. Then you can try to interact with the 3D model in your virtual environment.",
    route: `${Platform.OS === "android" ? "/mobilevr" : "/vrscene"}`,
    buttonText: "LAUNCH VR",
    colors: ["#00A651", "#005C2E"] as const,
    dotColor: "#00A651",
    icon: "glasses-outline" as const,
  },

  {
    id: "electricalVr",
    title: "Electrical\nSimulation",
    description:
      "Pinch to zoom, drag to pan, tap a part for details. This is a flat schematic viewer of the electrical layout of the neonatal warmer.",
    route: "/electricVr",
    buttonText: "CHECK SCHEMATIC",
    colors: ["#b871ff", "#9c39ff"] as const,
    dotColor: "#b871ff",
    icon: "glasses-outline" as const,
  },
];

export default function ARViewTab() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SNAP_INTERVAL);
    setActiveIndex(index);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Animated.ScrollView
          horizontal
          pagingEnabled={false}
          snapToInterval={SNAP_INTERVAL}
          snapToAlignment="start"
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumEnd}
          scrollEventThrottle={16}
        >
          {cards.map((card, index) => {
            const inputRange = [
              (index - 1) * SNAP_INTERVAL,
              index * SNAP_INTERVAL,
              (index + 1) * SNAP_INTERVAL,
            ];

            const cardScale = scrollX.interpolate({
              inputRange,
              outputRange: [0.92, 1, 0.92],
              extrapolate: "clamp",
            });

            const cardOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.6, 1, 0.6],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={card.id}
                style={[
                  styles.cardShadow,
                  {
                    transform: [{ scale: cardScale }],
                    opacity: cardOpacity,
                  },
                ]}
              >
                <LinearGradient
                  colors={[...card.colors]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.card}
                >
                  {/* Top content */}
                  <View style={styles.cardTop}>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardDescription}>
                      {card.description}
                    </Text>
                  </View>

                  {/* Center icon area */}
                  <View style={styles.cardCenter}>
                    <View style={styles.iconContainer}>
                      {card.id === "ar" ? (
                        // AR viewfinder icon
                        <View style={styles.arIconBox}>
                          {/* Corner brackets */}
                          <ARSVG />
                        </View>
                      ) : (
                        // VR headset icon
                        <View>
                          <VRSVG />
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Launch button */}
                  <TouchableOpacity
                    style={styles.launchButton}
                    onPress={() => router.push(card.route as any)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.launchButtonText}>
                      {card.buttonText}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </Animated.View>
            );
          })}
        </Animated.ScrollView>

        {/* Page indicator dots */}
        <View style={styles.pagination}>
          {cards.map((_, index) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [
                (index - 1) * SNAP_INTERVAL,
                index * SNAP_INTERVAL,
                (index + 1) * SNAP_INTERVAL,
              ],
              outputRange: [8, 24, 8],
              extrapolate: "clamp",
            });

            const dotColor = scrollX.interpolate({
              inputRange: [
                (index - 1) * SNAP_INTERVAL,
                index * SNAP_INTERVAL,
                (index + 1) * SNAP_INTERVAL,
              ],
              outputRange: ["#CCCCCC", cards[index].dotColor, "#CCCCCC"],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    backgroundColor: dotColor,
                  },
                ]}
              />
            );
          })}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const CORNER_SIZE = 30;
const CORNER_BORDER = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F8",
    position: "relative",
  },
  scrollContent: {
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
    paddingTop: 12,
    gap: CARD_SPACING,
    marginBottom: 38,
  },
  cardShadow: {
    width: CARD_WIDTH,
    flex: 1,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  card: {
    flex: 1,
    borderRadius: 40,
    padding: 28,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  cardTop: {
    gap: 12,
  },
  cardTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: fontFamily.Paprika,
  },
  cardDescription: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 18,
    fontFamily: fontFamily.medium,
  },
  cardCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 180,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },

  // AR viewfinder
  arIconBox: {
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: "rgba(255,255,255,0.8)",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_BORDER,
    borderLeftWidth: CORNER_BORDER,
    borderTopLeftRadius: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_BORDER,
    borderRightWidth: CORNER_BORDER,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_BORDER,
    borderLeftWidth: CORNER_BORDER,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_BORDER,
    borderRightWidth: CORNER_BORDER,
    borderBottomRightRadius: 4,
  },

  // VR icon
  vrIconBox: {
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },

  // Launch button
  launchButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  launchButtonText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: fontFamily.bold,
    color: "#222",
    letterSpacing: 1,
  },
  arIcon: {
    width: 280,
    height: 280,
  },

  // Pagination
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingBottom: 16,
    alignSelf: "center",
    position: "absolute",
    bottom: 0,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
