import { GameResult, clearGames, getAllGames, saveGame } from "@/lib/gameStorage";
import { calculateStats } from "@/lib/statsUtils";
import { useEffect, useState } from "react";

export function useGameStats() {
  const [games, setGames] = useState<GameResult[]>([]);
  const [stats, setStats] = useState(() => calculateStats([]));

  useEffect(() => {
    loadGames();
  }, []);

  async function loadGames() {
    const stored = await getAllGames();
    setGames(stored);
    setStats(calculateStats(stored));
  }

  async function addGame(result: GameResult) {
    await saveGame(result);
    await loadGames();
  }

  async function resetStats() {
    await clearGames();
    await loadGames();
  }

  return { games, stats, addGame, resetStats };
}
