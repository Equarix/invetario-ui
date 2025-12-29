import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthProvider from "./context/AuthContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Providers from "./context/Providers.tsx";

const query = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <QueryClientProvider client={query}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </Providers>
  </StrictMode>
);
