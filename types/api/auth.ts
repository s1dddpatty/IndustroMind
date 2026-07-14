export interface LoginRequestDTO {
  email: string;
  password?: string; // Optional if provider login is used
}

export interface RegisterRequestDTO {
  email: string;
  password?: string;
  name: string;
  organization?: string;
  industry?: string;
  plants?: number;
}

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: string;
  organization_id: string;
  created_at: string;
  last_login?: string;
}

export interface LoginResponseDTO {
  access_token: string;
  token_type: string;
  user: UserDTO;
}

export interface RegisterResponseDTO {
  access_token: string;
  token_type: string;
  user: UserDTO;
}
