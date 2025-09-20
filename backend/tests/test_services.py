"""
Service layer tests for the ML Disease Prediction system
"""
import pytest
import pandas as pd
import numpy as np
from unittest.mock import patch, MagicMock
from services.data_service import DataService
from services.prediction_service import PredictionService

class TestDataService:
    """Test DataService class"""
    
    @pytest.fixture
    def mock_config(self):
        """Mock configuration"""
        config = MagicMock()
        config.DATASET_PATH = 'test_dataset.csv'
        config.SYMPTOM_SEVERITY_PATH = 'test_symptoms.csv'
        config.DESCRIPTION_PATH = 'test_descriptions.csv'
        config.PRECAUTION_PATH = 'test_precautions.csv'
        return config
    
    @patch('pandas.read_csv')
    def test_load_data_success(self, mock_read_csv, mock_config):
        """Test successful data loading"""
        # Mock CSV data
        mock_df = pd.DataFrame({
            'Disease': ['Cold', 'Flu'],
            'Symptom_1': ['fever', 'fever'],
            'Symptom_2': ['cough', 'headache']
        })
        
        mock_symptoms = pd.DataFrame({
            'Symptom': ['fever', 'cough', 'headache'],
            'weight': [1, 2, 3]
        })
        
        mock_descriptions = pd.DataFrame({
            'Disease': ['Cold', 'Flu'],
            'Description': ['Cold description', 'Flu description']
        })
        
        mock_precautions = pd.DataFrame({
            'Disease': ['Cold', 'Flu'],
            'Precaution_1': ['Rest', 'Rest'],
            'Precaution_2': ['Hydrate', 'Medication']
        })
        
        mock_read_csv.side_effect = [mock_df, mock_symptoms, mock_descriptions, mock_precautions]
        
        data_service = DataService(mock_config)
        
        assert data_service.df is not None
        assert data_service.symptom_severity is not None
        assert data_service.descriptions is not None
        assert data_service.precaution is not None

    def test_get_symptoms_list(self, mock_config):
        """Test getting symptoms list"""
        with patch('pandas.read_csv') as mock_read_csv:
            mock_symptoms = pd.DataFrame({
                'Symptom': ['fever', 'cough', 'headache'],
                'weight': [1, 2, 3]
            })
            mock_read_csv.return_value = mock_symptoms
            
            data_service = DataService(mock_config)
            symptoms = data_service.get_symptoms_list()
            
            assert len(symptoms) == 3
            assert 'fever' in symptoms

class TestPredictionService:
    """Test PredictionService class"""
    
    @pytest.fixture
    def mock_config(self):
        """Mock configuration"""
        config = MagicMock()
        config.MODEL_PATH = 'test_model.joblib'
        config.MAX_SYMPTOMS = 17
        config.MIN_SYMPTOMS = 1
        return config
    
    @pytest.fixture
    def mock_data_service(self):
        """Mock data service"""
        data_service = MagicMock()
        data_service.symptom_severity = pd.DataFrame({
            'Symptom': ['fever', 'cough', 'headache'],
            'weight': [1, 2, 3]
        })
        data_service.get_disease_descriptions.return_value = {
            'Cold': 'Cold description'
        }
        data_service.get_disease_precautions.return_value = {
            'Cold': ['Rest', 'Hydrate']
        }
        return data_service
    
    @patch('joblib.load')
    def test_load_model_success(self, mock_load, mock_config, mock_data_service):
        """Test successful model loading"""
        mock_model = MagicMock()
        mock_load.return_value = mock_model
        
        prediction_service = PredictionService(mock_config, mock_data_service)
        
        assert prediction_service.model is not None
        mock_load.assert_called_once_with(mock_config.MODEL_PATH)

    def test_convert_symptoms_to_weights(self, mock_config, mock_data_service):
        """Test symptom to weight conversion"""
        with patch('joblib.load'):
            prediction_service = PredictionService(mock_config, mock_data_service)
            
            symptoms = ['fever', 'cough']
            weights = prediction_service._convert_symptoms_to_weights(symptoms)
            
            assert weights == [1, 2]

    def test_prepare_input_vector(self, mock_config, mock_data_service):
        """Test input vector preparation"""
        with patch('joblib.load'):
            prediction_service = PredictionService(mock_config, mock_data_service)
            
            symptoms = ['fever', 'cough']
            input_vector = prediction_service._prepare_input_vector(symptoms)
            
            assert len(input_vector) == 1
            assert len(input_vector[0]) == 17  # MAX_SYMPTOMS
            assert input_vector[0][:2] == [1, 2]  # First two weights
            assert all(w == 0 for w in input_vector[0][2:])  # Rest should be 0

    def test_predict_disease_success(self, mock_config, mock_data_service):
        """Test successful disease prediction"""
        with patch('joblib.load') as mock_load:
            mock_model = MagicMock()
            mock_model.predict.return_value = ['Cold']
            mock_load.return_value = mock_model
            
            prediction_service = PredictionService(mock_config, mock_data_service)
            
            result = prediction_service.predict_disease(['fever', 'cough'])
            
            assert result['disease'] == 'Cold'
            assert 'description' in result
            assert 'precautions' in result

    def test_predict_disease_validation_errors(self, mock_config, mock_data_service):
        """Test prediction validation errors"""
        with patch('joblib.load'):
            prediction_service = PredictionService(mock_config, mock_data_service)
            
            # Test empty symptoms
            with pytest.raises(ValueError):
                prediction_service.predict_disease([])
            
            # Test too many symptoms
            with pytest.raises(ValueError):
                prediction_service.predict_disease(['symptom'] * 20)
