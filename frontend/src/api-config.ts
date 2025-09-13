import axios from "axios";

let url;

if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  url = "http://localhost:5000";
} else {
  url = "https://server.ditioscore.com";
}

export const apiClient = axios.create({
  baseURL: url,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export const authApiClient = axios.create({
  baseURL: url,
  timeout: 60000,
  withCredentials: true,
});
