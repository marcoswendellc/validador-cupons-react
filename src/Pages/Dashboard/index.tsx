import { useNavigate } from "react-router-dom";
import { useUser } from "../../Providers/User";
import { Background } from "./style";
import { useEffect, useState } from "react";
import { usePrivateGoogleSheets } from "../../hooks/useSimpleGoogleSheets";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export const Dashboard = () => {
  const { user, setUser } = useUser();
  const [cupom, setCupom] = useState<string>("");
  const [loadingCupons, setLoadingCupons] = useState<boolean>(false);
  const navigate = useNavigate();
  const { getCupons, cupons, validarCupom } = usePrivateGoogleSheets();

  useEffect(() => {
    getCupons();
  }, [loadingCupons]);

  const handleLogout = () => {
    setUser({});
    navigate("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await validarCupom(cupom);
    setLoadingCupons(!loadingCupons);
  };

  return (
    <Background>
      <div className="dashboard">
        {/* <aside className="dashboard__aside">
          <p className="dashboard__user">Bem-vindo, {user?.nome}!</p>
          <button className="dashboard__logout" onClick={handleLogout}>
            Sair
          </button>
        </aside> */}
        <div className="dashboard__content">
          <div className="dashboard__content-header">
            <div>
              <p className="dashboard__user">BEM-VINDO, {user?.nome?.toUpperCase()}!</p>
            </div>
            {/* <form className="dashboard__form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Código do cupom"
                className="dashboard__input"
                onChange={(ele) => setCupom(ele.target.value)}
                required
              />
              <button type="submit" className="dashboard__button">
                Validar
              </button>
            </form> */}

            <button className="dashboard__logout" onClick={handleLogout}>
              Sair
            </button>
          </div>
          <div className="dashboard__content-body">
            <form className="dashboard__form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Código do cupom"
                className="dashboard__input"
                onChange={(ele) => setCupom(ele.target.value)}
                required
              />
              <button type="submit" className="dashboard__button">
                Validar
              </button>
            </form>
            <h2 className="dashboard__title">CUPONS RESGATADOS</h2>
            {cupons.length === 0 ? <p className="dashboard__no-coupons">Nenhum cupom resgatado até o momento.</p>:   
            <TableContainer component={Paper}>
              <Table stickyHeader aria-label="customized table">
                <TableHead className="dashboard__table-head">
                  <TableRow>
                    <TableCell align="center">Código</TableCell>
                    <TableCell align="center">Lojista</TableCell>
                    <TableCell align="center">Data Resgate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cupons.map((row) => (
                    <TableRow key={row.codigo} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell component="th" scope="row" align="center">
                        {row.codigo}
                      </TableCell>
                      <TableCell align="center">{row.lojista}</TableCell>
                      <TableCell align="center">{row.data_resgate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            }
          </div>
        </div>
      </div>
    </Background>
  );
};
