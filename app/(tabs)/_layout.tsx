import React from 'react'
import { Tabs } from 'expo-router';
import Icon from '@expo/vector-icons/FontAwesome';

const TabLayout = () => {
  return (
    
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007AFF', headerShown: false }}>
         <Tabs.Screen
      name="index"
      options={{
        title: 'All Users',
        tabBarIcon: ({ color }) => <Icon size={28} name="users" color={color} />,
      }}
    />
 
    <Tabs.Screen
      name="Favorites"
      options={{
        title: 'Favorites',
        tabBarIcon: ({ color }) => <Icon size={28} name="star" color={color} />,
      }}
    />
  </Tabs>
  )
}

export default TabLayout
