import { clearSession, getSessionToken } from "./session";

export function getAuthorizationHeader(): Record<string, string> {
  const token = getSessionToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export function handleLogout(redirectTo: string = "/auth/login"): void {
  clearSession();
  if (typeof window !== "undefined") {
    window.location.href = redirectTo;
  }
}
