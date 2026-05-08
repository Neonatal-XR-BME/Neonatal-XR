import SwipeableScreen from "@/components/swipeablewrapper";
import { Text, View } from "react-native";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ARView() {
  return (
    <SafeAreaProvider>
      <SwipeableScreen>
        <SafeAreaView>
          <View>
            <Text>AR View</Text>
          </View>
        </SafeAreaView>
      </SwipeableScreen>
    </SafeAreaProvider>
  );
}
