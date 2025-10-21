import { Board } from "@/components/Board";
import calculateWinner from "@/lib/calculateWinner";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import "../global.css";

export default function Index() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares: Array<string>) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleClick(i: number) {
    if (currentSquares[i] || calculateWinner(currentSquares)) {
      return;
    }
    const nextSquares = currentSquares.slice();

    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    handlePlay(nextSquares);
  }

  const winner = calculateWinner(currentSquares);
  let status;
  if (winner) {
    status = "Ganador: " + winner;
  } else {
    status = "Siguiente jugador: " + (xIsNext ? "X" : "O");
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Ir hacia la jugada #' + move;
    } else {
      description = 'Ir al inicio del juego';
    }
    return (
      <View key={move}>
        <TouchableOpacity className="bg-neutral-400 py-1 px-3" onPress={() => jumpTo(move)}>
          <Text>
            {description}
          </Text>
        </TouchableOpacity>
      </View>
    );
  });

  return (
    <View className="flex-1 relative justify-center items-center">
      <Text className="absolute top-32 text-2xl">{status}</Text>
      <Board squares={currentSquares} onPress={handleClick}></Board>
      <View className="flex flex-col">
        {moves}
      </View>
      {winner && (
        <TouchableOpacity className="py-2 px-4 bg-blue-500">
          <Text className="text-xl">Reiniciar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
