import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type ErrorModalProps = {
  errorMessage: string;
  visible: boolean;
};

export function ErrorModal({ errorMessage, visible }: ErrorModalProps) {
  const { themeType } = useTheme();
  const isDark = themeType === "dark";

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(400)}
      className="absolute inset-0 flex items-center justify-center bg-black/70 z-50"
    >
      <View
        className={`px-10 py-6 rounded-3xl shadow-lg ${
          isDark ? "bg-neutral-800" : "bg-white"
        } items-center`}
      >
        {errorMessage.includes("rendido") ? (
          <Ionicons
            name="flag-outline"
            size={58}
            color={isDark ? "#f59e0b" : "#d97706"}
          />
        ) : (
          <Ionicons
            name="alert-circle-outline"
            size={58}
            color={isDark ? "#ef4444" : "#dc2626"}
          />
        )}
        <Text
          className={`text-2xl font-semibold my-2 ${
            isDark ? "text-neutral-100" : "text-gray-800"
          }`}
        >
          {errorMessage}
        </Text>
      </View>
    </Animated.View>
  );
}
