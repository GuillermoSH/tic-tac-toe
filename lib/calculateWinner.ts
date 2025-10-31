export default function calculateWinner(
  squares: (string | null)[],
  size: number
): {
  winner: "X" | "O" | null;
  winningLine: number[] | null;
  isDraw: boolean;
} {
  // 🔹 Comprobar filas
  for (let row = 0; row < size; row++) {
    const start = row * size;
    const line = squares.slice(start, start + size);
    if (line[0] && line.every((v) => v === line[0])) {
      return {
        winner: line[0] as "X" | "O",
        winningLine: Array.from({ length: size }, (_, i) => start + i),
        isDraw: false,
      };
    }
  }

  // 🔹 Comprobar columnas
  for (let col = 0; col < size; col++) {
    const colValues = Array.from(
      { length: size },
      (_, i) => squares[i * size + col]
    );
    if (colValues[0] && colValues.every((v) => v === colValues[0])) {
      return {
        winner: colValues[0] as "X" | "O",
        winningLine: Array.from({ length: size }, (_, i) => i * size + col),
        isDraw: false,
      };
    }
  }

  // 🔹 Diagonal principal
  const mainDiag = Array.from({ length: size }, (_, i) => squares[i * size + i]);
  if (mainDiag[0] && mainDiag.every((v) => v === mainDiag[0])) {
    return {
      winner: mainDiag[0] as "X" | "O",
      winningLine: Array.from({ length: size }, (_, i) => i * size + i),
      isDraw: false,
    };
  }

  // 🔹 Diagonal secundaria
  const antiDiag = Array.from(
    { length: size },
    (_, i) => squares[i * size + (size - 1 - i)]
  );
  if (antiDiag[0] && antiDiag.every((v) => v === antiDiag[0])) {
    return {
      winner: antiDiag[0] as "X" | "O",
      winningLine: Array.from(
        { length: size },
        (_, i) => i * size + (size - 1 - i)
      ),
      isDraw: false,
    };
  }

  // 🔹 Si no hay ganador y no quedan celdas vacías → empate
  const isDraw = squares.every((sq) => sq !== null);
  return { winner: null, winningLine: null, isDraw };
}
