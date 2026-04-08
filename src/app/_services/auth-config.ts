export interface AuthConfig {
  issuerBaseUrl: string;
  authorizeEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint: string;
  logoutEndpoint: string;
  clientId: string;
  redirectUri: string;
  logoutRedirectUri: string;
  scopes: string[];
}
