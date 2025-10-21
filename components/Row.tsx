import { View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export const Row: React.FC<Props> = ({ children }) => {
  return <View className="flex flex-row">{children}</View>;
};