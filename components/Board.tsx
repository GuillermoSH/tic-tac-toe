import { View } from "react-native";
import { BoardBtn } from "./BoardBtn";
import { Row } from "./Row";

type BoardProps = {
  squares: (string | null)[];
  onPress: (index: number) => void;
  winningLine?: number[] | null;
};

export function Board({ squares, onPress, winningLine }: BoardProps) {
  const size = Math.sqrt(squares.length);

  // 🔹 Escala de tamaño de ícono según tamaño del tablero
  const iconSize =
    size === 3
      ? 75
      : size === 4
      ? 55
      : size === 5
      ? 50
      : size === 6
      ? 40
      : 37; // para 7 o más

  // 🔹 Crear filas del tablero
  const rows = [];
  for (let i = 0; i < squares.length; i += size) {
    rows.push(squares.slice(i, i + size));
  }

  return (
    <View className="w-full flex gap-2">
      {rows.map((row, rowIndex) => (
        <Row key={rowIndex}>
          {row.map((value, colIndex) => {
            const index = rowIndex * size + colIndex;
            const isWinner = winningLine?.includes(index);

            return (
              <View key={index} className="flex-1 aspect-square">
                <BoardBtn
                  value={value ?? undefined}
                  onPress={() => onPress(index)}
                  disabled={!!value}
                  isWinner={isWinner}
                  iconSize={iconSize}
                />
              </View>
            );
          })}
        </Row>
      ))}
    </View>
  );
}
