import { StatsPanel } from "@/components/StatsPanel";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

type TopBarProps = {
  winner: string | null;
  isDraw: boolean;
  currentPlayer: "X" | "O";
};

export function TopBar({ winner, isDraw, currentPlayer }: TopBarProps) {
  const { themeType, toggleTheme } = useTheme();
  const isDark = themeType === "dark";
  const [menuVisible, setMenuVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const router = useRouter();

  let iconName: keyof typeof Ionicons.glyphMap = "person-circle-outline";
  let iconColor =
    currentPlayer === "X"
      ? isDark
        ? "!text-indigo-500"
        : "!text-blue-500"
      : isDark
        ? "!text-amber-500"
        : "!text-amber-500";
  let text = `Juega ${currentPlayer}`;
  let textColor = isDark ? "text-white" : "text-gray-800";

  if (winner) {
    iconName = "trophy-outline";
    iconColor = isDark ? "!text-cyan-400" : "!text-emerald-400";
    text = `Ganador: ${winner}`;
    textColor = isDark ? "text-cyan-400" : "text-emerald-400";
  } else if (isDraw) {
    iconName = "extension-puzzle";
    iconColor = isDark ? "!text-amber-400" : "!text-yellow-600";
    text = "Empate";
    textColor = isDark ? "!text-amber-400" : "!text-yellow-600";
  }

  return (
    <View
      className={`w-full border-b-2 ${isDark ? "border-neutral-700" : "border-neutral-200"} flex-row justify-between items-center px-4 py-3`}
    >
      {/* Izquierda vacía */}
      <View className="w-6" />

      {/* Centro — Estado del juego */}
      <View className="flex-row items-center gap-2">
        <Ionicons name={iconName} size={26} className={iconColor} />
        <Text className={`text-2xl font-bold ${textColor}`}>{text}</Text>
      </View>

      {/* Derecha — Menú de opciones */}
      <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <Ionicons
          name="ellipsis-vertical"
          size={24}
          color={isDark ? "#e5e5e5" : "#1f2937"}
        />
      </TouchableOpacity>

      {/* Modal del menú */}
      <Modal
        transparent
        animationType="fade"
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setMenuVisible(false)}
        >
          <View
            className={`absolute top-12 right-4 rounded-xl shadow-lg border ${
              isDark
                ? "bg-neutral-900 border-neutral-700"
                : "bg-white border-gray-300"
            }`}
          >
            {/* Cambiar tema */}
            <TouchableOpacity
              onPress={() => {
                toggleTheme();
                setMenuVisible(false);
              }}
              className="px-5 py-3 flex-row items-center gap-3"
            >
              <Ionicons
                name={isDark ? "sunny" : "moon"}
                size={20}
                className={isDark ? "!text-amber-400" : "!text-cyan-800"}
              />
              <Text
                className={`text-xl ${
                  isDark ? "text-neutral-100" : "text-gray-800"
                }`}
              >
                Cambiar tema
              </Text>
            </TouchableOpacity>
            {/* Ver estadisticas */}
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                setStatsVisible(true);
              }}
              className="px-5 py-3 flex-row items-center gap-3"
            >
              <Ionicons
                name="stats-chart"
                size={20}
                color={isDark ? "#fff" : "000"}
              />
              <Text
                className={`text-xl ${
                  isDark ? "text-neutral-100" : "text-gray-800"
                }`}
              >
                Ver stats
              </Text>
            </TouchableOpacity>
            {/* Volver al inicio */}
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                setStatsVisible(false);
                router.replace("/");
              }}
              className="px-5 py-3 flex-row items-center gap-3"
            >
              <Ionicons name="home" size={20} color={isDark ? "#fff" : "000"} />
              <Text
                className={`text-xl ${
                  isDark ? "text-neutral-100" : "text-gray-800"
                }`}
              >
                Volver al inicio
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      <Modal
        transparent
        animationType="slide"
        visible={statsVisible}
        onRequestClose={() => setStatsVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 items-center justify-center"
          onPress={() => setStatsVisible(false)}
        >
          <View className="w-[85%]">
            <StatsPanel winner={winner} isDraw={isDraw} />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
