import { api } from "@/lib/api";
import calculateWinner from "@/lib/calculateWinner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";

/**
 * useTicTacToeOnline – versión corregida
 * Arregla StartModal: se muestra 1 vez solamente cuando debe.
 */

export function useTicTacToeOnline() {
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [matchId, setMatchId] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [waitingForOpponent, setWaitingForOpponent] = useState(false);

    const [startingPlayer, setStartingPlayer] = useState<"X" | "O">("X");
    const [showStartModal, setShowStartModal] = useState(false);
    const startModalTimeoutRef = useRef<NodeJS.Timeout | number | null>(null);
    const startModalTriggered = useRef(false);

    const [boardSize, setBoardSize] = useState(3);
    const [currentSquares, setCurrentSquares] = useState<(string | null)[]>(Array(9).fill(null));
    const [currentMove, setCurrentMove] = useState(0);
    const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");

    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const [winner, setWinner] = useState<"X" | "O" | null>(null);
    const [isDraw, setIsDraw] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const [history, setHistory] = useState<(string | null)[][]>([]);
    const [finalMove, setFinalMove] = useState<number>(0);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [players, setPlayers] = useState<Record<string, "X" | "O"> | null>(null);
    const [mySymbol, setMySymbol] = useState<"X" | "O" | null>(null);

    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const mountedRef = useRef(true);

    // ---------------- mount / unmount ----------------
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            if (pollingRef.current) clearInterval(pollingRef.current);
            if (startModalTimeoutRef.current) clearTimeout(startModalTimeoutRef.current);
        };
    }, []);

    // ---------------- registrar device ----------------
    useEffect(() => {
        (async () => {
            try {
                const saved = await AsyncStorage.getItem("device_id");
                if (saved) {
                    try {
                        // Verificar en el backend si existe
                        await api.getDeviceInfo(saved);
                        setDeviceId(saved);
                        setLoading(false);
                        return;
                    } catch (err: any) {
                        if (err.status === 404) {
                            console.log("Device guardado no existe en backend, se creará uno nuevo");
                        } else {
                            throw err;
                        }
                    }
                }

                // Registrar nuevo dispositivo
                const res = await api.registerDevice();
                await AsyncStorage.setItem("device_id", res.device_id);
                setDeviceId(res.device_id);
            } catch (err) {
                console.log("[ERROR] " + err);
                setErrorMessage("Error conectando al servidor");
            } finally {
                setLoading(false);
            }
        })();
    }, []);


    // ---------------- create or join match ----------------
    useEffect(() => {
        if (!deviceId) return;

        let cancelled = false;
        (async () => {
            try {
                const { status, data } = await api.createOrJoinMatch(deviceId, boardSize);

                if (status === 201) {
                    if (cancelled) return;
                    setMatchId(data.match_id);
                    setBoardSize(data.board_size);
                    setPlayers(data.players);
                    setMySymbol(data.players[deviceId]);
                    setWaitingForOpponent(false);

                    if (!startModalTriggered.current && data.turn && data.players) {
                        startModalTriggered.current = true;
                        setStartingPlayer(data.turn);
                        setShowStartModal(true);

                        startModalTimeoutRef.current = setTimeout(() => {
                            setShowStartModal(false);
                        }, 1500);
                    }
                }

                if (status === 202) {
                    setWaitingForOpponent(true);
                    setMatchId(null);
                }
            } catch {
                setErrorMessage("Error creando partida");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [deviceId]);

    // ---------------- waiting-status polling ----------------
    useEffect(() => {
        if (!deviceId || waitingForOpponent === false) return;

        let stopped = false;

        const poll = async () => {
            try {
                const res = await api.getWaitingStatus(deviceId);
                if (!res || stopped) return;

                if (res.status === "matched") {
                    setMatchId(res.match_id);
                    setPlayers(res.players);
                    setBoardSize(res.board_size);
                    setMySymbol(res.players[deviceId]);
                    setWaitingForOpponent(false);

                    if (!startModalTriggered.current && res.turn && res.players) {
                        startModalTriggered.current = true;
                        setStartingPlayer(res.turn);
                        setShowStartModal(true);

                        startModalTimeoutRef.current = setTimeout(() => {
                            setShowStartModal(false);
                        }, 1500);
                    }
                }
            } catch { }
        };

        poll();
        const id = setInterval(poll, 1500);
        pollingRef.current = id;

        return () => {
            stopped = true;
            clearInterval(id);
        };
    }, [waitingForOpponent, deviceId]);

    // ---------------- match polling ----------------
    useEffect(() => {
        if (!matchId || !deviceId) return;

        let lastBoard: (string | null)[] | null = null;
        let stopped = false;

        const poll = async () => {
            try {
                const match = await api.getMatchState(matchId);
                if (!match || stopped) return;

                const boardFlat = match.board.flat().map((c: string) => (c === "" ? null : c));
                setCurrentSquares(boardFlat);
                setPlayers(match.players);
                setMySymbol(match.players[deviceId]);

                if (match.turn && match.players) setCurrentPlayer(match.players[match.turn]);

                setHistory(prev => {
                    if (prev.length === 0) {
                        lastBoard = boardFlat;
                        setCurrentMove(0);
                        setFinalMove(0);
                        return [boardFlat];
                    }

                    const prevBoard = prev[prev.length - 1];
                    const changed = boardFlat.some((c: string | null, i: number) => c !== prevBoard[i]);

                    if (!changed) {
                        return prev;
                    }

                    const newHistory = [...prev, boardFlat];
                    setCurrentMove(newHistory.length - 1);
                    setFinalMove(newHistory.length - 1);
                    return newHistory;
                });

                const result = calculateWinner(boardFlat, match.size);
                setWinner(result.winner);
                setWinningLine(result.winningLine);
                setIsDraw(result.isDraw);
                if (result.winner || result.isDraw) setGameOver(true);

            } catch (err) {
                console.log("poll error", err);
            }
        };

        poll();
        const id = setInterval(poll, 1200);
        pollingRef.current = id;

        return () => {
            stopped = true;
            clearInterval(id);
        };
    }, [matchId, deviceId]);


    // ---------------- actions ----------------
    const handleClick = async (index: number) => {
        if (!matchId || !deviceId || gameOver) return;

        if (mySymbol !== currentPlayer) {
            setErrorMessage("Turno del rival");
            setTimeout(() => setErrorMessage(null), 1000);
            return;
        }

        const x = Math.floor(index / boardSize);
        const y = index % boardSize;

        try {
            const res = await api.makeMove(matchId, deviceId, x, y);
            if (res?.board)
                setCurrentSquares(res.board.flat().map((c: string) => (c === "" ? null : c)));
        } catch {
            setErrorMessage("Movimiento no válido");
            setTimeout(() => setErrorMessage(null), 1000);
        }
    };

    const surrender = async () => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }

        const winnerSymbol = mySymbol === "X" ? "O" : "X";
        setWinner(winnerSymbol);
        setGameOver(true);
        setIsDraw(false);

        setErrorMessage("Te has rendido");
        setTimeout(() => setErrorMessage(null), 1500);
    };

    const terminateGame = () => {
        setGameOver(false);
        setWinner(null);
        setIsDraw(false);
        setWinningLine(null);
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
        router.push("/");
    };

    return {
        loading,
        waitingForOpponent,
        showStartModal,
        startingPlayer,

        boardSize,
        currentSquares,
        currentMove,
        currentPlayer,

        winningLine,
        winner,
        isDraw,
        gameOver,

        history,
        finalMove,

        errorMessage,

        handleClick,
        surrender,
        terminateGame,

        deviceId,
        matchId,
        players,
        mySymbol,
    };
}
