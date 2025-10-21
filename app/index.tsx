import { Board } from "@/components/Board";
import calculateWinner from "@/lib/calculateWinner";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import "../global.css";

export default function Index() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handlePress(i: number) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Ganador: " + winner;
  } else {
    status = "Siguiente jugador: " + (xIsNext ? "X" : "O");
  }

  return (
    <View className="flex-1 relative justify-center items-center">
      <Text className="absolute top-32 text-2xl">{status}</Text>
      <Board squares={squares} onPress={handlePress}></Board>
      {winner && (
        <TouchableOpacity className="py-2 px-4 bg-blue-500">
          <Text className="text-xl">Reiniciar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
