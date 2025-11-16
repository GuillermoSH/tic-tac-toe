import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function SurrenderBtn({
  currentPlayer,
  surrender,
}: {
  currentPlayer: "X" | "O";
  surrender: () => void;
}) {
  const { themeType, toggleTheme } = useTheme();
  const isDark = themeType === "dark";

  return (
    <View className="mt-6 h-16 mb-4">
      <TouchableOpacity
        className={`py-3 px-6 justify-center rounded-xl shadow-md flex-row items-center gap-2 border-2 active:scale-95 active:opacity-90 transition 
                        ${currentPlayer == "X" ? (isDark ? "bg-indigo-400 border-indigo-200" : "bg-blue-500 border-blue-300") : isDark ? "bg-amber-500 border-amber-300" : "bg-amber-500 border-amber-300"}`}
        onPress={surrender}
      >
        <Ionicons name="flag" size={20} color="#fff" />
        <Text className="text-white text-lg font-bold">Rendirse</Text>
      </TouchableOpacity>
    </View>
  );
}
