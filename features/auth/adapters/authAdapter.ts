import { UserDTO } from "../../../types/api/auth";
import { User } from "../types";

export const authAdapter = {
  adaptUser(dto: UserDTO): User {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.name,
      role: dto.role,
      organizationId: dto.organization_id,
      createdAt: new Date(dto.created_at),
      lastLogin: dto.last_login ? new Date(dto.last_login) : undefined,
    };
  }
};
