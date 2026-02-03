// Context/Provider para gerenciar acesso à planilha Google Sheets privada
import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { usePrivateGoogleSheets, type UsePrivateGoogleSheets } from "../hooks/useSimpleGoogleSheets";

// Definir o tipo do Context
interface GoogleSheetsContextType extends UsePrivateGoogleSheets {}

// Criar o Context
const GoogleSheetsContext = createContext<GoogleSheetsContextType | undefined>(undefined);

// Props do Provider
interface GoogleSheetsProviderProps {
  children: ReactNode;
}

// Provider Component
export const GoogleSheetsProvider: React.FC<GoogleSheetsProviderProps> = ({ children }) => {
  const googleSheetsData = usePrivateGoogleSheets();

  return <GoogleSheetsContext.Provider value={googleSheetsData}>{children}</GoogleSheetsContext.Provider>;
};

// Hook customizado para usar o Context
export const useGoogleSheetsContext = (): GoogleSheetsContextType => {
  const context = useContext(GoogleSheetsContext);

  if (context === undefined) {
    throw new Error(
      "useGoogleSheetsContext deve ser usado dentro de um GoogleSheetsProvider. " +
        "Certifique-se de que o componente está envolvido com <GoogleSheetsProvider>."
    );
  }

  return context;
};

export default GoogleSheetsContext;
