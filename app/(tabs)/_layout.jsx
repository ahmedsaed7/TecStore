import React  from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme } from "react-native";
import { DrawerToggleButton } from '@react-navigation/drawer';

function TabBarIcon({ name, color }) {
  return <FontAwesome size={28} style={ { marginBottom: -3 }} name={name} color={color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (

    <Tabs 
      screenOptions={{
        headerLeft: () => <DrawerToggleButton tintColor= "lightgray" />,
        headerTintColor: "lightgray",
        headerStyle: {backgroundColor: "#0a4a7c"},
        tabBarStyle : {borderTopLeftRadius : 25, borderTopRightRadius: 25 , backgroundColor :"#0a4a7c" },
        // headerShown: false, 
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color="lightgray" />,
        }}
      />
        <Tabs.Screen
        name="favorite"
        options={{
          title: 'Favorite',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color="lightgray" />,
        }}
      />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <TabBarIcon  name="user" color="lightgray" />,
          }}
        />
    </Tabs>
  );
}
