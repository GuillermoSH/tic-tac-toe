import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type StartModalProps = {
  startingPlayer: "X" | "O";
  visible: boolean;
};

export function StartModal({ startingPlayer, visible }: StartModalProps) {
  const { themeType } = useTheme();
  const isDark = themeType === "dark";

  if (!visible) return null;

  const icon =
    startingPlayer === "X" ? (
      <Ionicons name="close-outline" size={64} color={isDark ? "#6366f1" : "#3b82f6"} />
    ) : (
      <Ionicons name="ellipse-outline" size={64} color={isDark ? "#fbbf24" : "#fbbf24"} />
    );

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
        <Text
          className={`text-xl font-semibold mb-2 ${
            isDark ? "text-neutral-100" : "text-gray-800"
          }`}
        >
          Empieza el jugador
        </Text>
        <View className="flex-row items-center gap-2">
          {icon}
        </View>
      </View>
    </Animated.View>
  );
}
