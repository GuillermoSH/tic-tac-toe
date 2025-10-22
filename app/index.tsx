import { Board } from "@/components/Board";
import { MovesHistory } from "@/components/MovesHistory";
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
    handleClick,
    jumpTo,
    resetGame,
  } = useTicTacToe();

  return (
    <View className="flex-1 bg-gray-100 dark:bg-black text-black dark:text-white items-center py-16 px-6">

      {/* Game Area (status + board + history) */}
      <View className="items-center gap-5">
        {/* Status */}
        <View className="flex-row items-center gap-2">
          {winner ? (
            <Ionicons name="trophy-outline" size={26} className="!text-green-600" />
          ) : (
            <Ionicons name="person-circle-outline" size={26} className="!text-blue-600" />
          )}
          <Text
            className={`text-2xl font-semibold ${
              winner ? "text-green-600" : "text-gray-800 dark:text-white"
            }`}
          >
            {status}
          </Text>
        </View>

        {/* Game Board (slightly larger, same width as history) */}
        <View className="w-[288px]"> 
          <Board
            squares={currentSquares}
            onPress={handleClick}
            winningLine={winningLine}
          />
        </View>

        {/* Moves History */}
        <View className="w-[288px] bg-white dark:bg-neutral-700 rounded-2xl shadow-lg p-4">
          <MovesHistory
            historyLength={history.length}
            currentMove={currentMove}
            onJump={jumpTo}
          />
        </View>
      </View>

      {/* Reset Button (fixed bottom area, no layout shift) */}
      <View className="mt-4">
        {winner && (
          <TouchableOpacity
            className="py-3 px-8 bg-blue-600 dark:bg-indigo-600 rounded-xl shadow-md flex-row items-center gap-2 active:scale-95 transition"
            onPress={resetGame}
          >
            <Ionicons name="refresh-outline" size={20} color="#fff" />
            <Text className="text-white text-lg font-bold">Reiniciar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
