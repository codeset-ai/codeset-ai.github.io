import { AuthService, ApiKey } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.codeset.ai/api/v1';

interface ApiKeyCreateRequest {
  name?: string;
}

interface ApiKeyCreateResponse {
  api_key: ApiKey;
}

interface ApiKeyRevokeRequest {
  key_id: string;
}

interface ApiKeyRevokeResponse {
  message: string;
  revoked_key_id: string;
}

interface UserCredits {
  user_id: string;
  balance: number;
  total_deposited: number;
  total_spent: number;
  stripe_customer_id?: string;
  last_updated: string;
}

interface PricingInfo {
  cost_per_minute_cents: number;
  cost_per_minute_dollars: number;
}

interface MoneyDepositRequest {
  amount_cents: number;
  currency: string;
}

interface MoneyDepositResponse {
  checkout_url: string;
  amount_cents: number;
  currency: string;
}

interface UsageTransaction {
  id: string;
  type: 'deposit' | 'session_usage' | 'refund';
  amount_cents: number;
  description: string;
  created_at: string;
  session_id?: string;
  duration_minutes?: number;
}

interface UsageHistory {
  current_balance_cents: number;
  total_deposits_cents: number;
  total_usage_cents: number;
  transactions: UsageTransaction[];
  summary: {
    total_sessions: number;
    average_session_cost_cents: number;
    total_session_duration_minutes: number;
    average_session_duration_minutes: number;
  };
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

  static async revokeApiKey(request: ApiKeyRevokeRequest): Promise<void> {
    const token = AuthService.getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/users/me/api-keys`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (response.status === 401) {
      const refreshResult = await AuthService.refreshToken();
      if (refreshResult) {
        return this.revokeApiKey(request);
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail?.message || errorData.message || 'Failed to revoke API key');
    }
  }

  static async getUserCredits(): Promise<UserCredits> {
    const token = AuthService.getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/billing/balance`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      const refreshResult = await AuthService.refreshToken();
      if (refreshResult) {
        return this.getUserCredits();
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail?.message || errorData.message || 'Failed to get user credits');
    }

    return response.json();
  }

  static async getPricingInfo(): Promise<PricingInfo> {
    const response = await fetch(`${API_BASE_URL}/billing/pricing`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail?.message || errorData.message || 'Failed to get pricing info');
    }

    return response.json();
  }

  static async createDepositSession(request: MoneyDepositRequest): Promise<MoneyDepositResponse> {
    const token = AuthService.getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/billing/deposit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (response.status === 401) {
      const refreshResult = await AuthService.refreshToken();
      if (refreshResult) {
        return this.createDepositSession(request);
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail?.message || errorData.message || 'Failed to create deposit session');
    }

    return response.json();
  }

  static async getUsageHistory(): Promise<UsageHistory> {
    const token = AuthService.getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/billing/usage`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      const refreshResult = await AuthService.refreshToken();
      if (refreshResult) {
        return this.getUsageHistory();
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail?.message || errorData.message || 'Failed to get usage history');
    }

    return response.json();
  }
}

export type {
  ApiKeyCreateRequest,
  ApiKeyCreateResponse,
  ApiKeyRevokeRequest,
  ApiKeyRevokeResponse,
  UserCredits,
  PricingInfo,
  MoneyDepositRequest,
  MoneyDepositResponse,
  UsageTransaction,
  UsageHistory
};