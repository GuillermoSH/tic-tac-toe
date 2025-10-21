import { Text, TouchableOpacity } from "react-native";

type Props = {
    value?: string;
    onPress: () => void;
};

export const BoardBtn: React.FC<Props> = ({value, onPress}) => {
    return (
        <TouchableOpacity className="flex-1 flex justify-center items-center aspect-square border border-black" onPress={onPress} activeOpacity={0.8}>
            <Text className="text-7xl">{value}</Text>
        </TouchableOpacity>
    )
}