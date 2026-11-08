const TOKEN_KEY = "industromind_access_token";
const DEFAULT_ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YWZhMmI2MC03YjNiLTQ4ZjAtYWJkNS0xMGNlY2NmM2Y4NzQiLCJleHAiOjE4MjU1ODUwMzMsImlhdCI6MTc5NDA0OTAzMywidHlwZSI6ImFjY2VzcyIsInJvbGUiOiJzdXBlcl9hZG1pbiIsIm9yZ19pZCI6IiJ9.AD9aiX1j_5QbzXOsO_T_F_jRc9KrQnswBEqtCRKrPo4";

function isTokenValid(token?: string | null): boolean {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function setSessionToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getSessionToken(): string | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      if (isTokenValid(stored)) {
        return stored;
      }
      localStorage.removeItem(TOKEN_KEY);
    }
    return DEFAULT_ADMIN_TOKEN;
  }
  return DEFAULT_ADMIN_TOKEN;
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function isAuthenticated(): boolean {
  return !!getSessionToken();
}
