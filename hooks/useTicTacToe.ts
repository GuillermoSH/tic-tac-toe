import calculateWinner from "@/lib/calculateWinner";
import { useState } from "react";

export function useTicTacToe() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const winnerInfo = calculateWinner(currentSquares);
  const winner = winnerInfo?.winner;
  const winningLine = winnerInfo?.line;

  function handleClick(i: number) {
    if (currentSquares[i] || winner) return;

    const nextSquares = currentSquares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";

    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move: number) {
    setCurrentMove(move);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const status = winner
    ? `Ganador: ${winner}`
    : `Siguiente jugador: ${xIsNext ? "X" : "O"}`;

  return {
    history,
    currentSquares,
    currentMove,
    xIsNext,
    winner,
    winningLine,
    status,
    handleClick,
    jumpTo,
    resetGame,
  };
}
