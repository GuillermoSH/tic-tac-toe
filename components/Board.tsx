import { Row } from "@/components/Row";
import { View } from "react-native";
import { BoardBtn } from "./BoardBtn";

type Props = {
    squares: Array<string>;
    onPress: (input: number) => void;
};

export const Board: React.FC<Props> = ({squares, onPress}) => {
    return (
        <View className="flex flex-col w-screen px-14">
            <Row>
                <BoardBtn value={squares[0]} onPress={() => onPress(0)}></BoardBtn>
                <BoardBtn value={squares[1]} onPress={() => onPress(1)}></BoardBtn>
                <BoardBtn value={squares[2]} onPress={() => onPress(2)}></BoardBtn>
            </Row>
            <Row>
                <BoardBtn value={squares[3]} onPress={() => onPress(3)}></BoardBtn>
                <BoardBtn value={squares[4]} onPress={() => onPress(4)}></BoardBtn>
                <BoardBtn value={squares[5]} onPress={() => onPress(5)}></BoardBtn>
            </Row>
            <Row>
                <BoardBtn value={squares[6]} onPress={() => onPress(6)}></BoardBtn>
                <BoardBtn value={squares[7]} onPress={() => onPress(7)}></BoardBtn>
                <BoardBtn value={squares[8]} onPress={() => onPress(8)}></BoardBtn>
            </Row>
        </View>
    );
}