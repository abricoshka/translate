import { Tabs } from 'expo-router';
import React from 'react';

import FloatingCapsuleTabBar from '@/components/FloatigCapsuleBar';
import { HapticTab } from '@/components/HapticTab';
import { Camera, Converesation, Favorites, Translate } from '@/components/icons';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <FloatingCapsuleTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Translation',
          tabBarIcon: ({ color }) => <Translate color={color} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color }) => <Camera color={color} />,
        }}
      />
      <Tabs.Screen
        name="conversation"
        options={{
          title: 'Conversation',
          tabBarIcon: ({ color }) => <Converesation color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <Favorites color={color} />,
        }}
      />
    </Tabs>
  );
}
