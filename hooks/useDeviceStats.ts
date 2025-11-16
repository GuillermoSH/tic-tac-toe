import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export type StatsData = {
    wins: number;
    losses: number;
    ratio: number; // 0-1
};

export function useDeviceStats(deviceId: string | null, enabled = true) {
    const [stats, setStats] = useState<StatsData>({ wins: 0, losses: 0, ratio: 0 });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        if (!deviceId || !enabled) return;

        let stopped = false;

        const fetchStats = async () => {
            try {
                const data = await api.getDeviceInfo(deviceId);
                if (!stopped) {
                    setStats({ wins: data.wins, losses: data.losses, ratio: data.ratio });
                    setLoadingStats(false);
                }
            } catch (err) {
                console.log("[ERROR] Error fetching device stats:" + err);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 5000);

        return () => {
            stopped = true;
            clearInterval(interval);
        };
    }, [deviceId, enabled]);

    return { stats, loadingStats };
}
