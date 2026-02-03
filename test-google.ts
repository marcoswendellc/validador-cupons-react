import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

async function testGoogleSheets() {
  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL!,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: "A1:Z10",
    });

    console.log("Planilha retornada:", res.data.values);
  } catch (error) {
    console.error("Erro ao acessar a planilha:", error);
  }
}

testGoogleSheets();