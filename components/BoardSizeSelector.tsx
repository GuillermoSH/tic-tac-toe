import { useTheme } from "@/contexts/ThemeContext";
import { Text, TouchableOpacity, View } from "react-native";

type BoardSizeSelectorProps = {
  currentSize: number;
  onSelect: (size: number) => void;
};

export function BoardSizeSelector({ currentSize, onSelect }: BoardSizeSelectorProps) {
  const { themeType } = useTheme();
  const isDark = themeType === "dark";

  return (
    <View className="items-center ">
      <Text
        className={`text-lg font-semibold mb-3 ${
          isDark ? "text-neutral-100" : "text-gray-800"
        }`}
      >
        Elige el tamaño
      </Text>

      <View className="flex-row gap-3 flex-wrap justify-center">
        {[3, 4, 5, 6, 7].map((size) => (
          <TouchableOpacity
            key={size}
            onPress={() => onSelect(size)}
            className={`py-2 px-4 rounded-lg border-2 ${
              currentSize === size
                ? isDark
                  ? "bg-indigo-500 border-indigo-400"
                  : "bg-blue-500 border-blue-400"
                : isDark
                ? "bg-neutral-800 border-neutral-700"
                : "bg-white border-gray-300"
            }`}
          >
            <Text
              className={`text-lg font-bold ${
                currentSize === size
                  ? "text-white"
                  : isDark
                  ? "text-neutral-200"
                  : "text-gray-800"
              }`}
            >
              {size}x{size}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
