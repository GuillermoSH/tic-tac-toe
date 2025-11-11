import { useTheme } from "@/contexts/ThemeContext";
import { useGameStats } from "@/hooks/useGameStats";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type StatsPanelProps = {
  winner: string | null;
  isDraw: boolean;
};

export function StatsPanel({ winner, isDraw }: StatsPanelProps) {
  const { stats, resetStats } = useGameStats();
  const { themeType } = useTheme();
  const isDark = themeType === "dark";

  const {
    total = 0,
    winsX = 0,
    winsO = 0,
    draws = 0,
    winRateX = 0,
    winRateO = 0,
  } = stats;

  return (
    <View
      className={`p-6 rounded-2xl border shadow-lg ${
        isDark
          ? "bg-neutral-900 border-neutral-700"
          : "bg-white border-gray-200"
      }`}
    >
      <Text
        className={`text-2xl font-bold mb-6 text-center ${
          isDark ? "text-neutral-100" : "text-gray-800"
        }`}
      >
        Estadísticas de jugadores
      </Text>

      {/* Columnas de jugadores */}
      <View className="flex-row justify-between mb-6">
        {/* Jugador X */}
        <View className="flex-1 items-center border-r border-neutral-500 pr-3">
          <Text
            className={`text-xl font-bold mt-2 ${
              isDark ? "text-indigo-400" : "text-blue-500"
            }`}
          >
            Jugador X
          </Text>
          <Text
            className={`text-4xl font-extrabold ${
              isDark ? "text-indigo-300" : "text-blue-600"
            }`}
          >
            {winsX}
          </Text>
          <Text
            className={`text-sm ${
              isDark ? "text-neutral-400" : "text-gray-500"
            }`}
          >
            {winRateX.toFixed(1)}% victorias
          </Text>
        </View>

        {/* Jugador O */}
        <View className="flex-1 items-center pl-3">
          <Text
            className={`text-xl font-bold mt-2 ${
              isDark ? "text-amber-400" : "text-amber-500"
            }`}
          >
            Jugador O
          </Text>
          <Text
            className={`text-4xl font-extrabold ${
              isDark ? "text-amber-300" : "text-amber-600"
            }`}
          >
            {winsO}
          </Text>
          <Text
            className={`text-sm ${
              isDark ? "text-neutral-400" : "text-gray-500"
            }`}
          >
            {winRateO.toFixed(1)}% victorias
          </Text>
        </View>
      </View>

      {/* Empates y partidas totales */}
      <View className="flex-row justify-between mb-4 px-2">
        <Text
          className={`text-base font-medium ${
            isDark ? "text-neutral-300" : "text-gray-600"
          }`}
        >
          🤝 Empates: {draws}
        </Text>
        <Text
          className={`text-base font-medium ${
            isDark ? "text-neutral-300" : "text-gray-600"
          }`}
        >
          🎮 Total: {total}
        </Text>
      </View>

      {/* Botón borrar */}
      {(winner != null || isDraw) && (<TouchableOpacity
        onPress={resetStats}
        className={`mt-2 py-3 rounded-xl flex-row justify-center items-center gap-2 active:scale-95 transition ${isDark
            ? "bg-red-600/80 border border-red-500"
            : "bg-red-500 border border-red-400"
          }`}
      >
        <Ionicons name="trash-outline" size={18} color="#fff" />
        <Text className="text-white font-semibold">Borrar estadísticas</Text>
      </TouchableOpacity>)}
    </View>
  );
}
