import axios from "axios";

const http = axios.create({ baseURL: "/api" });

let _apiKey = null;

export function setApiKeyHeader(key) {
  _apiKey = key;
}

function authHeaders() {
  return _apiKey ? { "X-Venue-Api-Key": _apiKey } : {};
}

export const validateKey = (apiKey) =>
  http.post("/auth/validate-key", { apiKey }).then(r => r.data);

export const notifyConnect = (key) =>
  http.post("/auth/connect", {}, { headers: { "X-Venue-Api-Key": key } }).then(r => r.data);

export const notifyDisconnect = () =>
  http.post("/auth/disconnect", {}).then(r => r.data);

export const getVenueState  = ()    => http.get("/venue/state").then(r => r.data);
export const triggerSurge   = ()    => http.post("/venue/surge", {}, { headers: authHeaders() }).then(r => r.data);
export const getChatHistory = (sid) => http.get(`/chat/history/${sid}`).then(r => r.data);
export const getOpsAlerts   = ()    => http.get("/ops/alerts").then(r => r.data);
export const resolveAlert   = (id)  => http.patch(`/ops/alerts/${id}/resolve`).then(r => r.data);

export function sendMessageStream(message, sessionId, apiKey) {
  return fetch("/api/chat/message", {
    method:  "POST",
    headers: {
      "Content-Type":    "application/json",
      "X-Venue-Api-Key": apiKey
    },
    body: JSON.stringify({ message, sessionId })
  });
}
