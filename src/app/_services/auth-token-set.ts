export interface AuthTokenSet {
  tokenType: string;
  accessToken: string;
  refreshToken: string | null;
  idToken: string | null;
  expiresIn: number;
  issuedAt: number;
  scopes: string[];
}
