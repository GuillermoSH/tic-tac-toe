import React, { createContext, ReactNode, useContext, useState } from "react";
import { useColorScheme } from "react-native";

export type ThemeType = "light" | "dark";

const ThemeContext = createContext<{
  themeType: ThemeType;
  toggleTheme: () => void;
}>({
  themeType: "dark",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme();

  const [themeType, setThemeType] = useState<ThemeType>(
    systemScheme === "light" ? "light" : "dark"
  );

  const toggleTheme = () =>
    setThemeType((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ themeType, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
