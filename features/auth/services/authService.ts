import { authRepository } from "../repositories/authRepository";
import { authAdapter } from "../adapters/authAdapter";
import { LoginRequestDTO, RegisterRequestDTO } from "../../../types/api/auth";
import { User } from "../types";
import { setSessionToken, clearSession } from "../../../lib/auth/session";
import { APP_MODE, getDemoLatency } from "@/features/shared/config/appMode";

const MOCK_USER: User = {
  id: "demo-user-id",
  email: "demo@industromind.ai",
  name: "Demo Admin",
  role: "super_admin",
  organizationId: "demo-org-id",
  createdAt: new Date()
};

export const authService = {
  async login(request: LoginRequestDTO): Promise<User> {
    if (APP_MODE === "DEMO") {
      await getDemoLatency();
      setSessionToken("demo-token");
      return MOCK_USER;
    }
    
    try {
      const dto = await authRepository.login(request);
      if (dto.access_token) {
        setSessionToken(dto.access_token);
      }
      return authAdapter.adaptUser(dto.user);
    } catch (error) {
      if (APP_MODE === "AUTO") {
        await getDemoLatency();
        setSessionToken("demo-token");
        return { ...MOCK_USER, email: request.email };
      }
      throw error;
    }
  },

  async register(request: RegisterRequestDTO): Promise<User> {
    if (APP_MODE === "DEMO") {
      await getDemoLatency();
      setSessionToken("demo-token");
      return MOCK_USER;
    }
    
    try {
      const dto = await authRepository.register(request);
      if (dto.access_token) {
        setSessionToken(dto.access_token);
      }
      return authAdapter.adaptUser(dto.user);
    } catch (error) {
      if (APP_MODE === "AUTO") {
        await getDemoLatency();
        setSessionToken("demo-token");
        return { ...MOCK_USER, email: request.email };
      }
      throw error;
    }
  },
  
  async validateSession(): Promise<User | null> {
    if (APP_MODE === "DEMO") {
      await getDemoLatency(100, 200);
      return MOCK_USER;
    }

    try {
      const dto = await authRepository.getCurrentUser();
      return authAdapter.adaptUser(dto);
    } catch (error) {
      if (APP_MODE === "AUTO") {
        return MOCK_USER;
      }
      clearSession();
      return null;
    }
  },

  logout(): void {
    clearSession();
  }
};
