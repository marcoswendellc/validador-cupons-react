import { google } from "googleapis";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Função reutilizável para buscar dados da planilha
async function getSheetValues() {
  const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;

  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
    throw new Error("Variáveis de ambiente não configuradas");
  }

  const auth = new google.auth.JWT({
    email: GOOGLE_CLIENT_EMAIL,
    key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  await auth.authorize();

  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: GOOGLE_SHEET_ID,
    range: "A1:Z1000",
  });

  return response.data.values || [];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { usuario, senha } = req.query;

    if (!usuario || !senha) {
      return res.status(400).json({ error: "Informe ?usuario=USUARIO&senha=SENHA na URL" });
    }

    const values = await getSheetValues();

    // Ajuste trim para evitar espaços extras
    const userRow = values.find(
      (row: string[]) => row[0]?.trim() === String(usuario).trim() && row[1]?.trim() === String(senha).trim()
    );

    if (userRow) {
      return res.status(200).json({ success: true, user: { username: userRow[0] } });
    } else {
      return res.status(200).json({ success: false });
    }
  } catch (error: any) {
    console.error("❌ Test-login Error:", error);
    return res.status(500).json({ error: error.message });
  }
}