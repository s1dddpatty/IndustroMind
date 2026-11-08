import { apiClient } from "../../../lib/api/client";
import { API_ROUTES } from "../../../constants/api";
import { LoginRequestDTO, LoginResponseDTO, RegisterRequestDTO, RegisterResponseDTO, UserDTO } from "../../../types/api/auth";
import { handleApiError } from "../../../lib/api/errors";

export const authRepository = {
  async login(request: LoginRequestDTO): Promise<LoginResponseDTO> {
    try {
      const response = await apiClient.post<any>(API_ROUTES.AUTH.LOGIN, request);
      const resData = response.data?.data || response.data;
      return {
        access_token: resData.access_token,
        token_type: resData.token_type || "bearer",
        user: {
          id: resData.user?.id || "admin-id",
          email: resData.user?.email || request.email,
          name: resData.user?.full_name || resData.user?.username || resData.user?.name || "System Admin",
          role: resData.user?.role || "super_admin",
          organization_id: resData.user?.organization_id || "demo-org",
          created_at: resData.user?.created_at || new Date().toISOString(),
          last_login: resData.user?.last_login,
        }
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async register(request: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    try {
      const response = await apiClient.post<any>(API_ROUTES.AUTH.REGISTER, request);
      const resData = response.data?.data || response.data;
      return {
        access_token: resData.access_token,
        token_type: resData.token_type || "bearer",
        user: {
          id: resData.user?.id || "admin-id",
          email: resData.user?.email || request.email,
          name: resData.user?.full_name || resData.user?.username || resData.user?.name || "System Admin",
          role: resData.user?.role || "super_admin",
          organization_id: resData.user?.organization_id || "demo-org",
          created_at: resData.user?.created_at || new Date().toISOString(),
          last_login: resData.user?.last_login,
        }
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getCurrentUser(): Promise<UserDTO> {
    try {
      const response = await apiClient.get<any>("/auth/me");
      const u = response.data?.data || response.data;
      return {
        id: u.id || "admin-id",
        email: u.email,
        name: u.full_name || u.username || u.name || "System Admin",
        role: u.role || "super_admin",
        organization_id: u.organization_id || "demo-org",
        created_at: u.created_at || new Date().toISOString(),
        last_login: u.last_login,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }
};
