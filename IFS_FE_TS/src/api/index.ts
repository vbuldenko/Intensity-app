import axios from "axios";

export function createClient() {
  return axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
