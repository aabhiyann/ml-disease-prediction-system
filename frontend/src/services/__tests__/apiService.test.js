/**
 * Tests for API service
 */
import axios from 'axios';
import apiService from '../apiService';
import { API_ENDPOINTS } from '../../config/api';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('apiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkHealth', () => {
    test('returns health data on successful request', async () => {
      const mockResponse = { data: { status: 'healthy' } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await apiService.checkHealth();

      expect(mockedAxios.get).toHaveBeenCalledWith(API_ENDPOINTS.HEALTH);
      expect(result).toEqual({ status: 'healthy' });
    });

    test('throws error on failed request', async () => {
      const mockError = new Error('Network error');
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(apiService.checkHealth()).rejects.toThrow('Health check failed: Network error');
    });
  });

  describe('getSymptoms', () => {
    test('returns symptoms list on successful request', async () => {
      const mockResponse = { data: { symptoms: ['fever', 'cough', 'headache'] } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await apiService.getSymptoms();

      expect(mockedAxios.get).toHaveBeenCalledWith(API_ENDPOINTS.SYMPTOMS);
      expect(result).toEqual(['fever', 'cough', 'headache']);
    });

    test('throws error on failed request', async () => {
      const mockError = new Error('Server error');
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(apiService.getSymptoms()).rejects.toThrow('Failed to fetch symptoms: Server error');
    });
  });

  describe('getDiseases', () => {
    test('returns diseases list on successful request', async () => {
      const mockResponse = { data: { diseases: ['Cold', 'Flu', 'Fever'] } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await apiService.getDiseases();

      expect(mockedAxios.get).toHaveBeenCalledWith(API_ENDPOINTS.DISEASES);
      expect(result).toEqual(['Cold', 'Flu', 'Fever']);
    });

    test('throws error on failed request', async () => {
      const mockError = new Error('Server error');
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(apiService.getDiseases()).rejects.toThrow('Failed to fetch diseases: Server error');
    });
  });

  describe('predictDisease', () => {
    test('returns prediction result on successful request', async () => {
      const mockResponse = {
        data: {
          disease: 'Common Cold',
          description: 'A viral infection',
          precautions: ['Rest', 'Stay hydrated']
        }
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const symptoms = ['fever', 'cough'];
      const result = await apiService.predictDisease(symptoms);

      expect(mockedAxios.post).toHaveBeenCalledWith(API_ENDPOINTS.PREDICT, {
        symptoms: symptoms
      });
      expect(result).toEqual({
        disease: 'Common Cold',
        description: 'A viral infection',
        precautions: ['Rest', 'Stay hydrated']
      });
    });

    test('throws error with server error message', async () => {
      const mockError = {
        response: {
          data: { error: 'Invalid symptoms provided' }
        }
      };
      mockedAxios.post.mockRejectedValue(mockError);

      await expect(apiService.predictDisease(['invalid'])).rejects.toThrow('Invalid symptoms provided');
    });

    test('throws generic error on network failure', async () => {
      const mockError = new Error('Network error');
      mockedAxios.post.mockRejectedValue(mockError);

      await expect(apiService.predictDisease(['fever'])).rejects.toThrow('Prediction failed: Network error');
    });
  });
});
