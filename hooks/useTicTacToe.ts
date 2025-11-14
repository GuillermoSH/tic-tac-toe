import { api } from "@/lib/api";
import calculateWinner from "@/lib/calculateWinner";
import type { GameResult } from "@/lib/gameStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import uuid from "react-native-uuid";

type UseTicTacToeOptions = {
  onGameEnd?: (result: GameResult) => void;
  selectedGameType?: string;
};

export function useTicTacToe(initialSize: number = 3, options?: UseTicTacToeOptions) {
  const [boardSize, setBoardSize] = useState(initialSize);
  const [gameType, setGameType] = useState(options?.selectedGameType || "local");
  const [history, setHistory] = useState([Array(initialSize * initialSize).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [finalMove, setFinalMove] = useState<number | null>(null);
  const [finalResult, setFinalResult] = useState<{ winner: "X" | "O" | null; isDraw: boolean } | null>(null);
  const [startingPlayer, setStartingPlayer] = useState<"X" | "O">("X");
  const [showStartModal, setShowStartModal] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // online state
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [turn, setTurn] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "waiting" | "playing">("idle");
  const [error, setError] = useState<string | null>(null);

  // 🆕 nuevos estados
  const [players, setPlayers] = useState<Record<string, "X" | "O"> | null>(null);
  const [mySymbol, setMySymbol] = useState<"X" | "O" | null>(null);
  const [turnSymbol, setTurnSymbol] = useState<"X" | "O" | null>(null);

  // guards & refs
  const creatingMatchRef = useRef(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  const currentSquares = history[currentMove];
  const currentPlayer: "X" | "O" = currentMove % 2 === 0 ? startingPlayer : startingPlayer === "X" ? "O" : "X";
  const canPlay = !gameOver && !showStartModal;
  const safeSquares = currentSquares ?? Array(boardSize * boardSize).fill(null);
  const { winner: localWinner, winningLine, isDraw } = calculateWinner(safeSquares, boardSize);

  // mount/unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // initialize: boardSize or selectedGameType changes -> start new game
  useEffect(() => {
    if (options?.selectedGameType) setGameType(options.selectedGameType);
    startNewGame(options?.selectedGameType ?? gameType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardSize]);

  // --- device registration effect (runs when entering online mode) ---
  useEffect(() => {
    if (gameType !== "online") return;

    let cancelled = false;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("device_id");
        if (stored) {
          if (!cancelled) setDeviceId(stored);
          return;
        }

        const res = await api.registerDevice();
        if (!res || !res.device_id) throw new Error("No device_id returned by server");
        await AsyncStorage.setItem("device_id", res.device_id);
        if (!cancelled) setDeviceId(res.device_id);
      } catch (err: any) {
        console.log("❌ Error registrando dispositivo:", err?.message ?? err);
        if (!cancelled) setError(String(err?.message ?? err));
      }
    })();

    return () => { cancelled = true; };
  }, [gameType]);

  // --- when we have a deviceId and we are online, create or join a match ---
  useEffect(() => {
    if (gameType !== "online" || !deviceId) return;

    if (creatingMatchRef.current) return;
    creatingMatchRef.current = true;

    (async () => {
      try {
        const { status: resStatus, data } = await api.createOrJoinMatch(deviceId, boardSize);

        if (resStatus === 201 || resStatus === 202) {
          if (!mountedRef.current) return;
          setMatchId(data.match_id);
          setPlayers(data.players ?? {});
          if (data.players && deviceId) setMySymbol(data.players[deviceId] ?? null);
          if (data.turn && data.players) setTurnSymbol(data.players[data.turn] ?? null);
          if (resStatus === 201) setStatus("playing");
          else setStatus("waiting");
        } else {
          setError(`createOrJoinMatch returned status ${resStatus}`);
        }
      } catch (err: any) {
        console.log("❌ Error creando/uniendo partida:", err?.message ?? err);
        setError(String(err?.message ?? err));
        if (String(err?.message ?? "").includes("device_id inválido")) {
          try {
            console.log("Re-registrando device...");
            const newDev = await api.registerDevice();
            await AsyncStorage.setItem("device_id", newDev.device_id);
            setDeviceId(newDev.device_id);
          } catch (reErr: any) {
            console.log("❌ Re-register failed:", reErr);
          }
        }
      } finally {
        creatingMatchRef.current = false;
      }
    })();
  }, [deviceId, gameType, boardSize]);

  // --- polling (waiting status OR match state) ---
  useEffect(() => {
    if (gameType !== "online") return;

    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    const poll = async () => {
      if (!mountedRef.current) return;

      try {
        if (status === "waiting" && deviceId) {
          const s = await api.getWaitingStatus(deviceId);
          if (!s) return;
          if (s.status === "matched") {
            setMatchId(s.match_id);
            setStatus("playing");
          }
        } else if (status === "playing" && matchId) {
          const match = await api.getMatchState(matchId);
          if (!match) return;
          if (!mountedRef.current) return;
          const boardFlat = Array.isArray(match.board)
            ? match.board.flat().map((c: any) => (c === "" ? null : c))
            : [];
          setHistory([boardFlat]);
          setPlayers(match.players ?? {});
          if (deviceId && match.players) setMySymbol(match.players[deviceId] ?? null);
          if (match.turn && match.players) setTurnSymbol(match.players[match.turn] ?? null);
          setTurn(match.turn ?? null);
          setWinner(match.winner ?? null);
          if (match.winner) setGameOver(true);
        }
      } catch (err: any) {
        console.log("⚠️ Polling error:", err?.message ?? err);
        setError(String(err?.message ?? err));
      }
    };

    (async () => await poll())();
    pollingRef.current = setInterval(poll, 1500);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = null;
    };
  }, [status, matchId, deviceId, gameType]);

  // --- handle clicks (local and online) ---
  async function handleClick(index: number) {
    if (!canPlay) return;
    if (currentSquares[index]) return;

    if (gameType === "local") {
      const nextSquares = currentSquares.slice();
      nextSquares[index] = currentPlayer;
      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
      const result = calculateWinner(nextSquares, boardSize);
      if (result.winner || result.isDraw) {
        setGameOver(true);
        setFinalMove(nextHistory.length - 1);
        setFinalResult({ winner: result.winner, isDraw: result.isDraw });
        registerResult(result.winner, result.isDraw);
      }
      return;
    }

    if (gameType === "online") {
      if (!matchId || !deviceId) {
        setError("No hay partida o deviceId aún");
        return;
      }

      try {
        const x = Math.floor(index / boardSize);
        const y = index % boardSize;
        const res = await api.makeMove(matchId, deviceId, x, y);
        const boardFlat = Array.isArray(res.board)
          ? res.board.flat().map((c: any) => (c === "" ? null : c))
          : [];
        setHistory([boardFlat]);
        setTurn(res.next_turn ?? null);
        if (players && res.next_turn) setTurnSymbol(players[res.next_turn] ?? null);
        setWinner(res.winner ?? null);
        if (res.winner) setGameOver(true);
      } catch (err: any) {
        console.log("❌ makeMove error:", err?.message ?? err);
        let raw =
          err?.body?.error ||
          err?.body?.message ||
          err?.message ||
          "Error desconocido";
        raw = raw.replace(/^HTTP\s\d+\s[\w\s-]+-\s*/i, "");
        try {
          const maybeObj = JSON.parse(raw);
          if (typeof maybeObj === "object" && maybeObj.error) raw = maybeObj.error;
        } catch { }
        let friendlyMsg = raw;
        if (raw.toLowerCase().includes("turno")) friendlyMsg = "⏳ No es tu turno todavía";
        else if (raw.toLowerCase().includes("inválido")) friendlyMsg = "⚠️ Movimiento inválido";
        else if (raw.toLowerCase().includes("partida")) friendlyMsg = "⚠️ No hay una partida activa";
        else if (raw.toLowerCase().includes("device")) friendlyMsg = "⚠️ Error con el dispositivo, intenta reiniciar";
        if (friendlyMsg.includes("⚠️") || friendlyMsg.includes("⏳") || friendlyMsg.toLowerCase().includes("turno")) {
          setErrorMessage(friendlyMsg);
          setShowErrorModal(true);
          setTimeout(() => setShowErrorModal(false), 1500);
        } else {
          setError(friendlyMsg);
        }
      }
    }
  }

  function registerResult(winner: "X" | "O" | null, isDraw: boolean, surrendered?: boolean) {
    const result: GameResult = {
      id: uuid.v4() as string,
      date: new Date().toISOString(),
      boardSize,
      winner,
      isDraw,
      moves: currentMove,
      surrendered,
    };
    options?.onGameEnd?.(result);
  }

  function surrender() {
    if (gameOver) return;
    const opponent = currentPlayer === "X" ? "O" : "X";
    setGameOver(true);
    setFinalResult({ winner: opponent, isDraw: false });
    registerResult(opponent, false, true);
    if (gameType === "online" && matchId && deviceId) {
      router.replace("/");
    }
  }

  function jumpTo(move: number) {
    setCurrentMove(move);
  }

  function resetGame(newSize?: number) {
    const size = newSize || boardSize;
    setBoardSize(size);
    setHistory([Array(size * size).fill(null)]);
    setCurrentMove(0);
    setGameOver(false);
    setFinalMove(null);
    setFinalResult(null);
    startNewGame(gameType);
  }

  function startNewGame(gt: string) {
    const random = Math.random() < 0.5 ? "X" : "O";
    setStartingPlayer(random);
    setShowStartModal(true);
    const timer = setTimeout(() => {
      if (mountedRef.current) setShowStartModal(false);
    }, 1500);
    if (gt !== "local") {
      setMatchId(null);
      setStatus("idle");
      setWinner(null);
    }
    return () => clearTimeout(timer);
  }

  return {
    boardSize,
    winner: finalResult ? finalResult.winner : (localWinner || winner),
    winningLine,
    history,
    isDraw: finalResult ? finalResult.isDraw : isDraw,
    currentSquares: safeSquares,
    currentMove,
    currentPlayer,
    startingPlayer,
    showStartModal,
    gameOver,
    finalMove,
    gameType,
    setGameType,
    handleClick,
    jumpTo,
    resetGame,
    surrender,
    // debug / online
    deviceId,
    matchId,
    turn,
    status,
    error,
    showErrorModal,
    errorMessage,

    // 🆕 añadidos (sin romper compatibilidad)
    players,
    mySymbol,
    turnSymbol,
  };
}
