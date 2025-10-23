import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

type Props = {
  value?: string;
  onPress: () => void;
  disabled?: boolean;
  isWinner?: boolean;
};

export const BoardBtn: React.FC<Props> = ({
  value,
  onPress,
  disabled,
  isWinner,
}) => {
  const { themeType } = useTheme();
  const isDark = themeType === "dark";

  const iconName =
    value === "X"
      ? "close-outline"
      : value === "O"
      ? "ellipse-outline"
      : undefined;

  const iconColor =
    iconName === "close-outline"
      ? isDark
        ? "!text-indigo-400" // Indigo 400
        : "!text-blue-600" // Blue 600
      : isDark
      ? "!text-amber-500" // Amber 500
      : "!text-red-600"; // Red 600
  
  const ringBgColor = isDark ? "!border-cyan-400 !bg-cyan-400/20" : "!border-green-600 !bg-green-600/10";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      className={`flex-1 items-center justify-center rounded-xl border-2
        ${isDark ? "bg-neutral-800 border-neutral-700" : "bg-white border-gray-200"}
        ${isWinner ? ringBgColor : ""}
      `}
    >
      {iconName && <Ionicons name={iconName} size={44} className={iconColor} />}
    </TouchableOpacity>
  );
};
