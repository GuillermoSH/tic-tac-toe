import calculateWinner from "@/lib/calculateWinner";
import { useState } from "react";

export function useTicTacToe(initialSize: number = 3) {
  const [boardSize, setBoardSize] = useState(initialSize);
  const [history, setHistory] = useState([
    Array(initialSize * initialSize).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [finalMove, setFinalMove] = useState<number | null>(null);
  const [finalResult, setFinalResult] = useState<{
    winner: "X" | "O" | null;
    isDraw: boolean;
  } | null>(null);

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const currentPlayer: "X" | "O" = xIsNext ? "X" : "O";

  // 🔹 Si el juego ya terminó, mantenemos el resultado final
  const { winner, winningLine, isDraw } = gameOver
    ? calculateWinner(history[finalMove!], boardSize)
    : calculateWinner(currentSquares, boardSize);

  function handleClick(index: number) {
    if (gameOver || currentSquares[index]) return;

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
    }
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
  }

  // 🟢 Status siempre refleja empate, ganador o turno actual
  const status = finalResult
    ? finalResult.isDraw
      ? "Empate"
      : `Ganador: ${finalResult.winner}`
    : winner
    ? `Ganador: ${winner}`
    : isDraw
    ? "Empate"
    : `Turno de ${currentPlayer}`;

  return {
    boardSize,
    status,
    winner: finalResult ? finalResult.winner : winner,
    winningLine,
    history,
    isDraw: finalResult ? finalResult.isDraw : isDraw,
    currentSquares,
    currentMove,
    currentPlayer,
    gameOver,
    finalMove,
    handleClick,
    jumpTo,
    resetGame,
  };
}
