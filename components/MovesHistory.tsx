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
        className="h-[120px]"
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
                ? "bg-indigo-500 border-indigo-400"
                : "bg-blue-500 border-blue-400"
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
              ? "!text-white"
              : player === "X"
                ? isDark
                  ? "!text-indigo-500"
                  : "!text-blue-500"
                : isDark
                  ? "!text-amber-500"
                  : "!text-amber-500";

            const finalIcon =
              isFinal && gameOver ? (
                isDraw ? (
                  <Ionicons
                    name="extension-puzzle"
                    size={18}
                    className={isDark ? "!text-amber-200": "!text-yellow-200"}
                  />
                ) : (
                  <Ionicons
                    name="trophy"
                    size={18}
                    className={isDark ? "!text-cyan-400": "!text-emerald-400"}
                  />
                )
              ) : (
                <Ionicons name={iconName} size={18} className={iconColor} />
              );

            const moveText = isFinal && gameOver ? isDraw ? "Jugada para empate" : "Jugada ganadora" : `Jugada #${move}`;

            return (
              <TouchableOpacity
                key={move}
                className={`flex-row items-center justify-between py-2 px-4 rounded-xl border ${bgColor}`}
                onPress={() => onJump(move)}
              >
                <View className="flex-row items-center gap-2">
                  {finalIcon}
                  <Text className={`text-sm ${textColor}`}>{moveText}</Text>
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
