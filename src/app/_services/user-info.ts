export interface UserInfo {
  sub: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  email_verified?: boolean;
  profile?: string;
  locale?: string;
  zoneinfo?: string;
  updated_at?: number;
  roles?: string[];
}
