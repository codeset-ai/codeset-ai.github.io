interface User {
  user_id: string;
  name: string;
  email: string;
  github_id?: string;
  api_keys: ApiKey[];
  created_at: string;
  last_login_at?: string;
  is_active: boolean;
}

interface ApiKey {
  key_id: string;
  key: string;
  name?: string;
  created_at: string;
  expires_at?: string;
  is_active: boolean;
  last_used_at?: string;
}

interface GitHubOAuthResponse {
  user_id: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  is_new_user: boolean;
}

interface TokenRefreshResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.codeset.ai/api/v1';

export class AuthService {
  private static readonly TOKEN_KEY = 'codeset_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'codeset_refresh_token';

  static getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getStoredRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static storeTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static async githubOAuth(code: string, state?: string): Promise<GitHubOAuthResponse> {
    console.log('Calling OAuth endpoint:', `${API_BASE_URL}/auth/github`);

    const response = await fetch(`${API_BASE_URL}/auth/github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state }),
    });

    console.log('OAuth response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('OAuth error response:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || 'GitHub OAuth failed' };
      }
      throw new Error(errorData.detail?.message || errorData.message || 'GitHub OAuth failed');
    }

    const data: GitHubOAuthResponse = await response.json();
    console.log('OAuth success, storing tokens');
    this.storeTokens(data.access_token, data.refresh_token);
    return data;
  }

  static async refreshToken(): Promise<TokenRefreshResponse | null> {
    const refreshToken = this.getStoredRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const data: TokenRefreshResponse = await response.json();
      localStorage.setItem(this.TOKEN_KEY, data.access_token);
      return data;
    } catch {
      this.clearTokens();
      return null;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    const token = this.getStoredToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        const refreshResult = await this.refreshToken();
        if (refreshResult) {
          return this.getCurrentUser();
        }
        return null;
      }

      if (!response.ok) {
        return null;
      }

      return response.json();
    } catch {
      return null;
    }
  }

  static logout(): void {
    this.clearTokens();
  }

  static getGitHubOAuthUrl(): string {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    if (!clientId) {
      throw new Error('GitHub client ID not configured');
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${window.location.origin}/auth/callback`,
      scope: 'user:email',
      state: Math.random().toString(36).substring(7),
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }
}

export type { User, ApiKey, GitHubOAuthResponse };