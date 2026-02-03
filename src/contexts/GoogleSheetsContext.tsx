import { createContext, useContext, useState, ReactNode } from "react";

interface IUser {
  username: string;
}

interface IGoogleSheetsContext {
  isLoading: boolean;
  validateUser: (usuario: string, senha: string) => Promise<{ success: boolean; user?: IUser }>;
}

const GoogleSheetsContext = createContext<IGoogleSheetsContext | undefined>(undefined);

export const GoogleSheetsProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const validateUser = async (usuario: string, senha: string) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/google-auth");
      const data = await res.json();

      if (!data.values) {
        return { success: false };
      }

      // Ajuste aqui os índices conforme sua planilha
      const userRow = data.values.find((row: string[]) => row[0] === usuario && row[1] === senha);

      if (userRow) {
        return { success: true, user: { username: userRow[0] } };
      }

      return { success: false };
    } catch (error) {
      console.error("Erro ao validar usuário:", error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleSheetsContext.Provider value={{ isLoading, validateUser }}>
      {children}
    </GoogleSheetsContext.Provider>
  );
};

export const useGoogleSheetsContext = () => {
  const context = useContext(GoogleSheetsContext);
  if (!context) {
    throw new Error("useGoogleSheetsContext deve ser usado dentro de GoogleSheetsProvider");
  }
  return context;
};