/**
 * API service for communicating with the backend
 */
import axios from 'axios';
import { API_ENDPOINTS, API_TIMEOUT } from '../config/api';

export const apiService = {
  /**
   * Check API health
   */
  async checkHealth() {
    try {
      const response = await axios.get(API_ENDPOINTS.HEALTH, {
        timeout: API_TIMEOUT,
        headers: { 'Content-Type': 'application/json' },
      });
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
      const response = await axios.get(API_ENDPOINTS.SYMPTOMS, {
        timeout: API_TIMEOUT,
        headers: { 'Content-Type': 'application/json' },
      });
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
      const response = await axios.get(API_ENDPOINTS.DISEASES, {
        timeout: API_TIMEOUT,
        headers: { 'Content-Type': 'application/json' },
      });
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
      const response = await axios.post(
        API_ENDPOINTS.PREDICT,
        { symptoms: symptoms },
        {
          timeout: API_TIMEOUT,
          headers: { 'Content-Type': 'application/json' },
        }
      );
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
