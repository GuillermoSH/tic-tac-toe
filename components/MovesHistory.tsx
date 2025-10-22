import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type MovesHistoryProps = {
  historyLength: number;
  currentMove: number;
  onJump: (move: number) => void;
};

export function MovesHistory({
  historyLength,
  currentMove,
  onJump,
}: MovesHistoryProps) {
  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const moves = Array.from({ length: historyLength - 1 }, (_, i) => i + 1);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [historyLength]);

  return (
    <View className="flex flex-col">
      <Text className="text-lg font-semibold mb-3 text-center text-gray-700 dark:text-white">
        Historial de jugadas
      </Text>

      <ScrollView
        ref={scrollViewRef}
        style={{ height: 200 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <View className="flex flex-col gap-2">
          {moves.map((move) => {
            const player = move % 2 === 1 ? "X" : "O";
            const iconName = player === "X" ? "close-outline" : "ellipse-outline";
            const isActive = move === currentMove;
            return (
              <TouchableOpacity
                key={move}
                className={`flex-row items-center justify-between py-2 px-4 rounded-xl border ${
                  isActive
                    ? "bg-blue-600 border-blue-700 dark:bg-indigo-600 dark:border-indigo-700"
                    : "bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-600"
                }`}
                onPress={() => onJump(move)}
              >
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name={iconName}
                    size={20}
                    className={isActive ? "!text-white" : "!text-blue-600 dark:!text-indigo-600"}
                  />
                  <Text
                    className={`text-base ${
                      isActive ? "text-white font-bold" : "text-gray-800 dark:!text-white"
                    }`}
                  >
                    Jugada #{move}
                  </Text>
                </View>
                <Text
                  className={`text-sm ${
                    isActive ? "text-white/80" : "text-gray-500 dark:text-neutral-400"
                  }`}
                >
                  {player} movió
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
