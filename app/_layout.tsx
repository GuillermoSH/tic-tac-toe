import { ThemeProvider } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="game" />
      </Stack>
    </ThemeProvider>
  );
}
