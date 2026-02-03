import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Login } from "../Pages/Login";
import { Dashboard } from "../Pages/Dashboard";
import { useUser } from "../Providers/User";

export const Navigation = () => {
  const PrivateRoutes = () => {
    const { user } = useUser();
    return user?.nome ? <Outlet /> : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};
