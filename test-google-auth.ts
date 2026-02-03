import dotenv from "dotenv";
dotenv.config();

import handler from "./api/google-auth";

// Mock do VercelRequest e VercelResponse
const req = {} as any;

const res = {
  status: (code: number) => {
    console.log("Status:", code);
    return res;
  },
  json: (data: any) => {
    console.log("JSON response:", data);
    return data;
  },
} as any;

(async () => {
  try {
    await handler(req, res);
  } catch (err) {
    console.error("Erro ao testar handler:", err);
  }
})();