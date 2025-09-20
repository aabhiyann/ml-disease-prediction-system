/**
 * API service for communicating with the backend
 */
import axios from 'axios';
import { API_ENDPOINTS, API_TIMEOUT } from '../config/api';

// Create axios instance with default config
const apiClient = axios.create({
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response received from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);

export const apiService = {
  /**
   * Check API health
   */
  async checkHealth() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.HEALTH);
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  },

  /**
   * Get list of available symptoms
   */
  async getSymptoms() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SYMPTOMS);
      return response.data.symptoms;
    } catch (error) {
      throw new Error(`Failed to fetch symptoms: ${error.message}`);
    }
  },

  /**
   * Get list of available diseases
   */
  async getDiseases() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DISEASES);
      return response.data.diseases;
    } catch (error) {
      throw new Error(`Failed to fetch diseases: ${error.message}`);
    }
  },

  /**
   * Predict disease based on symptoms
   */
  async predictDisease(symptoms) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PREDICT, {
        symptoms: symptoms,
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error(`Prediction failed: ${error.message}`);
    }
  },
};

export default apiService;
