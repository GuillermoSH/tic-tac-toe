import AsyncStorage from "@react-native-async-storage/async-storage";

export type GameResult = {
  id: string;
  date: string;
  boardSize: number;
  winner: "X" | "O" | null;
  isDraw: boolean;
  moves: number;
  surrendered?: boolean;
};

const STORAGE_KEY = "tic-tac-toe:games";

export async function saveGame(result: GameResult) {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const games: GameResult[] = stored ? JSON.parse(stored) : [];
    games.push(result);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch (e) {
    console.error("Error saving game:", e);
  }
}

export async function getAllGames(): Promise<GameResult[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error loading games:", e);
    return [];
  }
}

export async function clearGames() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
