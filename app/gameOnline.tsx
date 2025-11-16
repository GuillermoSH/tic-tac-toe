import { useTheme } from "@/contexts/ThemeContext";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Board } from "@/components/Board";
import { ErrorModal } from "@/components/ErrorModal";
import { MovesHistory } from "@/components/MovesHistory";
import { StartModal } from "@/components/StartModal";
import SurrenderBtn from "@/components/SurrenderBtn";
import { TopBar } from "@/components/TopBar";

import { StatsPanelOnline } from "@/components/StatsPanelOnline";
import { useDeviceStats } from "@/hooks/useDeviceStats";
import { useTicTacToeOnline } from "@/hooks/useTicTacToeOnline";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import "../global.css";

export default function GameOnline() {
  const {
    deviceId,
    mySymbol,
    waitingForOpponent,
    showStartModal,
    startingPlayer,
    currentSquares,
    currentMove,
    currentPlayer,
    winningLine,
    winner,
    isDraw,
    gameOver,
    history,
    finalMove,
    errorMessage,
    handleClick,
    surrender,
    terminateGame,
  } = useTicTacToeOnline();

  const { themeType } = useTheme();
  const isDark = themeType === "dark";
  const [statsVisible, setStatsVisible] = useState(false);
  const { stats, loadingStats } = useDeviceStats(deviceId, statsVisible);
  const [waitSeconds, setWaitSeconds] = useState(0);

  useEffect(() => {
    if (!waitingForOpponent) {
      setWaitSeconds(0);
      return;
    }

    const interval = setInterval(
      () => setWaitSeconds((prev) => prev + 1),
      1000
    );
    return () => clearInterval(interval);
  }, [waitingForOpponent]);

  const handleCancelSearch = () => {
    terminateGame();
  };

  if (waitingForOpponent) {
    return (
      <SafeAreaView
        className={`flex-1 items-center justify-center ${
          isDark ? "bg-neutral-900" : "bg-neutral-100"
        }`}
      >
        <ActivityIndicator size="large" />
        <Text
          className={`mt-4 text-3xl ${
            isDark ? "text-neutral-200" : "text-gray-700"
          }`}
        >
          Esperando rival...
        </Text>

        {waitSeconds >= 10 && (
          <TouchableOpacity
            onPress={handleCancelSearch}
            className={`mt-4 py-2 px-6 rounded-xl border-2 ${
              isDark ? "border-red-500 bg-red-600" : "border-red-400 bg-red-500"
            }`}
          >
            <Text className="text-white text-sm font-semibold">
              Cancelar búsqueda
            </Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className={`flex-1 items-center ${
        isDark ? "bg-neutral-900" : "bg-neutral-100"
      }`}
    >
      <StartModal startingPlayer={startingPlayer} visible={showStartModal} />
      <Modal
        transparent
        animationType="slide"
        visible={statsVisible}
        onRequestClose={() => setStatsVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 items-center justify-center"
          onPress={() => setStatsVisible(false)}
        >
          <View className="w-[85%]">
            {!loadingStats && <StatsPanelOnline stats={stats} />}
          </View>
        </Pressable>
      </Modal>

      <TopBar
        winner={winner}
        isDraw={isDraw}
        currentPlayer={currentPlayer}
        onShowStats={() => setStatsVisible(true)}
      />

      {/* Error (como turno incorrecto) */}
      <ErrorModal errorMessage={errorMessage ?? ""} visible={!!errorMessage} />

      <View className="py-6 px-6 w-full">
        <View className="items-center gap-6 w-full">
          {/* Indicador de turno */}
          {deviceId && currentPlayer && (
            <View className="w-full items-center my-4">
              <Text
                className={`text-xl font-bold ${currentPlayer == "X" ? isDark ?"text-indigo-400" : "text-blue-500" : isDark ? "text-amber-500" : "text-amber-500"}`}
              >
                {!winner && !isDraw
                  ? currentPlayer === mySymbol ? "¡Te toca!" : "Esperando al rival..."
                  : "¡Se acabó!" }
              </Text>
            </View>
          )}

          {/* TABLERO */}
          <View className="w-full">
            <Board
              squares={currentSquares}
              onPress={handleClick}
              winningLine={winningLine}
            />
          </View>

          {/* HISTORIAL */}
          <View
            className={`w-full rounded-2xl p-2 border-2 ${
              isDark
                ? "bg-neutral-800 border-neutral-700"
                : "bg-white border-gray-200"
            }`}
          >
            <MovesHistory
              historyData={history}
              currentMove={currentMove}
              onJump={() => {}}
              finalMove={finalMove}
              gameOver={gameOver}
              isDraw={isDraw}
            />
          </View>
        </View>

        {/* BOTÓN RENDIRSE */}
        {!winner && !isDraw && history.length > 1 && (
          <SurrenderBtn
            currentPlayer={mySymbol!}
            surrender={surrender}
          />
        )}

        {/* PANEL DE FIN DE PARTIDA */}
        {(winner || isDraw) && (
          <View className="mt-6 flex items-center mb-4">
            <TouchableOpacity
              className={`w-full py-3 px-6 justify-center rounded-xl shadow-md flex-row items-center gap-2 border-2 active:scale-95 active:opacity-90 transition ${
                isDark
                  ? "bg-indigo-500 border-indigo-400"
                  : "bg-blue-500 border-blue-400"
              }`}
              onPress={() => terminateGame()}
            >
              <Ionicons name="home" size={20} color="#fff" />
              <Text className="text-white text-lg font-bold">Volver</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
