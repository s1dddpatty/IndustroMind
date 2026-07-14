export class ApiError extends Error {
  public status?: number;
  public code?: string;
  public details?: Record<string, any>;

  constructor(message: string, status?: number, code?: string, details?: Record<string, any>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error && typeof error === "object" && "isAxiosError" in error) {
    const axiosError = error as any;
    const response = axiosError.response;

    if (response) {
      // Backend returned a non-2xx response
      const message = response.data?.message || response.data?.detail || "An unexpected error occurred.";
      return new ApiError(message, response.status, response.data?.code, response.data?.details);
    } else if (axiosError.request) {
      // Request was made but no response was received
      return new ApiError("Network error. Please check your connection.", 0, "NETWORK_ERROR");
    }
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError("An unknown error occurred.");
}
