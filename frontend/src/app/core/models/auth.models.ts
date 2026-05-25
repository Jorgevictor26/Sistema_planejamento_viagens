export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  language: string;
  theme: string;
  created_at: string;
}

export interface AuthData {
  user: User;
  authorization: {
    token: string;
    type: string;
    expires_in: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
  password_confirmation: string;
}
