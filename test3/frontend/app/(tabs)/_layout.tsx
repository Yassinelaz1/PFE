import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

function TabBarIcon({ name, color }: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome name={name} size={24} color={color} style={{ marginBottom: -2 }} />;
}

export default function TabLayout() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('role').then(r => {
      setRole(r);
    });
  }, []);

  if (role === null) return null; // loader

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFCC00',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
        tabBarStyle: {
          backgroundColor: '#064c8a',
          borderTopWidth: 0,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} /> }}
      />
      <Tabs.Screen
        name="events"
        options={{ title: 'Events', tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} /> }}
      />
      <Tabs.Screen
        name="club"
        options={{ title: 'Club', tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} /> }}
      />
      
      {/* 🚫 cache profile si admin */}
      <Tabs.Screen
        name="profile"
        options={{
          href: role === 'admin' ? null : undefined,
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />

      {/* 🚫 cache dashboard si user */}
      <Tabs.Screen
        name="dashboard"
        options={{
          href: role === 'admin' ? undefined : null,
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon name="dashboard" color={color} />,
        }}
      />
    </Tabs>

  );
}
