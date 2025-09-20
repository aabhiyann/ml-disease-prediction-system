/**
 * Tests for DiseaseForm component
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiseaseForm from '../DiseaseForm';
import apiService from '../../services/apiService';

// Mock the API service
jest.mock('../../services/apiService');

describe('DiseaseForm', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    // Mock API to never resolve
    apiService.checkHealth.mockImplementation(() => new Promise(() => {}));
    
    render(<DiseaseForm />);
    
    expect(screen.getByText('Connecting to prediction service...')).toBeInTheDocument();
  });

  test('renders error state when API is unavailable', async () => {
    apiService.checkHealth.mockRejectedValue(new Error('Service unavailable'));
    
    render(<DiseaseForm />);
    
    await waitFor(() => {
      expect(screen.getByText('Service Unavailable')).toBeInTheDocument();
    });
  });

  test('renders form when API is available', async () => {
    apiService.checkHealth.mockResolvedValue({ status: 'healthy' });
    apiService.getSymptoms.mockResolvedValue(['fever', 'cough', 'headache']);
    
    render(<DiseaseForm />);
    
    await waitFor(() => {
      expect(screen.getByText('DISEASE PREDICTION')).toBeInTheDocument();
    });
  });

  test('adds new symptom when add button is clicked', async () => {
    apiService.checkHealth.mockResolvedValue({ status: 'healthy' });
    apiService.getSymptoms.mockResolvedValue(['fever', 'cough', 'headache']);
    
    render(<DiseaseForm />);
    
    await waitFor(() => {
      expect(screen.getByText('DISEASE PREDICTION')).toBeInTheDocument();
    });
    
    const addButton = screen.getByText('+ Add Another Symptom');
    fireEvent.click(addButton);
    
    expect(screen.getByText('Symptom 2')).toBeInTheDocument();
  });

  test('removes symptom when remove button is clicked', async () => {
    apiService.checkHealth.mockResolvedValue({ status: 'healthy' });
    apiService.getSymptoms.mockResolvedValue(['fever', 'cough', 'headache']);
    
    render(<DiseaseForm />);
    
    await waitFor(() => {
      expect(screen.getByText('DISEASE PREDICTION')).toBeInTheDocument();
    });
    
    // Add a second symptom
    const addButton = screen.getByText('+ Add Another Symptom');
    fireEvent.click(addButton);
    
    // Remove the second symptom
    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);
    
    expect(screen.queryByText('Symptom 2')).not.toBeInTheDocument();
  });

  test('shows error when no symptoms are selected', async () => {
    apiService.checkHealth.mockResolvedValue({ status: 'healthy' });
    apiService.getSymptoms.mockResolvedValue(['fever', 'cough', 'headache']);
    
    render(<DiseaseForm />);
    
    await waitFor(() => {
      expect(screen.getByText('DISEASE PREDICTION')).toBeInTheDocument();
    });
    
    const submitButton = screen.getByText('Predict Disease');
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Please select at least one symptom.')).toBeInTheDocument();
  });

  test('submits form with selected symptoms', async () => {
    apiService.checkHealth.mockResolvedValue({ status: 'healthy' });
    apiService.getSymptoms.mockResolvedValue(['fever', 'cough', 'headache']);
    apiService.predictDisease.mockResolvedValue({
      disease: 'Common Cold',
      description: 'A viral infection',
      precautions: ['Rest', 'Stay hydrated']
    });
    
    render(<DiseaseForm />);
    
    await waitFor(() => {
      expect(screen.getByText('DISEASE PREDICTION')).toBeInTheDocument();
    });
    
    // Select a symptom
    const symptomSelect = screen.getByDisplayValue('Select a symptom...');
    fireEvent.change(symptomSelect, { target: { value: 'fever' } });
    
    // Submit form
    const submitButton = screen.getByText('Predict Disease');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(apiService.predictDisease).toHaveBeenCalledWith(['fever']);
    });
  });

  test('displays prediction result in modal', async () => {
    apiService.checkHealth.mockResolvedValue({ status: 'healthy' });
    apiService.getSymptoms.mockResolvedValue(['fever', 'cough', 'headache']);
    apiService.predictDisease.mockResolvedValue({
      disease: 'Common Cold',
      description: 'A viral infection',
      precautions: ['Rest', 'Stay hydrated']
    });
    
    render(<DiseaseForm />);
    
    await waitFor(() => {
      expect(screen.getByText('DISEASE PREDICTION')).toBeInTheDocument();
    });
    
    // Select a symptom and submit
    const symptomSelect = screen.getByDisplayValue('Select a symptom...');
    fireEvent.change(symptomSelect, { target: { value: 'fever' } });
    
    const submitButton = screen.getByText('Predict Disease');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Common Cold')).toBeInTheDocument();
      expect(screen.getByText('A viral infection')).toBeInTheDocument();
    });
  });
});
