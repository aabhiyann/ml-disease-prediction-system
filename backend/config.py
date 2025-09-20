"""
Configuration settings for the ML Disease Prediction API
"""
import os

class Config:
    """Base configuration class"""
    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Model paths
    MODEL_PATH = './model/random_forest.joblib'
    DATASET_PATH = './datasets/dataset.csv'
    SYMPTOM_SEVERITY_PATH = './datasets/Symptom-severity.csv'
    DESCRIPTION_PATH = './datasets/symptom_Description.csv'
    PRECAUTION_PATH = './datasets/symptom_precaution.csv'
    
    # API settings
    MAX_SYMPTOMS = 17
    MIN_SYMPTOMS = 1

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
