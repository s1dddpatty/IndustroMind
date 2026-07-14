import { apiClient } from "../../../lib/api/client";
import { API_ROUTES } from "../../../constants/api";
import { LoginRequestDTO, LoginResponseDTO, RegisterRequestDTO, RegisterResponseDTO, UserDTO } from "../../../types/api/auth";
import { handleApiError } from "../../../lib/api/errors";

export const authRepository = {
  async login(request: LoginRequestDTO): Promise<LoginResponseDTO> {
    try {
      const response = await apiClient.post<LoginResponseDTO>(API_ROUTES.AUTH.LOGIN, request);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async register(request: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    try {
      const response = await apiClient.post<RegisterResponseDTO>(API_ROUTES.AUTH.REGISTER, request);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  async getCurrentUser(): Promise<UserDTO> {
    try {
      // Assuming there is a /auth/me endpoint 
      const response = await apiClient.get<UserDTO>("/auth/me");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};
