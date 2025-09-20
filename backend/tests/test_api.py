"""
API tests for the ML Disease Prediction system
"""
import pytest
import json
from unittest.mock import patch, MagicMock
from app_refactored import create_app

@pytest.fixture
def app():
    """Create test app instance"""
    app = create_app('development')
    app.config['TESTING'] = True
    return app

@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()

class TestHealthEndpoint:
    """Test health check endpoint"""
    
    def test_health_check(self, client):
        """Test health check returns 200"""
        response = client.get('/health')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'healthy'

class TestSymptomsEndpoint:
    """Test symptoms endpoint"""
    
    @patch('services.data_service.DataService')
    def test_get_symptoms_success(self, mock_data_service, client):
        """Test successful symptoms retrieval"""
        mock_data_service.return_value.get_symptoms_list.return_value = [
            'fever', 'headache', 'cough'
        ]
        
        response = client.get('/symptoms')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'symptoms' in data
        assert 'count' in data
        assert data['count'] == 3

class TestPredictionEndpoint:
    """Test prediction endpoint"""
    
    @patch('services.prediction_service.PredictionService')
    def test_predict_disease_success(self, mock_prediction_service, client):
        """Test successful disease prediction"""
        mock_prediction_service.return_value.predict_disease.return_value = {
            'disease': 'Common Cold',
            'description': 'A viral infection...',
            'precautions': ['Rest', 'Stay hydrated']
        }
        
        response = client.post('/predict', 
            data=json.dumps({'symptoms': ['fever', 'cough']}),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['disease'] == 'Common Cold'
        assert 'description' in data
        assert 'precautions' in data

    def test_predict_disease_no_symptoms(self, client):
        """Test prediction with no symptoms"""
        response = client.post('/predict',
            data=json.dumps({'symptoms': []}),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data

    def test_predict_disease_invalid_json(self, client):
        """Test prediction with invalid JSON"""
        response = client.post('/predict',
            data='invalid json',
            content_type='application/json'
        )
        
        assert response.status_code == 400

    def test_predict_disease_missing_symptoms(self, client):
        """Test prediction with missing symptoms field"""
        response = client.post('/predict',
            data=json.dumps({'other_field': 'value'}),
            content_type='application/json'
        )
        
        assert response.status_code == 400

class TestErrorHandling:
    """Test error handling"""
    
    def test_404_error(self, client):
        """Test 404 error handling"""
        response = client.get('/nonexistent')
        assert response.status_code == 404
        data = json.loads(response.data)
        assert 'error' in data

    def test_405_error(self, client):
        """Test 405 error handling"""
        response = client.get('/predict')  # GET not allowed
        assert response.status_code == 405
        data = json.loads(response.data)
        assert 'error' in data
