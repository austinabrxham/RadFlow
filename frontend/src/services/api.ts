// API service for RadFlow Compass
import { API_CONFIG } from '@/config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

class ApiService {
  private token: string | null = null;

  constructor() {
    // Get token from localStorage on initialization
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(username: string, password: string) {
    const response = await this.request<{
      message: string;
      token: string;
      user: {
        id: string;
        username: string;
        role: string;
        name: string;
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    this.token = response.token;
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    
    return response;
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  // Patient methods
  async getAllPatients() {
    return this.request<any[]>('/patients');
  }

  async getPatientsByRole(role: string) {
    return this.request<any[]>(`/patients/role/${role}`);
  }

  async getPatientById(patientId: string) {
    return this.request<any>(`/patients/${patientId}`);
  }

  async addPatient(patient: {
    patientId: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    diagnosis: string;
  }) {
    return this.request<{ message: string; patientId: string }>('/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  }

  async updatePatientStage(
    patientId: string,
    stage: string,
    status: 'Pending' | 'Completed'
  ) {
    return this.request<{ message: string }>(`/patients/${patientId}/stage`, {
      method: 'PUT',
      body: JSON.stringify({ stage, status }),
    });
  }

  // Health check
  async healthCheck() {
    const url = `${API_BASE_URL.replace('/api', '')}/health`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  }
}

export const apiService = new ApiService();
