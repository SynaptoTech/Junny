export interface ApiSuccess<T> {
  success: true;
  data: T;
  error: null;
}

export interface ApiFailure {
  success: false;
  data: null;
  error: Record<string, unknown> | string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
