"""
Data service for loading and preprocessing medical datasets
"""
import pandas as pd
import numpy as np
from typing import List, Dict, Tuple
import logging

logger = logging.getLogger(__name__)

class DataService:
    """Service class for handling medical data operations"""
    
    def __init__(self, config):
        self.config = config
        self.df = None
        self.symptom_severity = None
        self.descriptions = None
        self.precaution = None
        self.symptoms_list = None
        self._load_data()
    
    def _load_data(self):
        """Load all required datasets"""
        try:
            # Load main dataset
            self.df = pd.read_csv(self.config.DATASET_PATH)
            self.symptom_severity = pd.read_csv(self.config.SYMPTOM_SEVERITY_PATH)
            self.descriptions = pd.read_csv(self.config.DESCRIPTION_PATH)
            self.precaution = pd.read_csv(self.config.PRECAUTION_PATH)
            
            # Preprocess data
            self._preprocess_data()
            
            # Get symptoms list
            self.symptoms_list = self.symptom_severity['Symptom'].unique().tolist()
            
            logger.info(f"Successfully loaded data: {len(self.df)} records, {len(self.symptoms_list)} symptoms")
            
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")
            raise
    
    def _preprocess_data(self):
        """Preprocess the main dataset"""
        try:
            # Remove hyphens and strip whitespace
            cols = self.df.columns
            data = self.df[cols].values.flatten()
            
            s = pd.Series(data)
            s = s.str.strip()
            s = s.values.reshape(self.df.shape)
            
            self.df = pd.DataFrame(s, columns=self.df.columns)
            self.df = self.df.fillna(0)
            
            # Convert symptoms to weights
            vals = self.df.values
            symptoms = self.symptom_severity['Symptom'].unique()
            
            for i in range(len(symptoms)):
                vals[vals == symptoms[i]] = self.symptom_severity[
                    self.symptom_severity['Symptom'] == symptoms[i]
                ]['weight'].values[0]
            
            d = pd.DataFrame(vals, columns=cols)
            
            # Handle special cases
            d = d.replace('dischromic _patches', 0)
            d = d.replace('spotting_ urination', 0)
            d = d.replace('foul_smell_of urine', 0)
            
            self.df = d
            
            logger.info("Data preprocessing completed successfully")
            
        except Exception as e:
            logger.error(f"Error preprocessing data: {str(e)}")
            raise
    
    def get_symptoms_list(self) -> List[str]:
        """Get list of all available symptoms"""
        return self.symptoms_list
    
    def get_disease_descriptions(self) -> Dict[str, str]:
        """Get disease descriptions mapping"""
        return dict(zip(self.descriptions['Disease'], self.descriptions['Description']))
    
    def get_disease_precautions(self) -> Dict[str, List[str]]:
        """Get disease precautions mapping"""
        precautions_dict = {}
        for _, row in self.precaution.iterrows():
            disease = row['Disease']
            precautions = []
            for col in self.precaution.columns[1:]:  # Skip Disease column
                if pd.notna(row[col]):
                    precautions.append(row[col])
            precautions_dict[disease] = precautions
        return precautions_dict
