// lib/api.ts
import { BASE_URL } from "@/constants/common";

async function fetchJSON(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const msg = `HTTP ${res.status} ${res.statusText} - ${typeof data === "string" ? data : JSON.stringify(data)}`;
    const e: any = new Error(msg);
    e.status = res.status;
    e.body = data;
    throw e;
  }
  return data;
}

export const api = {
  async registerDevice(alias?: string) {
    console.log("POST /devices payload:", JSON.stringify({ alias }));
    return await fetchJSON(`${BASE_URL}/devices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alias }),
    });
  },

  async createOrJoinMatch(device_id: string, size = 3) {
    console.log("POST /matches payload:", JSON.stringify({ device_id, size }));
    const res = await fetch(`${BASE_URL}/matches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device_id, size }),
    });
    const text = await res.text();
    let data: any = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) {
      const msg = `HTTP ${res.status} ${res.statusText} - ${typeof data === "string" ? data : JSON.stringify(data)}`;
      const e: any = new Error(msg);
      e.status = res.status;
      e.body = data;
      throw e;
    }
    return { status: res.status, data };
  },

  async getWaitingStatus(device_id: string) {
    return await fetchJSON(`${BASE_URL}/matches/waiting-status?device_id=${device_id}`);
  },

  async getMatchState(match_id: string) {
    return await fetchJSON(`${BASE_URL}/matches/${match_id}`);
  },

  async makeMove(match_id: string, device_id: string, x: number, y: number) {
    console.log("POST /matches/" + match_id + "/moves payload:", JSON.stringify({ device_id, x, y }));
    return await fetchJSON(`${BASE_URL}/matches/${match_id}/moves`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device_id, x, y }),
    });
  },

  async surrenderMatch(match_id: string, device_id: string) {
    return await fetchJSON(`${BASE_URL}/matches/${match_id}/surrender`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device_id }),
    });
  },

  async getDeviceInfo(device_id: string) {
    console.log(`GET /devices/${device_id}/info`);
    return await fetchJSON(`${BASE_URL}/devices/${device_id}/info`);
  },
};
