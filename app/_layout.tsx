import { ThemeProvider } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <ThemeProvider children={<Stack screenOptions={{ headerShown: false }} />} />
  );
}
