import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
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

  // 🔹 Determinar icono y texto del estado
  let iconName: keyof typeof Ionicons.glyphMap = "person-circle-outline";
  let iconColor = currentPlayer === "X" ? isDark ? "#7c86ff" : "#155dfc" : isDark ? "#fd9a00" : "#fb2c36";
  let text = `Juega ${currentPlayer}`;
  let textColor = isDark ? "text-white" : "text-gray-800";

  if (winner) {
    iconName = "trophy-outline";
    iconColor = isDark ? "#22d3ee" : "#16a34a";
    text = `Ganador: ${winner}`;
    textColor = isDark ? "text-cyan-400" : "text-green-600";
  } else if (isDraw) {
    iconName = "extension-puzzle";
    iconColor = isDark ? "#fd9a00" : "#eab308";
    text = "Empate";
    textColor = isDark ? "text-amber-500" : "text-yellow-600";
  }

  return (
    <View className={`w-full border-b-2 ${isDark ? "border-neutral-700" : "border-neutral-200"} flex-row justify-between items-center px-4 py-3`}>
      {/* Izquierda vacía */}
      <View className="w-6" />

      {/* Centro — Estado del juego */}
      <View className="flex-row items-center gap-2">
        <Ionicons name={iconName} size={26} color={iconColor} />
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
                color={isDark ? "#fcd34d" : "#1f2937"}
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
            <TouchableOpacity onPress={() => {setMenuVisible(false)}} className="px-5 py-3 flex-row items-center gap-3">
              <Ionicons name="stats-chart" size={20} color={isDark ? "#fff" : "000"} />
              <Text
                className={`text-xl ${
                  isDark ? "text-neutral-100" : "text-gray-800"
                }`}
              >
                Ver stats
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
