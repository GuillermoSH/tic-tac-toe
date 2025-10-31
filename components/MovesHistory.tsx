import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type MovesHistoryProps = {
  historyLength: number;
  currentMove: number;
  onJump: (move: number) => void;
  finalMove?: number | null;
  gameOver?: boolean;
  isDraw?: boolean; // 🔹 añadimos esta prop para detectar empate
};

export function MovesHistory({
  historyLength,
  currentMove,
  onJump,
  finalMove,
  gameOver,
  isDraw,
}: MovesHistoryProps) {
  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const moves = Array.from({ length: historyLength - 1 }, (_, i) => i + 1);
  const { themeType } = useTheme();
  const isDark = themeType === "dark";

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [historyLength]);

  return (
    <View className="min-w-full flex flex-col">
      <Text
        className={`text-lg font-semibold mb-3 text-center ${
          isDark ? "text-neutral-100" : "text-gray-700"
        }`}
      >
        Historial de jugadas
      </Text>

      <ScrollView
        ref={scrollViewRef}
        style={{ height: 120 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <View className="flex flex-col gap-2">
          {moves.map((move) => {
            const player = move % 2 === 1 ? "X" : "O";
            const iconName =
              player === "X" ? "close-outline" : "ellipse-outline";
            const isActive = move === currentMove;
            const isFinal = finalMove === move;

            const bgColor = isActive
              ? isDark
                ? "bg-indigo-500 border-indigo-700"
                : "bg-blue-600 border-blue-700"
              : isDark
                ? "bg-neutral-900 border-neutral-700"
                : "bg-neutral-100 border-neutral-300";

            const textColor = isActive
              ? "text-white font-bold"
              : isDark
                ? "text-neutral-100"
                : "text-gray-800";

            const subTextColor = isActive
              ? "text-white/80"
              : isDark
                ? "text-neutral-400"
                : "text-gray-500";

            const iconColor = isActive
              ? "#fff"
              : player === "X"
                ? isDark
                  ? "#818cf8"
                  : "#2563eb"
                : isDark
                  ? "#f59e0b"
                  : "#fb2c36";

            const finalIcon =
              isFinal && gameOver ? (
                isDraw ? (
                  <Ionicons
                    name="extension-puzzle"
                    size={18}
                    color={isDark ? "#fbbf24" : "#eab308"}
                  />
                ) : (
                  <Ionicons
                    name="trophy"
                    size={18}
                    color={isDark ? "#22d3ee" : "#d6ae47"}
                  />
                )
              ) : (
                <Ionicons name={iconName} size={18} color={iconColor} />
              );

            return (
              <TouchableOpacity
                key={move}
                className={`flex-row items-center justify-between py-2 px-4 rounded-xl border ${bgColor}`}
                onPress={() => onJump(move)}
              >
                <View className="flex-row items-center gap-2">
                  {finalIcon}
                  <Text className={`text-sm ${textColor}`}>Jugada #{move}</Text>
                </View>

                <View className="flex-row items-center gap-1">
                  <Text className={`text-sm ${subTextColor}`}>
                    {player} movió
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
