import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  Easing,
  TouchableOpacity,
  View,
} from "react-native";

export const TopBar = () => {
  const { toggleTheme, themeType } = useTheme();

  const rotation = useRef(new Animated.Value(0)).current;


  const animateIcon = () => {
    Animated.timing(rotation, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      rotation.setValue(0);
    });
  };

  const handleToggleTheme = () => {
    animateIcon();
    setTimeout(toggleTheme, 50);
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="mb-4 mt-2">
        <TouchableOpacity onPress={handleToggleTheme} activeOpacity={0.7}>
          <Animated.View
            style={{
              transform: [{ rotate: rotateInterpolate }],
            }}
          >
            <Ionicons
              name={themeType === "dark" ? "sunny" : "moon"}
              size={28}
              className={themeType === "dark" ? "!text-white" : "!text-black"}
            />
          </Animated.View>
        </TouchableOpacity>
    </View>
  );
};
