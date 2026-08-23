// Auth request payloads

export interface SignUpRequest {
  email: string;
  name: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

// Auth response shapes

export interface SignUpResponse {
  message: string;
}

export interface SignInResponse {
  access_token: string;
}

export interface ProfileResponse {
  id: string;
  email: string;
  name: string;
}
