import axios from "axios";

const TOKEN_KEY = "token";
const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
const baseURL = rawBaseUrl.replace(/\/+$/, "");

export const api = axios.create({
  baseURL,
});

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  if (!token) {
    clearAuthToken();
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
  delete api.defaults.headers.common.Authorization;
}

export async function logout() {
  const token = getStoredToken();

  if (token) {
    try {
      await api.post("/user/logout");
    } catch (error) {
      console.error("Logout request failed", error);
    }
  }

  clearAuthToken();
}

const existingToken = getStoredToken();
if (existingToken) {
  setAuthToken(existingToken);
}
