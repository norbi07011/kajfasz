/**
 * API Client Configuration
 * Centralized HTTP client with environment-based URL configuration
 * Windows-compatible configuration for stable communication with backend
 */

import type { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse, 
  TrainerData,
  ClientData,
  MeasurementRecord,
  WorkoutPlan,
  NutritionPlan,
  ApiErrorData
} from './types.js';

// Environment-based API URL configuration
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8200';

console.log('🔧 API Client Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE,
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV
});

/**
 * Enhanced fetch wrapper with error handling and logging
 */
export class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl.replace(/\/+$/, ''); // Remove trailing slashes
    console.log('🚀 ApiClient initialized with base URL:', this.baseUrl);
  }

  /**
   * Generic request method with comprehensive error handling
   */
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: defaultHeaders,
    };

    console.log(`🌐 ${options.method || 'GET'} ${url}`, {
      headers: Object.keys(defaultHeaders),
      hasBody: !!options.body
    });

    try {
      const response = await fetch(url, config);
      
      console.log(`📊 Response ${response.status} from ${url}`, {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: `HTTP ${response.status}: ${response.statusText}` 
        }));
        
        console.error('❌ API Request failed:', {
          url,
          status: response.status,
          error: errorData
        });
        
        throw new ApiError(
          errorData.error || `Request failed with status ${response.status}`,
          response.status,
          errorData
        );
      }

      const data = await response.json();
      console.log(`✅ API Request successful:`, { url, dataKeys: Object.keys(data) });
      
      return data;
    } catch (error) {
      console.error('🚨 API Request error:', {
        url,
        error: error instanceof Error ? error.message : error
      });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0,
        error
      );
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.get<any>('/api');
      return {
        status: 'healthy',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('🏥 Health check failed:', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString()
      };
    }
  }
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Named exports for specific API endpoints
export const authApi = {
  login: (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => 
    apiClient.post('/api/auth/login', credentials),
  
  verify: (token: string): Promise<ApiResponse<TrainerData>> => 
    apiClient.post('/api/auth/verify', { token }),
  
  getProfile: (): Promise<ApiResponse<TrainerData>> => 
    apiClient.get('/api/auth/profile'),
};

export const clientsApi = {
  getAll: (): Promise<ApiResponse<ClientData[]>> => 
    apiClient.get('/api/clients'),
  
  getById: (id: string): Promise<ApiResponse<ClientData>> => 
    apiClient.get(`/api/clients/${id}`),
  
  create: (clientData: Omit<ClientData, 'id' | 'trainerId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ClientData>> => 
    apiClient.post('/api/clients', clientData),
  
  update: (id: string, clientData: Partial<ClientData>): Promise<ApiResponse<ClientData>> => 
    apiClient.put(`/api/clients/${id}`, clientData),
  
  delete: (id: string): Promise<ApiResponse<null>> => 
    apiClient.delete(`/api/clients/${id}`),
};

export const measurementsApi = {
  getAll: (params?: { clientId?: string; startDate?: string; endDate?: string; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.clientId) searchParams.set('clientId', params.clientId);
    if (params?.startDate) searchParams.set('startDate', params.startDate);
    if (params?.endDate) searchParams.set('endDate', params.endDate);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    return apiClient.get(`/api/measurements${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: string) => 
    apiClient.get(`/api/measurements/${id}`),
  
  create: (measurementData: any) => 
    apiClient.post('/api/measurements', measurementData),
  
  update: (id: string, measurementData: any) => 
    apiClient.put(`/api/measurements/${id}`, measurementData),
  
  delete: (id: string) => 
    apiClient.delete(`/api/measurements/${id}`),
};

export const plansApi = {
  getWorkouts: (params?: { clientId?: string; isActive?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.clientId) searchParams.set('clientId', params.clientId);
    if (params?.isActive !== undefined) searchParams.set('isActive', params.isActive.toString());
    
    const queryString = searchParams.toString();
    return apiClient.get(`/api/plans/workouts${queryString ? `?${queryString}` : ''}`);
  },
  
  getWorkoutById: (id: string) => 
    apiClient.get(`/api/plans/workouts/${id}`),
  
  createWorkout: (workoutData: any) => 
    apiClient.post('/api/plans/workouts', workoutData),
  
  updateWorkout: (id: string, workoutData: any) => 
    apiClient.put(`/api/plans/workouts/${id}`, workoutData),
  
  deleteWorkout: (id: string) => 
    apiClient.delete(`/api/plans/workouts/${id}`),
  
  getNutrition: (params?: { clientId?: string; isActive?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.clientId) searchParams.set('clientId', params.clientId);
    if (params?.isActive !== undefined) searchParams.set('isActive', params.isActive.toString());
    
    const queryString = searchParams.toString();
    return apiClient.get(`/api/plans/nutrition${queryString ? `?${queryString}` : ''}`);
  },
  
  getNutritionById: (id: string) => 
    apiClient.get(`/api/plans/nutrition/${id}`),
  
  createNutrition: (nutritionData: any) => 
    apiClient.post('/api/plans/nutrition', nutritionData),
  
  updateNutrition: (id: string, nutritionData: any) => 
    apiClient.put(`/api/plans/nutrition/${id}`, nutritionData),
  
  deleteNutrition: (id: string) => 
    apiClient.delete(`/api/plans/nutrition/${id}`),
};

export default apiClient;