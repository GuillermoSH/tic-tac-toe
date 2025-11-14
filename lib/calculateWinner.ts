export default function calculateWinner(
  squares: (string | null)[],
  size: number
): {
  winner: "X" | "O" | null;
  winningLine: number[] | null;
  isDraw: boolean;
} {
  // Normalizamos: "" -> null (el backend usa "" para casillas vacías)
  const s = squares.map((v) => (v === "" ? null : v));

  // Aseguramos longitud correcta (evita crash si algo viene raro)
  const total = size * size;
  const filled = Array.from({ length: total }, (_, i) => s[i] ?? null);

  // Helper para comprobar si todos los valores son iguales y no nulos
  const allSame = (arr: (string | null)[]) =>
    arr[0] != null && arr.every((v) => v === arr[0]);

  // Filas
  for (let r = 0; r < size; r++) {
    const start = r * size;
    const line = filled.slice(start, start + size);
    if (allSame(line)) {
      return {
        winner: line[0] as "X" | "O",
        winningLine: Array.from({ length: size }, (_, i) => start + i),
        isDraw: false,
      };
    }
  }

  // Columnas
  for (let c = 0; c < size; c++) {
    const col = Array.from({ length: size }, (_, i) => filled[i * size + c]);
    if (allSame(col)) {
      return {
        winner: col[0] as "X" | "O",
        winningLine: Array.from({ length: size }, (_, i) => i * size + c),
        isDraw: false,
      };
    }
  }

  // Diagonal principal
  const mainDiag = Array.from({ length: size }, (_, i) => filled[i * size + i]);
  if (allSame(mainDiag)) {
    return {
      winner: mainDiag[0] as "X" | "O",
      winningLine: Array.from({ length: size }, (_, i) => i * size + i),
      isDraw: false,
    };
  }

  // Diagonal secundaria
  const antiDiag = Array.from(
    { length: size },
    (_, i) => filled[i * size + (size - 1 - i)]
  );
  if (allSame(antiDiag)) {
    return {
      winner: antiDiag[0] as "X" | "O",
      winningLine: Array.from({ length: size }, (_, i) => i * size + (size - 1 - i)),
      isDraw: false,
    };
  }

  // Empate si no hay nulls
  const isDraw = filled.every((v) => v !== null);
  return { winner: null, winningLine: null, isDraw };
}
