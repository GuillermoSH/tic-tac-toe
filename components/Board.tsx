import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { BoardBtn } from "./BoardBtn";

type BoardProps = {
  squares: (string | null)[];
  onPress: (index: number) => void;
  winningLine?: number[] | null;
};

export function Board({ squares, onPress, winningLine }: BoardProps) {
  return (
    <View className="w-full items-center">
      <View className="flex flex-row flex-wrap w-full max-w-[288px] justify-center">
        {squares.map((value, i) => (
          <Square
            key={i}
            value={value}
            onPress={() => onPress(i)}
            isWinner={winningLine?.includes(i)}
          />
        ))}
      </View>
    </View>
  );
}

type SquareProps = {
  value: string | null;
  onPress: () => void;
  isWinner?: boolean;
};

function Square({ value, onPress, isWinner = false }: SquareProps) {
  const glow = useSharedValue(1);

  useEffect(() => {
    if (isWinner) {
      glow.value = withRepeat(withTiming(1.08, { duration: 1200 }), -1, true);
    } else {
      glow.value = withTiming(1, { duration: 300 });
    }
  }, [isWinner]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glow.value }],
    shadowColor: isWinner ? "#60a5fa" : "transparent",
    shadowOpacity: isWinner ? 0.4 : 0,
    shadowRadius: isWinner ? 10 : 0,
  }));

  return (
    <Animated.View
      style={[animatedStyle, { width: "33.33%", aspectRatio: 1, padding: 4 }]}
    >
      <BoardBtn value={value ?? undefined} onPress={onPress} disabled={!!value} />
    </Animated.View>
  );
}
