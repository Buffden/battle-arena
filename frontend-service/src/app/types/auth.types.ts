export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: string;
  username: string;
  email: string;
}

export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  message: string;
}

export interface LogoutResponse {
  message: string;
}
