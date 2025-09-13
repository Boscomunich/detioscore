import { createAuthClient } from "better-auth/react";

let url;

if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  url = "http://localhost:5000";
} else {
  url = "https://server.ditioscore.com";
}

export const authClient = createAuthClient({
  baseURL: url,
});
