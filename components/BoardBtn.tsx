import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

type Props = {
  value?: string;
  onPress: () => void;
  disabled?: boolean;
};

export const BoardBtn: React.FC<Props> = ({ value, onPress, disabled }) => {
  const iconName =
    value === "X"
      ? "close-outline"
      : value === "O"
        ? "ellipse-outline"
        : undefined;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      className="flex-1 items-center justify-center rounded-xl border-2 border-gray-400 bg-white dark:bg-neutral-700 dark:border-neutral-500"
    >
      {iconName === "close-outline" ? (
          <Ionicons name={iconName} size={44} className="!text-blue-600 dark:!text-indigo-400" />
        ) : (
          <Ionicons name={iconName} size={44} className="!text-red-600 dark:!text-orange-500" />
      )}
    </TouchableOpacity>
  );
};
