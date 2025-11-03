import { GameResult } from "./gameStorage";

export function calculateStats(games: GameResult[]) {
  const total = games.length;
  const winsX = games.filter(g => g.winner === "X").length;
  const winsO = games.filter(g => g.winner === "O").length;
  const draws = games.filter(g => g.winner === null).length;

  return {
    total,
    winsX,
    winsO,
    draws,
    winRateX: total ? (winsX / (winsX + winsO)) * 100 : 0,
    winRateO: total ? (winsO / (winsX + winsO)) * 100 : 0,
  };
}
