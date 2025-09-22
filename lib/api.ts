import { AuthService, ApiKey } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.codeset.ai/api/v1';

interface ApiKeyCreateRequest {
  name?: string;
}

interface ApiKeyCreateResponse {
  api_key: ApiKey;
}

interface ApiKeyRevokeResponse {
  message: string;
  revoked_key_id: string;
}

export class ApiService {
  static async createApiKey(name?: string): Promise<ApiKey> {
    const token = AuthService.getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/users/me/api-keys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (response.status === 401) {
      const refreshResult = await AuthService.refreshToken();
      if (refreshResult) {
        return this.createApiKey(name);
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create API key');
    }

    const data: ApiKeyCreateResponse = await response.json();
    return data.api_key;
  }

  static async revokeApiKey(keyId: string): Promise<void> {
    const token = AuthService.getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/users/me/api-keys/${keyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      const refreshResult = await AuthService.refreshToken();
      if (refreshResult) {
        return this.revokeApiKey(keyId);
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail?.message || errorData.message || 'Failed to revoke API key');
    }
  }
}

export type { ApiKeyCreateRequest, ApiKeyCreateResponse, ApiKeyRevokeResponse };