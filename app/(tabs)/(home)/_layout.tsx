import { Stack } from 'expo-router';
import React from 'react';


export default function HomeLayout() {
  // const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{

        headerShown: false,
      }}>
      <Stack.Screen
        name="ProductList"
        options={{
          title: 'Home',
        }}
      />
      {/* <Stack.Screen
        name="ProductDetails/[id]"
        options={{
          title: 'Explorer',
        }}
      /> */}
    </Stack>
  );
}
