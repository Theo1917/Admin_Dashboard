// Leads API Configuration
const RAW_API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000';
const normalizeApiBase = (url: string) => {
  const trimmed = url.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};
const API_BASE_URL = normalizeApiBase(RAW_API_BASE_URL);

// Types
export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone: string;
  location?: string;
  source: string;
  interest?: string;
  status: 'NEW' | 'CONTACTED' | 'INTERESTED' | 'CONVERTED' | 'LOST';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadData {
  name: string;
  email?: string;
  phone: string;
  location?: string;
  source: string;
  interest?: string;
}

export interface UpdateLeadData {
  status?: string;
  notes?: string;
}

// API Client class for Leads
class LeadsApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get all leads
  async getAll(): Promise<{ data: Lead[]; pagination?: any }> {
    return this.request<{ data: Lead[]; pagination?: any }>('/leads');
  }

  // Get lead by ID
  async getById(id: string): Promise<{ data: Lead }> {
    return this.request<{ data: Lead }>(`/leads/${id}`);
  }

  // Create new lead
  async create(data: CreateLeadData): Promise<{ data: Lead }> {
    return this.request<{ data: Lead }>('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Update lead status
  async updateStatus(id: string, status: string, notes?: string): Promise<{ data: Lead }> {
    return this.request<{ data: Lead }>(`/leads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Delete lead
  async delete(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/leads/${id}`, {
      method: 'DELETE',
    });
  }
}

// Create and export API client instance
export const leadsApiClient = new LeadsApiClient(API_BASE_URL);

// Export individual API functions for convenience
export const leadApi = {
  getAll: () => leadsApiClient.getAll(),
  getById: (id: string) => leadsApiClient.getById(id),
  create: (data: CreateLeadData) => leadsApiClient.create(data),
  updateStatus: (id: string, status: string, notes?: string) => leadsApiClient.updateStatus(id, status, notes),
  delete: (id: string) => leadsApiClient.delete(id),
};
