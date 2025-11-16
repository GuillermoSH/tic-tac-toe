import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BoardSizeSelector } from "./BoardSizeSelector";

export default function EndGamePannel({ boardSize, resetGame }: { boardSize: number; resetGame: (size?: number) => void }) {
  const { themeType, toggleTheme } = useTheme();
  const isDark = themeType === "dark";
  const [showSizeSelector, setShowSizeSelector] = useState(false);

  return (
    <View className="mt-6 items-center mb-4">
      {showSizeSelector ? (
        <>
          <BoardSizeSelector
            currentSize={boardSize}
            onSelect={(size) => {
              resetGame(size);
              setShowSizeSelector(false);
            }}
          />

          <TouchableOpacity
            className={`mt-4 py-2 px-6 rounded-xl border-2 active:scale-95 active:opacity-90 ${
              isDark
                ? "border-neutral-700 bg-neutral-800"
                : "border-gray-300 bg-white"
            }`}
            onPress={() => setShowSizeSelector(false)}
          >
            <Text
              className={`text-base font-medium ${
                isDark ? "text-neutral-100" : "text-gray-800"
              }`}
            >
              Cancelar
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <View className="flex-row flex-wrap gap-3">
          {/* Botón Cambiar tamaño */}
          <TouchableOpacity
            className={`py-3 px-6 flex-1 justify-center rounded-xl shadow-md flex-row items-center gap-2 border-2 active:scale-95 active:opacity-90 transition ${
              isDark
                ? "bg-cyan-700 border-cyan-400"
                : "bg-emerald-500 border-emerald-400"
            }`}
            onPress={() => setShowSizeSelector(true)}
          >
            <Ionicons name="grid-outline" size={20} color="#fff" />
            <Text className="text-white text-lg font-bold">Tamaño</Text>
          </TouchableOpacity>

          {/* Botón Reiniciar */}
          <TouchableOpacity
            className={`py-3 px-6 flex-1 justify-center rounded-xl shadow-md flex-row items-center gap-2 border-2 active:scale-95 active:opacity-90 transition ${
              isDark
                ? "bg-indigo-500 border-indigo-400"
                : "bg-blue-500 border-blue-400"
            }`}
            onPress={() => resetGame()}
          >
            <Ionicons name="refresh-outline" size={20} color="#fff" />
            <Text className="text-white text-lg font-bold">Reiniciar</Text>
          </TouchableOpacity>
          <TouchableOpacity
              className={`w-full py-3 px-6 justify-center rounded-xl shadow-md flex-row items-center gap-2 border-2 active:scale-95 active:opacity-90 transition ${
                isDark
                  ? "bg-indigo-500 border-indigo-400"
                  : "bg-blue-500 border-blue-400"
              }`}
              onPress={() => router.push("/")}
            >
              <Ionicons name="home" size={20} color="#fff" />
              <Text className="text-white text-lg font-bold">Volver</Text>
            </TouchableOpacity>
        </View>
        
      )}
    </View>
  );
}
