import {ApiKey, AuthService} from './auth';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.codeset.ai/api/v1';

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
  agent_job_cost_cents?: number;
  agent_job_cost_dollars?: number;
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
  type: 'deposit'|'session_usage'|'refund'|'agent_job_usage'|'agent_job_refund';
  amount_cents: number;
  description: string;
  created_at: string;
  session_id?: string;
  duration_minutes?: number;
  job_id?: string;
}

interface UsageHistoryPagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_previous: boolean;
  has_next: boolean;
}

interface UsageHistorySummary {
  total_sessions: number;
  total_deposits?: number;
  total_agent_jobs?: number;
  average_session_cost_cents: number;
  average_agent_job_cost_cents?: number;
  total_session_duration_minutes?: number;
  average_session_duration_minutes?: number;
}

interface UsageHistory {
  current_balance_cents: number;
  total_deposits_cents: number;
  total_usage_cents: number;
  transactions: UsageTransaction[];
  summary: UsageHistorySummary;
  pagination: UsageHistoryPagination;
}

interface Dataset {
  name: string;
  description?: string;
  sample_count?: number;
}

interface Sample {
  sample_id: string;
  description: string;
  language: string;
  verifier: string;
  dataset: string;
  version: number;
  version_description: string;
  latest: boolean;
  created_at: string;
  instance_id: string;
  repo: string;
  base_commit: string;
  patch: string;
  non_code_patch: string;
  test_patch: string;
  problem_statement: string;
  hints_text: string;
  environment_setup_commit: string;
  fail_to_pass: string[];
  pass_to_pass: string[];
  fail_to_fail: string[];
}

interface SampleListResponse {
  samples: Sample[];
  total_count: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

interface GitHubRepoItem {
  full_name: string;

  private: boolean;
  html_url: string;
}

interface GitHubReposResponse {
  repos: GitHubRepoItem[];
}

interface AgentJobCreateRequest {
  repo: string;
  ref?: string;
  agent_id: string;
}

interface AgentJobCreateResponse {
  job_id: string;
  status: string;
}

interface AgentJobListItem {
  job_id: string;
  repo: string;
  status: string;
  created_at: string;
  progress_pct?: number;
  progress_stage?: string;
  completed_at?: string;
  error_message?: string;
}

interface AgentJobListResponse {
  jobs: AgentJobListItem[];
  has_more: boolean;
  next_cursor?: string;
}

interface AgentJobResponse {
  job_id: string;
  status: string;
  created_at: string;
  progress_pct?: number;
  progress_stage?: string;
  result_available: boolean;
  completed_at?: string;
  error_message?: string;
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
      body: JSON.stringify({name}),
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
      throw new Error(
          errorData.detail?.message || errorData.message ||
          'Failed to revoke API key');
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
      throw new Error(
          errorData.detail?.message || errorData.message ||
          'Failed to get user credits');
    }

    return response.json();
  }

  static async getPricingInfo(): Promise<PricingInfo> {
    const response = await fetch(`${API_BASE_URL}/billing/pricing`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
          errorData.detail?.message || errorData.message ||
          'Failed to get pricing info');
    }

    return response.json();
  }

  static async createDepositSession(request: MoneyDepositRequest):
      Promise<MoneyDepositResponse> {
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
      throw new Error(
          errorData.detail?.message || errorData.message ||
          'Failed to create deposit session');
    }

    return response.json();
  }

  static async getUsageHistory(page: number = 1, limit: number = 25):
      Promise<UsageHistory> {
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
        return this.getUsageHistory(page, limit);
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
          errorData.detail?.message || errorData.message ||
          'Failed to get usage history');
    }

    return response.json();
  }

  static async getDatasets(): Promise<Dataset[]> {
    const response = await fetch(`${API_BASE_URL}/datasets`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
          errorData.detail?.message || errorData.message ||
          'Failed to get datasets');
    }

    return response.json();
  }

  static async getSamples(
      dataset?: string, page?: number, pageSize?: number,
      search?: string): Promise<SampleListResponse> {
    const url = new URL(`${API_BASE_URL}/samples`);
    if (dataset) {
      url.searchParams.append('dataset', dataset);
    }
    if (search) {
      url.searchParams.append('search', search);
    }
    if (page) {
      url.searchParams.append('page', page.toString());
    }
    if (pageSize) {
      url.searchParams.append('page_size', pageSize.toString());
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
          errorData.detail?.message || errorData.message ||
          'Failed to get samples');
    }

    return response.json();
  }

  static async getRepos(): Promise<GitHubReposResponse> {
    const token = AuthService.getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API_BASE_URL}/repos`, {
      headers: {'Authorization': `Bearer ${token}`},
    });
    if (response.status === 401) {
      const refreshResult = await AuthService.refreshToken();
      if (refreshResult) return this.getRepos();
      throw new Error('Authentication failed');
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const code = errorData.detail?.code ?? errorData.code;
      const message = errorData.detail?.message ?? errorData.message ??
          'Failed to get repos';
      const err = new Error(message) as Error & {code?: string};
      if (code) err.code = code;
      throw err;
    }
    return response.json();
  }

  static async createAgentJob(repo: string, agentId: string, ref?: string):
      Promise<AgentJobCreateResponse> {
    const token = AuthService.getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const body: AgentJobCreateRequest = {repo, agent_id: agentId};
    if (ref) body.ref = ref;
    const response = await fetch(`${API_BASE_URL}/agent-jobs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (response.status === 401) {
      const refreshResult = await AuthService.refreshToken();
      if (refreshResult) return this.createAgentJob(repo, agentId, ref);
      throw new Error('Authentication failed');
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const code = errorData.detail?.code || errorData.code;
      const message = errorData.detail?.message || errorData.message ||
          'Failed to create agent job';
      const err = new Error(message) as Error & {code?: string};
      if (code) err.code = code;
      throw err;
    }
    return response.json();
  }

  static async getAgentJob(jobId: string): Promise<AgentJobResponse> {
    const token = AuthService.getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API_BASE_URL}/agent-jobs/${jobId}`, {
      headers: {'Authorization': `Bearer ${token}`},
    });
    if (response.status === 401) {
      const refreshResult = await AuthService.refreshToken();
      if (refreshResult) return this.getAgentJob(jobId);
      throw new Error('Authentication failed');
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
          errorData.detail?.message || errorData.message ||
          'Failed to get agent job');
    }
    return response.json();
  }

  static async listAgentJobs(limit?: number, cursor?: string):
      Promise<AgentJobListResponse> {
    const token = AuthService.getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const url = new URL(`${API_BASE_URL}/agent-jobs`);
    if (limit != null) url.searchParams.set('limit', String(limit));
    if (cursor) url.searchParams.set('cursor', cursor);
    const response = await fetch(url.toString(), {
      headers: {'Authorization': `Bearer ${token}`},
    });
    if (response.status === 401) {
      const refreshResult = await AuthService.refreshToken();
      if (refreshResult) return this.listAgentJobs(limit, cursor);
      throw new Error('Authentication failed');
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
          errorData.detail?.message || errorData.message ||
          'Failed to list agent jobs');
    }
    return response.json();
  }

  static async getAgentJobResultBlob(jobId: string):
      Promise<{blob: Blob; filename: string}> {
    const token = AuthService.getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API_BASE_URL}/agent-jobs/${jobId}/result`, {
      headers: {'Authorization': `Bearer ${token}`},
    });
    if (response.status === 401) {
      const refreshResult = await AuthService.refreshToken();
      if (refreshResult) return this.getAgentJobResultBlob(jobId);
      throw new Error('Authentication failed');
    }
    if (!response.ok) {
      throw new Error('Result not available');
    }
    const blob = await response.blob();
    const disposition = response.headers.get('Content-Disposition');
    const filenameMatch = disposition?.match(/filename="?([^";]+)"?/);
    const filename = filenameMatch?.[1]?.trim() || `${jobId}.tar.gz`;
    return {blob, filename};
  }
}

export type{
  ApiKeyCreateRequest,
  ApiKeyCreateResponse,
  ApiKeyRevokeRequest,
  ApiKeyRevokeResponse,
  UserCredits,
  PricingInfo,
  MoneyDepositRequest,
  MoneyDepositResponse,
  UsageTransaction,
  UsageHistory,
  Dataset,
  Sample,
  SampleListResponse,
  GitHubRepoItem,
  GitHubReposResponse,
  AgentJobCreateRequest,
  AgentJobCreateResponse,
  AgentJobListItem,
  AgentJobListResponse,
  AgentJobResponse,
};