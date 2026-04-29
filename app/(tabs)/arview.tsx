import { Image } from "expo-image";
import { Platform, StyleSheet, View, Text } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ARView() {
  return (
    <SafeAreaView>
      <View>
        <Text>
          AR View
        </Text>
      </View>
    </SafeAreaView>
  );
}
