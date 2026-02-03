import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import type { ILogin } from "../../interfaces/login";
import { Background, BackgroundImage } from "./style";
import { useGoogleSheetsContext } from "../../contexts/GoogleSheetsContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Providers/User";

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();

  const { isLoading, validateUser } = useGoogleSheetsContext();
  const { setUser } = useUser();

  const submit: SubmitHandler<ILogin> = async (data) => {
    try {
      setIsAuthenticating(true);

      // Validar usuário e senha na planilha
      const result = await validateUser(data.Usuario, data.Senha);

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.user?.username));
        setUser({ nome: result.user!.username });
        navigate("/dashboard");
        // toast.success(`Bem-vindo, ${data.Usuario}!`);
        // Aqui você pode redirecionar para a página principal
      }

      if (!result.success) {
        // Tratar erro de credenciais inválidas
        toast.error("Credenciais inválidas");
      }
    } catch (error) {
      toast.error("Algo deu errado");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Funções de debug (remover em produção)
  // const handleTestConnection = async () => {
  //   setStatusMessage("🧪 Testando acesso à planilha...");
  //   const result = await testConnection();
  //   setStatusMessage(result.message);
  // };

  // const handleShowUsers = async () => {
  //   setStatusMessage("👥 Carregando usuários da planilha...");
  //   try {
  //     await getUsers();
  //     setStatusMessage(`✅ ${users.length} usuários encontrados na planilha`);
  //     console.log("👥 Usuários encontrados:", users);
  //   } catch (error) {
  //     setStatusMessage("❌ Erro ao carregar usuários");
  //   }
  // };

  // if (isLoading) {
  //   return (
  //     <Background>
  //       <div style={{ color: "white", textAlign: "center" }}>
  //         <p>🔄 Conectando na planilha...</p>
  //       </div>
  //     </Background>
  //   );
  // }

  return (
    <>
      <Background>
        <form onSubmit={handleSubmit(submit)}>
          <div className="title">
            <p>Login</p>
          </div>

          <div className="inputs">
            <input
              type="text"
              className={errors.Usuario ? "input-error" : ""}
              placeholder="Usuário"
              {...register("Usuario", { required: "Usuário é obrigatório" })}
              disabled={isAuthenticating}
            />
            <input
              type="password"
              className={errors.Senha ? "input-error" : ""}
              placeholder="Senha"
              {...register("Senha", { required: "Senha é obrigatória" })}
              disabled={isAuthenticating}
            />
          </div>

          <button
            type="submit"
            disabled={isAuthenticating || isLoading}
            style={{
              opacity: isAuthenticating || isLoading ? 0.6 : 1,
              cursor: isAuthenticating || isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isAuthenticating ? "Validando..." : "Entrar"}
          </button>
        </form>
      </Background>
      <BackgroundImage />
    </>
  );
};
