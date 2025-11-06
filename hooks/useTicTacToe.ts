import calculateWinner from "@/lib/calculateWinner";
import type { GameResult } from "@/lib/gameStorage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import uuid from "react-native-uuid";

type UseTicTacToeOptions = {
  onGameEnd?: (result: GameResult) => void;
  selectedGameType?: string;
};

export function useTicTacToe(initialSize: number = 3, options?: UseTicTacToeOptions) {
  const [boardSize, setBoardSize] = useState(initialSize);
  const [gameType, setGameType] = useState("local");
  const [history, setHistory] = useState([Array(initialSize * initialSize).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [finalMove, setFinalMove] = useState<number | null>(null);
  const [finalResult, setFinalResult] = useState<{ winner: "X" | "O" | null; isDraw: boolean } | null>(null);
  const [startingPlayer, setStartingPlayer] = useState<"X" | "O">("X");
  const [showStartModal, setShowStartModal] = useState(true);

  const currentSquares = history[currentMove];
  const currentPlayer: "X" | "O" = (currentMove % 2 === 0 ? startingPlayer : startingPlayer === "X" ? "O" : "X");
  const canPlay = !gameOver && !showStartModal;
  const safeSquares = currentSquares ?? Array(boardSize * boardSize).fill(null);
  const { winner, winningLine, isDraw } = calculateWinner(safeSquares, boardSize);

  useEffect(() => {
    console.log(options?.selectedGameType);
    if (options?.selectedGameType) setGameType(options?.selectedGameType);
    console.log(gameType);
    startNewGame(gameType);
  }, [boardSize]);

  const saveDeviceToApi = () => {
    return fetch('http://localhost:5000/devices', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        alias: Math.random()
      })
    })
  }

  function startNewGame(gameType: string) {
    const random = Math.random() < 0.5 ? "X" : "O";
    setStartingPlayer(random);
    setShowStartModal(true);

    if (gameType == "online") {
      saveDeviceToApi;
    }

    const timer = setTimeout(() => setShowStartModal(false), 1500);
    return () => clearTimeout(timer);
  }

  function registerResult(
    winner: "X" | "O" | null,
    isDraw: boolean,
    surrendered?: boolean
  ) {
    const result: GameResult = {
      id: uuid.v4() as string,
      date: new Date().toISOString(),
      boardSize,
      winner,
      isDraw,
      moves: currentMove,
      surrendered,
    };
    options?.onGameEnd?.(result);
  }

  function handleClick(index: number) {
    if (!canPlay || currentSquares[index]) return;

    const nextSquares = currentSquares.slice();
    nextSquares[index] = currentPlayer;

    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const result = calculateWinner(nextSquares, boardSize);

    if (result.winner || result.isDraw) {
      setGameOver(true);
      setFinalMove(nextHistory.length - 1);
      setFinalResult({
        winner: result.winner,
        isDraw: result.isDraw,
      });

      registerResult(result.winner, result.isDraw);
    }
  }

  function surrender() {
    if (gameOver) return;
    const opponent = currentPlayer === "X" ? "O" : "X";
    setGameOver(true);
    setFinalResult({ winner: opponent, isDraw: false });
    registerResult(opponent, false, true);
    if (gameType == "online") router.navigate("/");
  }

  function jumpTo(move: number) {
    setCurrentMove(move);
  }

  function resetGame(newSize?: number) {
    const size = newSize || boardSize;
    setBoardSize(size);
    setHistory([Array(size * size).fill(null)]);
    setCurrentMove(0);
    setGameOver(false);
    setFinalMove(null);
    setFinalResult(null);
    startNewGame(gameType);
  }

  return {
    boardSize,
    winner: finalResult ? finalResult.winner : winner,
    winningLine,
    history,
    isDraw: finalResult ? finalResult.isDraw : isDraw,
    currentSquares: safeSquares,
    currentMove,
    currentPlayer,
    startingPlayer,
    showStartModal,
    gameOver,
    finalMove,
    gameType,
    setGameType,
    handleClick,
    jumpTo,
    resetGame,
    surrender,
  };
}
