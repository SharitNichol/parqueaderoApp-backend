/**
 * Servicio de API — usa fetch nativo (axios no está instalado en el frontend).
 * Para nuevas funcionalidades, preferir usar directamente @/api/client.ts
 */

const apiHost = import.meta.env.VITE_API_URL || "http://localhost";
const apiPort = import.meta.env.VITE_API_PORT ? `:${import.meta.env.VITE_API_PORT}` : ":3000";

const baseURL = `${apiHost}${apiPort}`;

const api = {
  baseURL,
  async get(endpoint ) {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${baseURL}${endpoint}`, { method: "GET", headers });
    return res.json();
  },
  async post(endpoint, data) {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${baseURL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

export default api;
