// Serviço para acessar planilha PRIVADA via API REST (frontend compatible)
const serviceAccountKey = {
  private_key: import.meta.env.VITE_GOOGLE_PRIVATE_KEY,
  client_email: import.meta.env.VITE_GOOGLE_CLIENT_EMAIL,
  project_id: import.meta.env.VITE_GOOGLE_PROJECT_ID,
};

import { toast } from "react-hot-toast";

export interface User {
  username: string;
  password: string;
  row: number;
}

export interface Cupom {
  codigo: string;
  cliente: string;
  lojista: string;
  status: string;
  data_resgate: string;
  usuario: string;
  row: number;
}

export interface TestResult {
  success: boolean;
  message: string;
  data?: any;
}

class PrivateGoogleSheetsService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private readonly SPREADSHEET_ID = "1Ex9kvFQSdSR9xSmk84XQ8Zm1dU3cll1z0RetFiFEexA";
  private readonly RANGE_USUARIOS = "Usuarios!A:B"; // A=usuario, B=senha na aba "Usuarios"
  private readonly RANGE_CUPONS = "Cupons!A:F"; // A=Código, B=Cliente, C=Lojista, D=Status, E=Data Resgate, Usuario
  private readonly SCOPES = "https://www.googleapis.com/auth/spreadsheets";

  constructor() {
    // console.log("🔧 Serviço inicializado para planilha privada");
  }

  /**
   * Converte string para base64url (compatível com browser)
   */
  private base64UrlEncode(data: string): string {
    const base64 = btoa(data);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }

  /**
   * Converte ArrayBuffer para base64url
   */
  private arrayBufferToBase64Url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
    return this.base64UrlEncode(binary);
  }

  /**
   * Importa chave privada RSA (compatível com browser)
   */
  private async importPrivateKey(): Promise<CryptoKey> {
    // Limpar e formatar chave privada
    const privateKeyPem = serviceAccountKey.private_key
      .replace(/\\n/g, "\n")
      .replace("-----BEGIN PRIVATE KEY-----", "")
      .replace("-----END PRIVATE KEY-----", "")
      .replace(/\n/g, "");

    // Decodificar base64
    const binaryString = atob(privateKeyPem);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Importar chave usando Web Crypto API
    return await crypto.subtle.importKey(
      "pkcs8",
      bytes.buffer,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      false,
      ["sign"]
    );
  }

  /**
   * Gera JWT usando Web Crypto API (compatível com browser)
   */
  private async generateJWT(): Promise<string> {
    try {
      // console.log("🔑 Gerando JWT com Web Crypto API...");

      const now = Math.floor(Date.now() / 1000);
      const expiry = now + 3600; // 1 hora

      // Header
      const header = {
        alg: "RS256",
        typ: "JWT",
      };

      // Payload
      const payload = {
        iss: serviceAccountKey.client_email,
        scope: this.SCOPES,
        aud: "https://oauth2.googleapis.com/token",
        exp: expiry,
        iat: now,
      };

      // Codificar header e payload
      const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
      const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
      const dataToSign = `${encodedHeader}.${encodedPayload}`;

      // Importar chave privada
      const privateKey = await this.importPrivateKey();

      // Assinar com Web Crypto API
      const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, new TextEncoder().encode(dataToSign));

      // Codificar assinatura
      const encodedSignature = this.arrayBufferToBase64Url(signature);

      const jwt = `${dataToSign}.${encodedSignature}`;
      // console.log("✅ JWT gerado com Web Crypto API");
      return jwt;
    } catch (error) {
      console.error("❌ Erro ao gerar JWT:", error);
      throw new Error("Falha ao gerar JWT");
    }
  }

  /**
   * Obtém access token para planilha privada
   */
  private async getAccessToken(): Promise<string> {
    // Reutilizar token válido
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      // console.log("🔄 Reutilizando access token");
      return this.accessToken;
    }

    try {
      // console.log("🔑 Obtendo access token para planilha privada...");

      const jwtToken = await this.generateJWT(); // Agora é async

      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion: jwtToken,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro ao obter access token:", response.status, errorText);
        throw new Error(`Falha OAuth2: ${response.status}`);
      }

      const tokenData = await response.json();

      this.accessToken = tokenData.access_token;
      this.tokenExpiry = Date.now() + tokenData.expires_in * 1000 - 60000; // Buffer 1min

      // console.log("✅ Access token obtido para planilha privada");
      return this.accessToken!; // Non-null assertion já que acabamos de atribuir
    } catch (error) {
      console.error("❌ Erro no processo OAuth2:", error);
      throw error;
    }
  }

  /**
   * Faz requisição autenticada para planilha privada
   */
  private async makeAuthenticatedRequest(endpoint: string): Promise<any> {
    const accessToken = await this.getAccessToken();

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SPREADSHEET_ID}/values/${endpoint}`;

    // console.log("📡 Acessando planilha privada:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erro ao acessar planilha:", response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    // console.log("✅ Dados carregados da planilha privada");
    return data;
  }

  async atualizarCupomNaPlanilha(data: Cupom, usuario: string): Promise<void> {
    const accessToken = await this.getAccessToken();
    const range = `Cupons!A${data.row}:F${data.row}`; // Atualiza colunas D, E, F na linha específica
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SPREADSHEET_ID}/values/${range}?valueInputOption=USER_ENTERED`;
    data.data_resgate = new Date().toLocaleString(); // Atualiza data de resgate para o momento atual

    const updateData = {
      values: [[data.codigo, data.row, data.lojista, "Resgatado", data.data_resgate, usuario]],
    };

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erro ao atualizar cupom na planilha:", response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Resultado da atualização do cupom:", result);

    // console.log("✅ Cupom atualizado na planilha privada");
  }

  /**
   * Testa conexão com planilha privada
   */
  async testConnection(): Promise<TestResult> {
    try {
      // console.log("🧪 Testando acesso à planilha privada...");

      const accessToken = await this.getAccessToken();

      // Testar metadados da planilha
      const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.SPREADSHEET_ID}`;
      const response = await fetch(metadataUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao acessar planilha: ${response.status}`);
      }

      const metadata = await response.json();

      return {
        success: true,
        message: `✅ Conectado à planilha privada: "${metadata.properties?.title}"`,
        data: {
          title: metadata.properties?.title,
          sheets: metadata.sheets?.length || 0,
        },
      };
    } catch (error) {
      console.error("❌ Erro no teste:", error);
      return {
        success: false,
        message: `❌ Erro ao acessar planilha privada: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      };
    }
  }

  /**
   * Carrega usuários REAIS da planilha privada
   */

  async getCupons(): Promise<Cupom[]> {
    try {
      const data = await this.makeAuthenticatedRequest(this.RANGE_CUPONS);
      if (!data.values || data.values.length === 0) {
        console.warn("⚠️ Nenhum dado encontrado na planilha");
        return [];
      }

      const startRow = 1;
      const cupons: Cupom[] = [];

      for (let i = startRow; i < data.values.length; i++) {
        const row = data.values[i];
        if (row && row.length >= 2 && row[0] && row[1]) {
          cupons.push({
            codigo: row[0]?.toString().trim(),
            cliente: row[1]?.toString().trim(),
            lojista: row[2]?.toString().trim(),
            status: row[3]?.toString().trim(),
            data_resgate: row[4]?.toString().trim(),
            usuario: row[5]?.toString().trim(),
            row: i + 1,
          });
        }
      }
      return cupons;
    } catch (error) {
      console.error("❌ Erro ao carregar cupons da planilha:", error);
      throw error;
    }
  }

  async validarCupom(codigo: string, usuario: string): Promise<{ success: boolean; message: string; cupom?: Cupom }> {
    try {
      const cupons = await this.getCupons();
      const cupom = cupons.find((c) => c.codigo === codigo);

      if (cupom) {
        if (cupom.status.toLowerCase() === "resgatado") {
          toast.error("Cupom já foi resgatado");
          return {
            success: false,
            message: "Cupom já foi resgatado",
          };
        }

        await this.atualizarCupomNaPlanilha(cupom, usuario);

        toast.success("Cupom validado com sucesso");
        return {
          success: true,
          message: "Cupom validado com sucesso",
        };
      }

      toast.error("Cupom não encontrado");
      return {
        success: false,
        message: "Cupom não encontrado",
      };
    } catch (error) {
      console.error("❌ Erro ao validar cupom:", error);
      return {
        success: false,
        message: `Erro ao validar cupom: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      };
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      // console.log("👥 Carregando usuários REAIS da planilha privada...");

      const data = await this.makeAuthenticatedRequest(this.RANGE_USUARIOS);

      if (!data.values || data.values.length === 0) {
        console.warn("⚠️ Nenhum dado encontrado na planilha");
        return [];
      }

      const users: User[] = [];

      const startRow = 1; // Sempre pular primeira linha como cabeçalho

      for (let i = startRow; i < data.values.length; i++) {
        const row = data.values[i];
        if (row && row.length >= 2 && row[0] && row[1]) {
          users.push({
            username: row[0].toString().trim(),
            password: row[1].toString().trim(),
            row: i + 1,
          });
        }
      }
      // console.log(`✅ ${users.length} usuários REAIS carregados da planilha`);
      return users;
    } catch (error) {
      console.error("❌ Erro ao carregar usuários da planilha:", error);
      throw error;
    }
  }

  /**
   * FUNÇÃO PRINCIPAL: Valida usuário/senha na planilha PRIVADA REAL
   */
  async validateUser(username: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      // console.log(`🔐 Validando usuário "${username}" na planilha privada...`);

      // Carregar usuários REAIS da planilha
      const users = await this.getUsers();

      if (users.length === 0) {
        return {
          success: false,
          message: "❌ Nenhum usuário encontrado na planilha",
        };
      }

      // Procurar usuário REAL
      const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

      if (user) {
        // console.log(`✅ Usuário "${username}" validado na planilha privada`);
        return {
          success: true,
          message: "✅ Login realizado com sucesso!",
          user,
        };
      } else {
        // console.log(`❌ Credenciais inválidas para "${username}"`);
        return {
          success: false,
          message: "❌ Usuário ou senha incorretos",
        };
      }
    } catch (error) {
      console.error("❌ Erro na validação:", error);
      return {
        success: false,
        message: `❌ Erro ao validar na planilha: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      };
    }
  }
}

// Singleton
export const privateGoogleSheetsService = new PrivateGoogleSheetsService();
export default privateGoogleSheetsService;
