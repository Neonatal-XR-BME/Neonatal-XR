import SwipeableScreen from "@/components/swipeablewrapper";
import { Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Training() {
  return (
    <SafeAreaProvider>
      <SwipeableScreen>
        <SafeAreaView style={{ flex: 1 }}>
          <View>
            <Text>Training</Text>
          </View>
        </SafeAreaView>
      </SwipeableScreen>
    </SafeAreaProvider>
  );
}
