/**
 * API configuration and endpoints
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  SYMPTOMS: `${API_BASE_URL}/symptoms`,
  PREDICT: `${API_BASE_URL}/predict`,
  DISEASES: `${API_BASE_URL}/diseases`,
};

export const API_TIMEOUT = 10000; // 10 seconds
