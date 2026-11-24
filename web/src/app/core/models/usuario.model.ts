export interface Usuario {
  id: number;
  login: string;
  perfis: string[];
}

export interface LoginResponse {
  access_token: string;
}
