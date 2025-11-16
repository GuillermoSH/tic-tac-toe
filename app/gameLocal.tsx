import { Board } from "@/components/Board";
import EndGamePannel from "@/components/EndGamePannel";
import { MovesHistory } from "@/components/MovesHistory";
import { StartModal } from "@/components/StartModal";
import { StatsPanel } from "@/components/StatsPanel";
import SurrenderBtn from "@/components/SurrenderBtn";
import { TopBar } from "@/components/TopBar";
import { useTheme } from "@/contexts/ThemeContext";
import { useGameStats } from "@/hooks/useGameStats";
import { useTicTacToeLocal } from "@/hooks/useTicTacToeLocal";
import { useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function GameLocal() {
  const { addGame } = useGameStats();

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
  } = useTicTacToeLocal(3, { onGameEnd: addGame });

  const { themeType } = useTheme();
  const isDark = themeType === "dark";
  const [statsVisible, setStatsVisible] = useState(false);

  return (
    <SafeAreaView
      className={`flex-1 items-center ${isDark
        ? "bg-neutral-900 text-neutral-100"
        : "bg-neutral-100 text-gray-800"
        }`}
    >
      <StartModal startingPlayer={startingPlayer} visible={showStartModal} />
      <TopBar winner={winner} isDraw={isDraw} currentPlayer={currentPlayer} onShowStats={() => setStatsVisible(true)}/>
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
            <StatsPanel winner={winner} isDraw={isDraw} />
          </View>
        </Pressable>
      </Modal>

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
        {((!winner && !isDraw) && history.length > 1) && (
          <SurrenderBtn currentPlayer={currentPlayer} surrender={surrender} />
        )}

        {/* End game pannel */}
        {(winner || isDraw) && (
          <EndGamePannel boardSize={boardSize} resetGame={resetGame} />
        )}
      </View>
    </SafeAreaView>
  );
}