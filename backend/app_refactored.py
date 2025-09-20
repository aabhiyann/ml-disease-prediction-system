"""
ML Disease Prediction API - Refactored Version
A Flask-based API for predicting diseases based on symptoms using machine learning.
"""
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from config import config
from services.data_service import DataService
from services.prediction_service import PredictionService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app(config_name='default'):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Enable CORS
    CORS(app)
    
    # Initialize services
    try:
        data_service = DataService(app.config)
        prediction_service = PredictionService(app.config, data_service)
        logger.info("Services initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize services: {str(e)}")
        raise
    
    @app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            "status": "healthy",
            "message": "ML Disease Prediction API is running"
        }), 200
    
    @app.route('/symptoms', methods=['GET'])
    def get_symptoms():
        """Get list of all available symptoms"""
        try:
            symptoms = data_service.get_symptoms_list()
            return jsonify({
                "symptoms": symptoms,
                "count": len(symptoms)
            }), 200
        except Exception as e:
            logger.error(f"Error getting symptoms: {str(e)}")
            return jsonify({
                "error": "Failed to retrieve symptoms",
                "message": str(e)
            }), 500
    
    @app.route('/predict', methods=['POST'])
    def predict_disease():
        """Predict disease based on symptoms"""
        try:
            # Validate request
            if not request.is_json:
                return jsonify({
                    "error": "Content-Type must be application/json"
                }), 400
            
            data = request.get_json()
            
            if not data or 'symptoms' not in data:
                return jsonify({
                    "error": "Missing 'symptoms' field in request body"
                }), 400
            
            symptoms = data['symptoms']
            
            if not isinstance(symptoms, list):
                return jsonify({
                    "error": "Symptoms must be a list"
                }), 400
            
            if len(symptoms) == 0:
                return jsonify({
                    "error": "At least one symptom is required"
                }), 400
            
            # Make prediction
            result = prediction_service.predict_disease(symptoms)
            
            return jsonify(result), 200
            
        except ValueError as e:
            logger.warning(f"Validation error: {str(e)}")
            return jsonify({
                "error": "Invalid input",
                "message": str(e)
            }), 400
        except Exception as e:
            logger.error(f"Error in prediction: {str(e)}")
            return jsonify({
                "error": "Internal server error",
                "message": "An error occurred while processing your request"
            }), 500
    
    @app.route('/diseases', methods=['GET'])
    def get_diseases():
        """Get list of all diseases that can be predicted"""
        try:
            diseases = data_service.df['Disease'].unique().tolist()
            return jsonify({
                "diseases": diseases,
                "count": len(diseases)
            }), 200
        except Exception as e:
            logger.error(f"Error getting diseases: {str(e)}")
            return jsonify({
                "error": "Failed to retrieve diseases",
                "message": str(e)
            }), 500
    
    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 errors"""
        return jsonify({
            "error": "Endpoint not found",
            "message": "The requested endpoint does not exist"
        }), 404
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        """Handle 405 errors"""
        return jsonify({
            "error": "Method not allowed",
            "message": "The HTTP method is not allowed for this endpoint"
        }), 405
    
    @app.errorhandler(500)
    def internal_error(error):
        """Handle 500 errors"""
        logger.error(f"Internal server error: {str(error)}")
        return jsonify({
            "error": "Internal server error",
            "message": "An unexpected error occurred"
        }), 500
    
    return app

if __name__ == '__main__':
    app = create_app('development')
    app.run(debug=app.config['DEBUG'], host='0.0.0.0', port=5000)
