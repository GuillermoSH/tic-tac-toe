import { ThemeProvider } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}/>
    </ThemeProvider>
  );
}
