import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./features/components/themeprovider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LeagueProvider } from "./features/hooks/use-leagues.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LeagueProvider>
        <ThemeProvider defaultTheme="dark" storageKey="rapid-ui-theme">
          <Toaster />
          <App />
        </ThemeProvider>
      </LeagueProvider>
    </QueryClientProvider>
  </StrictMode>
);
