// Hook para acessar planilha PRIVADA real
import { useState, useCallback } from "react";
import privateGoogleSheetsService from "../services/privateGoogleSheetsService";
import type { Cupom, TestResult, User } from "../services/privateGoogleSheetsService";
import { useUser } from "../Providers/User";

export interface UsePrivateGoogleSheets {
  // Estados
  isLoading: boolean;
  error: string | null;
  users: User[];
  cupons: Cupom[];

  // Funções
  testConnection: () => Promise<TestResult>;
  getUsers: () => Promise<void>;
  getCupons: () => Promise<void>;
  validateUser: (username: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  validarCupom: (codigo: string) => Promise<void>;
  clearError: () => void;
}

export const usePrivateGoogleSheets = (): UsePrivateGoogleSheets => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const { user } = useUser();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const testConnection = useCallback(async (): Promise<TestResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await privateGoogleSheetsService.testConnection();

      if (!result.success) {
        setError(result.message);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      setError(`Erro no teste: ${errorMessage}`);
      return {
        success: false,
        message: `❌ Erro no teste: ${errorMessage}`,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUsers = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const usersData = await privateGoogleSheetsService.getUsers();
      setUsers(usersData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      setError(`Erro ao carregar usuários: ${errorMessage}`);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCupons = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const cuponsData = await privateGoogleSheetsService.getCupons();
      setCupons(cuponsData.filter((cupom) => cupom.usuario === user?.nome).sort((a, b) => {
      const dateA = new Date(a.data_resgate).getTime();
      const dateB = new Date(b.data_resgate).getTime();
      return dateB - dateA; // ordem decrescente (mais recente primeiro)
    }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      setError(`Erro ao carregar cupons: ${errorMessage}`);
      setCupons([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validarCupom = useCallback(async (codigo: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await privateGoogleSheetsService.validarCupom(codigo, user!.nome!);
      if (!result.success) {
        setError(result.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      setError(`Erro ao validar cupom: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateUser = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await privateGoogleSheetsService.validateUser(username, password);
        if (!result.success) {
          setError(result.message);
        }

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        const failResult = {
          success: false,
          message: `❌ Erro na validação: ${errorMessage}`,
        };
        setError(failResult.message);
        return failResult;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    error,
    getUsers,
    getCupons,
    testConnection,
    users,
    cupons,
    validateUser,
    clearError,
    validarCupom,
  };
};

export default usePrivateGoogleSheets;
