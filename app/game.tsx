import { Board } from "@/components/Board";
import { BoardSizeSelector } from "@/components/BoardSizeSelector";
import { ErrorModal } from "@/components/ErrorModal";
import { MovesHistory } from "@/components/MovesHistory";
import { StartModal } from "@/components/StartModal";
import { TopBar } from "@/components/TopBar";
import { useTheme } from "@/contexts/ThemeContext";
import { useGameStats } from "@/hooks/useGameStats";
import { useTicTacToe } from "@/hooks/useTicTacToe";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function Game() {
  const { addGame } = useGameStats();
  const { gameType } = useLocalSearchParams();

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
    startingPlayer,
    showStartModal,
    handleClick,
    jumpTo,
    resetGame,
    surrender,
    // online
    deviceId,
    matchId,
    turn,
    status,
    error,
    showErrorModal,
    errorMessage,
    turnSymbol,
  } = useTicTacToe(3, {
    onGameEnd: addGame,
    selectedGameType: gameType === "online" ? "online" : "local",
  });

  const { themeType } = useTheme();
  const isDark = themeType === "dark";
  const [showSizeSelector, setShowSizeSelector] = useState(false);

  const isOnline = gameType === "online";

  return (
    <SafeAreaView
      className={`flex-1 items-center ${
        isDark ? "bg-neutral-900" : "bg-neutral-100"
      }`}
    >
      <StartModal startingPlayer={startingPlayer} visible={showStartModal} />
      <ErrorModal
        errorMessage={errorMessage as string}
        visible={showErrorModal}
      />
      <TopBar
        winner={winner}
        isDraw={isDraw}
        currentPlayer={
          gameType === "online" ? (turnSymbol ?? currentPlayer) : currentPlayer
        }
      />

      <View className="py-6 px-6 w-full items-center">
        {/* 🔹 Estado online */}
        {isOnline && (
          <View className="mb-4">
            {status === "waiting" && (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color={isDark ? "#fff" : "#000"} />
                <Text
                  className={`text-base ${
                    isDark ? "text-neutral-200" : "text-gray-700"
                  }`}
                >
                  Esperando rival...
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Tablero */}
        <Board
          squares={currentSquares}
          onPress={(index) => {
            // 🔹 Solo permitir clicks si se puede jugar
            if (!isOnline || status === "playing") handleClick(index);
          }}
          winningLine={winningLine}
        />

        {/* Historial */}
        <View
          className={`mt-6 w-full rounded-2xl p-2 border-2 ${
            isDark
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

        {/* Botón rendirse */}
        {!winner && !isDraw && history.length > 1 && (
          <View className="mt-6 h-16 mb-4">
            <TouchableOpacity
              className={`py-3 px-6 h-max flex-1 justify-center rounded-xl shadow-md flex-row items-center gap-2 border-2 active:scale-95 active:opacity-90 transition 
              ${
                currentPlayer == "X"
                  ? isDark
                    ? "bg-indigo-400 border-indigo-200"
                    : "bg-blue-500 border-blue-300"
                  : isDark
                    ? "bg-amber-500 border-amber-300"
                    : "bg-amber-500 border-amber-300"
              }`}
              onPress={surrender}
            >
              <Ionicons name="flag" size={20} color="#fff" />
              <Text className="text-white text-lg font-bold">Rendirse</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Panel fin de partida */}
        {(winner || isDraw) && gameType != "online" && (
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
                  className={`mt-4 py-2 px-6 rounded-xl border-2 active:scale-95 active:opacity-90 ${
                    isDark
                      ? "border-neutral-700 bg-neutral-800"
                      : "border-gray-300 bg-white"
                  }`}
                  onPress={() => setShowSizeSelector(false)}
                >
                  <Text
                    className={`text-base font-medium ${
                      isDark ? "text-neutral-100" : "text-gray-800"
                    }`}
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className={`py-3 px-6 flex-1 justify-center rounded-xl shadow-md flex-row items-center gap-2 border-2 active:scale-95 active:opacity-90 transition ${
                    isDark
                      ? "bg-cyan-700 border-cyan-400"
                      : "bg-emerald-500 border-emerald-400"
                  }`}
                  onPress={() => setShowSizeSelector(true)}
                >
                  <Ionicons name="grid-outline" size={20} color="#fff" />
                  <Text className="text-white text-lg font-bold">Tamaño</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`py-3 px-6 flex-1 justify-center rounded-xl shadow-md flex-row items-center gap-2 border-2 active:scale-95 active:opacity-90 transition ${
                    isDark
                      ? "bg-indigo-500 border-indigo-400"
                      : "bg-blue-500 border-blue-400"
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
