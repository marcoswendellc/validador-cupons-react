import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleSheetsProvider } from "./contexts/GoogleSheetsContext.tsx";
import { Providers } from "./Providers/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleSheetsProvider>
        <Providers>
          <App />
        </Providers>
      </GoogleSheetsProvider>
    </BrowserRouter>
  </StrictMode>
);
