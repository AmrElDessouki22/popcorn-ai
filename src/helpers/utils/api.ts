/**
 * API Utility Functions
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApiResponseBuilder {
  public static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
    };
  }

  public static error(error: string, message?: string): ApiResponse {
    return {
      success: false,
      error,
      message,
    };
  }
}

export const handleApiError = (error: unknown): ApiResponse => {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    return ApiResponseBuilder.error(error.message, 'An error occurred');
  }
  
  return ApiResponseBuilder.error('Unknown error', 'An unexpected error occurred');
};