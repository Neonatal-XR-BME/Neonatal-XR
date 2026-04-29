import { HapticTab } from "@/components/haptic-tab";
import { fontFamily } from "@/constants/fontFamily";
import { Colors } from "@/constants/theme";
import { Tabs } from "expo-router";
import React from "react";

import { Airdrop, Box, CpuSetting, Notepad } from "iconsax-react-nativejs";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors["light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 96,
          paddingBottom: 16,
          paddingTop: 10,
          display: "flex",
          paddingHorizontal: 16,
        },
        tabBarLabelStyle: {
          fontFamily: fontFamily.semibold,
          fontSize: 11,
          letterSpacing: -0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Monitoring",
          tabBarIcon: ({ color }) => (
            <Airdrop size={26} variant="Bold" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="arview"
        options={{
          title: "AR View",
          tabBarIcon: ({ color }) => (
            <Box size={26} variant="Bold" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="troubleshoot"
        options={{
          title: "Troubleshoot",
          tabBarIcon: ({ color }) => (
            <CpuSetting size={26} variant="Bold" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="training"
        options={{
          title: "Training",
          tabBarIcon: ({ color }) => (
            <Notepad size={26} variant="Bold" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
