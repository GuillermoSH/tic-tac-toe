import { useTheme } from "@/contexts/ThemeContext";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function Index() {
  const { themeType } = useTheme();
  const isDark = themeType === "dark";
  const btnStyle = `w-full rounded-lg py-3 border-2 text-neutral-100`;
  const localBtnColor = isDark ? "border-cyan-400 bg-cyan-700" : "border-emerald-400 bg-emerald-700";
  const onlineBtnColor = "border-amber-400 bg-amber-700";

  return (
    <SafeAreaView className={isDark ? "bg-neutral-900" : "bg-neutral-100"}>
      <View className="relative h-full px-20 flex flex-col justify-center items-center gap-10">
        <View className="absolute top-4 w-full flex justify-center items-center">
          <Text className={`text-3xl ${isDark ? "text-neutral-100" : "text-neutral-800"}`}>
            Tic-Tac-Toe
          </Text>
        </View>
        <Link className={`${btnStyle} ${localBtnColor}`} href={"/game?gameType=local"} prefetch>
          <Text className="text-2xl text-center">Crear partida local</Text>
        </Link>
        <Link className={`${btnStyle} ${onlineBtnColor}`} href={"/game?gameType=online"} prefetch>
          <Text className="text-2xl text-center">Buscar partida online</Text>
        </Link>
        <View className="absolute bottom-4 w-full flex justify-center items-center">
          <Text className={`text-xl ${isDark ? "text-neutral-100" : "text-neutral-800"}`}>
            With <FontAwesome name="heart" color="red" size={16}/> by <Text className="text-amber-400">GuillermoSH</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
