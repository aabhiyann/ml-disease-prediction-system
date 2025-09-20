"""
Prediction service for disease prediction using ML models
"""
import numpy as np
from joblib import load
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class PredictionService:
    """Service class for disease prediction operations"""
    
    def __init__(self, config, data_service):
        self.config = config
        self.data_service = data_service
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Load the trained ML model"""
        try:
            self.model = load(self.config.MODEL_PATH)
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise
    
    def _convert_symptoms_to_weights(self, symptoms: List[str]) -> List[float]:
        """Convert symptom names to their corresponding weights"""
        try:
            symptom_weights = dict(zip(
                self.data_service.symptom_severity['Symptom'],
                self.data_service.symptom_severity['weight']
            ))
            
            weights = []
            for symptom in symptoms:
                weight = symptom_weights.get(symptom, 0)
                weights.append(weight)
            
            return weights
        except Exception as e:
            logger.error(f"Error converting symptoms to weights: {str(e)}")
            raise
    
    def _prepare_input_vector(self, symptoms: List[str]) -> List[List[float]]:
        """Prepare input vector for model prediction"""
        try:
            # Convert symptoms to weights
            weights = self._convert_symptoms_to_weights(symptoms)
            
            # Pad to required length
            while len(weights) < self.config.MAX_SYMPTOMS:
                weights.append(0)
            
            # Truncate if too many symptoms
            weights = weights[:self.config.MAX_SYMPTOMS]
            
            return [weights]
        except Exception as e:
            logger.error(f"Error preparing input vector: {str(e)}")
            raise
    
    def predict_disease(self, symptoms: List[str]) -> Dict[str, any]:
        """
        Predict disease based on symptoms
        
        Args:
            symptoms: List of symptom names
            
        Returns:
            Dictionary containing disease, description, and precautions
        """
        try:
            # Validate input
            if not symptoms or len(symptoms) < self.config.MIN_SYMPTOMS:
                raise ValueError(f"At least {self.config.MIN_SYMPTOMS} symptom required")
            
            if len(symptoms) > self.config.MAX_SYMPTOMS:
                raise ValueError(f"Maximum {self.config.MAX_SYMPTOMS} symptoms allowed")
            
            # Prepare input
            input_vector = self._prepare_input_vector(symptoms)
            
            # Make prediction
            prediction = self.model.predict(input_vector)
            disease = prediction[0]
            
            # Get additional information
            descriptions = self.data_service.get_disease_descriptions()
            precautions = self.data_service.get_disease_precautions()
            
            result = {
                "disease": disease,
                "description": descriptions.get(disease, "Description not available"),
                "precautions": precautions.get(disease, [])
            }
            
            logger.info(f"Prediction successful: {disease}")
            return result
            
        except Exception as e:
            logger.error(f"Error in disease prediction: {str(e)}")
            raise
