import { Board } from "@/components/Board";
import { MovesHistory } from "@/components/MovesHistory";
import { TopBar } from "@/components/TopBar";
import { useTheme } from "@/contexts/ThemeContext";
import { useTicTacToe } from "@/hooks/useTicTacToe";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import "react-native-reanimated";
import "../global.css";

export default function Index() {
  const {
    currentSquares,
    status,
    winner,
    winningLine,
    history,
    currentMove,
    isDraw,
    handleClick,
    jumpTo,
    resetGame,
  } = useTicTacToe();
  const { themeType } = useTheme();
  const isDark = themeType === "dark";

  return (
    <View
      className={`flex-1 items-center py-16 px-6 ${
        isDark ? "bg-neutral-950 text-neutral-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      <TopBar />

      <View className="items-center gap-6">
        {/* Status */}
        <View className="flex-row items-center gap-2">
          {winner ? (
            <Ionicons name="trophy-outline" size={28} className={isDark ? "!text-cyan-400" : "!text-green-600"} />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={28}
              color={isDark ? "#f59e0b" : "#2563eb"}
            />
          )}
          <Text
            className={`text-3xl font-bold ${
              winner
                ? isDark ? "text-cyan-400" : "text-green-600"
                : isDark ? "text-white" : "text-gray-800"
            }`}
          >
            {status}
          </Text>
        </View>

        {/* Game Board */}
        <View className="w-[288px]">
          <Board
            squares={currentSquares}
            onPress={handleClick}
            winningLine={winningLine}
          />
        </View>

        {/* Moves History */}
        <View
          className={`w-[288px] rounded-2xl shadow-xl p-4 ${
            isDark ? "bg-neutral-800" : "bg-white"
          }`}
        >
          <MovesHistory
            historyLength={history.length}
            currentMove={currentMove}
            onJump={jumpTo}
          />
        </View>
      </View>

      {/* Reset Button */}
      {(winner || isDraw) && (
        <View className="mt-5">
          <TouchableOpacity
            className={`py-3 px-8 rounded-xl shadow-md flex-row items-center gap-2 border-2 active:scale-95 active:opacity-90 transition ${
              isDark
                ? "bg-indigo-500 border-indigo-400"
                : "bg-blue-500 border-blue-400"
            }`}
            onPress={resetGame}
          >
            <Ionicons name="refresh-outline" size={20} color="#fff" />
            <Text className="text-white text-lg font-bold">Reiniciar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
