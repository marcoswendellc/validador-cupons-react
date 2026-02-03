import { google } from "googleapis";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Cache simples
let cachedData: any[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 1000; // 1 minuto

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;

    // 🔹 Verificação inicial das variáveis
    console.log("🔹 Variáveis de ambiente:", {
      GOOGLE_CLIENT_EMAIL,
      GOOGLE_PRIVATE_KEY_LENGTH: GOOGLE_PRIVATE_KEY?.length,
      GOOGLE_SHEET_ID,
    });

    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
      return res.status(500).json({ error: "Variáveis de ambiente não configuradas" });
    }

    // 🔹 Retorna cache se ainda válido
    const now = Date.now();
    if (cachedData && now - cacheTimestamp < CACHE_TTL) {
      console.log("🔹 Retornando dados do cache");
      return res.status(200).json({ values: cachedData });
    }

    // 🔹 JWT Auth
    console.log("🔹 Criando autenticação JWT...");
    const auth = new google.auth.JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    // 🔹 Testa autenticação
    await auth.authorize();
    console.log("✅ JWT autorizado com sucesso!");

    const sheets = google.sheets({ version: "v4", auth });

    console.log("🔹 Buscando dados da planilha...");
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: "A1:Z1000", // Ajuste conforme sua planilha
    });

    cachedData = response.data.values || [];
    cacheTimestamp = now;

    console.log(`✅ Dados carregados: ${cachedData.length} linhas`);
    return res.status(200).json({ values: cachedData });
  } catch (error: any) {
    console.error("❌ Google Sheets API Error:", error);
    return res.status(500).json({ error: "Erro ao acessar Google Sheets", details: error.message });
  }
}