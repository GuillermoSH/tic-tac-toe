import { useTheme } from "@/contexts/ThemeContext";
import { StatsData } from "@/hooks/useDeviceStats";
import { Text, View } from "react-native";

type StatsPanelOnlineProps = {
  stats: StatsData;
};

export function StatsPanelOnline({ stats }: StatsPanelOnlineProps) {
  const { themeType } = useTheme();
  const isDark = themeType === "dark";

  const { wins, losses, ratio } = stats;
  const total = wins + losses;
  const winRate = ratio * 100;

  return (
    <View
      className={`p-6 rounded-2xl border shadow-lg ${
        isDark ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-200"
      }`}
    >
      <Text
        className={`text-2xl font-bold mb-6 text-center ${
          isDark ? "text-neutral-100" : "text-gray-800"
        }`}
      >
        Estadísticas del dispositivo
      </Text>

      <View className="flex-col items-center mb-6">
        <Text className={`text-xl font-bold ${isDark ? "text-indigo-400" : "text-blue-500"}`}>
          Partidas ganadas
        </Text>
        <Text className={`text-4xl font-extrabold ${isDark ? "text-indigo-300" : "text-blue-600"}`}>
          {wins}
        </Text>
        <Text className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
          WinRate del {winRate.toFixed(1)}%
        </Text>
      </View>

      <View className="flex-row justify-between mb-4 px-2">
        <Text className={`text-base font-medium ${isDark ? "text-neutral-300" : "text-gray-600"}`}>
          💥 Partidas perdidas: {losses}
        </Text>
      </View>
    </View>
  );
}
