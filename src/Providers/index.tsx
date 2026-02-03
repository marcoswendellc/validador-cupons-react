import { UserProvider } from "./User";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <UserProvider>{children}</UserProvider>;
};
