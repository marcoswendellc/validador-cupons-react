import { createContext, useContext, useState } from "react";

interface IUserProvider {
  user: IUser | undefined;
  setUser: (data: IUser) => void;
}

interface IUser {
  nome?: string; // Pode ser string, null, ou não existir
}

const UserContext = createContext<IUserProvider>({} as IUserProvider);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
