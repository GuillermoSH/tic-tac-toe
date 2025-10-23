import { View } from "react-native";
import { BoardBtn } from "./BoardBtn";
import { Row } from "./Row";

type BoardProps = {
  squares: (string | null)[];
  onPress: (index: number) => void;
  winningLine?: number[] | null;
};

export function Board({ squares, onPress, winningLine }: BoardProps) {
  const rows = [];
  for (let i = 0; i < squares.length; i += 3) {
    rows.push(squares.slice(i, i + 3));
  }

  return (
    <View className="items-center w-full max-w-[288px]">
      {rows.map((row, rowIndex) => (
        <Row key={rowIndex}>
          {row.map((value, colIndex) => {
            const index = rowIndex * 3 + colIndex;
            const isWinner = winningLine?.includes(index);

            return (
              <View
                key={index}
                className={`flex-1 aspect-square p-1`}
              >
                <BoardBtn
                  value={value ?? undefined}
                  onPress={() => onPress(index)}
                  disabled={!!value}
                  isWinner={isWinner}
                />
              </View>
            );
          })}
        </Row>
      ))}
    </View>
  );
}
