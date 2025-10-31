import { Board } from "@/components/Board";
import { BoardSizeSelector } from "@/components/BoardSizeSelector";
import { MovesHistory } from "@/components/MovesHistory";
import { TopBar } from "@/components/TopBar";
import { useTheme } from "@/contexts/ThemeContext";
import { useTicTacToe } from "@/hooks/useTicTacToe";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function Index() {
  const {
    boardSize,
    winner,
    winningLine,
    history,
    isDraw,
    currentSquares,
    currentMove,
    currentPlayer,
    gameOver,
    finalMove,
    handleClick,
    jumpTo,
    resetGame,
  } = useTicTacToe();

  const { themeType } = useTheme();
  const isDark = themeType === "dark";
  const [showSizeSelector, setShowSizeSelector] = useState(false);

  return (
    <SafeAreaView
      className={`flex-1 items-center ${isDark
        ? "bg-neutral-900 text-neutral-100"
        : "bg-neutral-100 text-gray-800"
        }`}
    >
      <TopBar winner={winner} isDraw={isDraw} currentPlayer={currentPlayer} />

      <View className="py-6 px-6 w-full">
        <View className="items-center gap-6 w-full">
          {/* Board */}
          <View className="w-full">
            <Board
              squares={currentSquares}
              onPress={handleClick}
              winningLine={winningLine}
            />
          </View>

          {/* History */}
          <View
            className={`w-full rounded-2xl p-2 border-2 ${isDark
              ? "bg-neutral-800 border-neutral-700"
              : "bg-white border-gray-200"
              }`}
          >
            <MovesHistory
              historyLength={history.length}
              currentMove={currentMove}
              onJump={jumpTo}
              finalMove={finalMove}
              gameOver={gameOver}
              isDraw={isDraw}
            />
          </View>
        </View>

        {/* Mid game pannel */}
        {(!winner && !isDraw) && (
          <View className="mt-6 items-center mb-4">
            <TouchableOpacity className={`py-3 px-6 flex-1 justify-center rounded-xl shadow-md flex-row items-center gap-2 border-2 active:scale-95 active:opacity-90 transition ${isDark ? "bg-cyan-700 border-cyan-400" : "bg-green-600 border-green-500"}`} onPress={() => resetGame()}>
              <Ionicons name="flag" size={20} color="#fff" />
              <Text className="text-white text-lg font-bold">Rendirse</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* End game pannel */}
        {(winner || isDraw) && (
          <View className="mt-6 items-center mb-4">
            {showSizeSelector ? (
              <>
                <BoardSizeSelector
                  currentSize={boardSize}
                  onSelect={(size) => {
                    resetGame(size);
                    setShowSizeSelector(false);
                  }}
                />

                <TouchableOpacity
                  className={`mt-4 py-2 px-6 rounded-xl border-2 active:scale-95 active:opacity-90 ${isDark
                    ? "border-neutral-700 bg-neutral-800"
                    : "border-gray-300 bg-white"
                    }`}
                  onPress={() => setShowSizeSelector(false)}
                >
                  <Text
                    className={`text-base font-medium ${isDark ? "text-neutral-100" : "text-gray-800"
                      }`}
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <View className="flex-row gap-3">
                {/* Botón Cambiar tamaño */}
                <TouchableOpacity
                  className={`py-3 px-6 flex-1 justify-center rounded-xl shadow-md flex-row items-center gap-2 border-2 active:scale-95 active:opacity-90 transition ${isDark
                    ? "bg-cyan-700 border-cyan-400"
                    : "bg-green-600 border-green-500"
                    }`}
                  onPress={() => setShowSizeSelector(true)}
                >
                  <Ionicons name="grid-outline" size={20} color="#fff" />
                  <Text className="text-white text-lg font-bold">Tamaño</Text>
                </TouchableOpacity>

                {/* Botón Reiniciar */}
                <TouchableOpacity
                  className={`py-3 px-6 flex-1 justify-center rounded-xl shadow-md flex-row items-center gap-2 border-2 active:scale-95 active:opacity-90 transition ${isDark
                    ? "bg-indigo-500 border-indigo-400"
                    : "bg-blue-600 border-blue-500"
                    }`}
                  onPress={() => resetGame()}
                >
                  <Ionicons name="refresh-outline" size={20} color="#fff" />
                  <Text className="text-white text-lg font-bold">
                    Reiniciar
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
