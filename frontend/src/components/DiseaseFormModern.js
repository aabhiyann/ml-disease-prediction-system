import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../images/logo.png';
import apiService from '../services/apiService';
import Button from './ui/Button';
import Select from './ui/Select';
import Card, { CardContent, CardHeader } from './ui/Card';
import Modal, { ModalHeader, ModalContent, ModalFooter } from './ui/Modal';
import Alert, { AlertTitle, AlertDescription } from './ui/Alert';

const DiseaseFormModern = () => {
  const [symptoms, setSymptoms] = useState([{ id: 1, name: '' }]);
  const [symptomData, setSymptomData] = useState([]);
  const [disease, setDisease] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await apiService.checkHealth();
      setApiStatus('connected');
      
      const symptomsList = await apiService.getSymptoms();
      setSymptomData(symptomsList);
    } catch (error) {
      console.error('Initialization error:', error);
      setApiStatus('disconnected');
      setError('Unable to connect to the prediction service. Please try again later.');
    }
  };

  const handleSymptomChange = (symptomId, value) => {
    setSymptoms(prevSymptoms =>
      prevSymptoms.map(symptom =>
        symptom.id === symptomId ? { ...symptom, name: value } : symptom
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const selectedSymptoms = symptoms
      .filter(symptom => symptom.name !== '')
      .map(symptom => symptom.name);

    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom.');
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.predictDisease(selectedSymptoms);
      setDisease(result);
      setShowResultModal(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addSymptom = (e) => {
    e.preventDefault();
    const newId = Math.max(...symptoms.map(s => s.id)) + 1;
    setSymptoms([...symptoms, { id: newId, name: '' }]);
  };

  const removeSymptom = (symptomId) => {
    if (symptoms.length > 1) {
      setSymptoms(symptoms.filter(symptom => symptom.id !== symptomId));
    }
  };

  const formatSymptomName = (symptom) => {
    return symptom
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'connected':
        return (
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Connected</span>
          </div>
        );
      case 'disconnected':
        return (
          <div className="flex items-center space-x-2 text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium">Disconnected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 text-yellow-600">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Connecting...</span>
          </div>
        );
    }
  };

  if (apiStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Connecting to AI Service</h2>
          <p className="text-gray-500">Please wait while we initialize the prediction system...</p>
        </motion.div>
      </div>
    );
  }

  if (apiStatus === 'disconnected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="text-center">
            <CardContent className="py-12">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Unavailable</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={initializeApp} className="w-full">
                Retry Connection
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Main Layout */}
      <div className="min-h-screen bg-gradient-hero">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40"
        >
          <div className="container-custom py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={logo}
                  alt="MedicoAssist Logo"
                  className="h-12 w-auto"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">MedicoAssist</h1>
                  <p className="text-sm text-gray-500">AI-Powered Disease Prediction</p>
                </div>
              </div>
              {getStatusIcon()}
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-12"
            >
              <h1 className="text-responsive-xl font-bold text-gradient mb-6">
                AI Disease Prediction
              </h1>
              <p className="text-responsive-md text-gray-600 max-w-2xl mx-auto">
                Get instant, AI-powered disease predictions based on your symptoms. 
                Our advanced machine learning model provides accurate insights to help guide your healthcare decisions.
              </p>
            </motion.div>

            {/* Prediction Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-xl">
                <CardHeader>
                  <h2 className="text-2xl font-semibold text-gray-900">Symptom Analysis</h2>
                  <p className="text-gray-600">Select your symptoms to get an AI-powered prediction</p>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Symptoms List */}
                    <div className="space-y-4">
                      {symptoms.map((symptom, index) => (
                        <motion.div
                          key={symptom.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-end space-x-4"
                        >
                          <div className="flex-1">
                            <Select
                              label={`Symptom ${symptom.id}`}
                              value={symptom.name}
                              onChange={(e) => handleSymptomChange(symptom.id, e.target.value)}
                              icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              }
                            >
                              <option value="">Select a symptom...</option>
                              {symptomData.map((symptomName) => (
                                <option key={symptomName} value={symptomName}>
                                  {formatSymptomName(symptomName)}
                                </option>
                              ))}
                            </Select>
                          </div>
                          
                          {symptoms.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="md"
                              onClick={() => removeSymptom(symptom.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Add Symptom Button */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addSymptom}
                        className="w-full"
                        icon={
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        }
                      >
                        Add Another Symptom
                      </Button>
                    </motion.div>

                    {/* Error Alert */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Alert variant="error">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Button
                        type="submit"
                        loading={loading}
                        disabled={loading}
                        className="w-full"
                        size="lg"
                        icon={
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        }
                      >
                        {loading ? 'Analyzing Symptoms...' : 'Get AI Prediction'}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-16 grid md:grid-cols-3 gap-6"
            >
              <Card className="text-center hover:shadow-lg transition-shadow duration-200">
                <CardContent className="py-8">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">99.6% Accuracy</h3>
                  <p className="text-gray-600">Advanced ML model trained on thousands of medical records</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-200">
                <CardContent className="py-8">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
                  <p className="text-gray-600">Get predictions in seconds with detailed analysis</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-200">
                <CardContent className="py-8">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
                  <p className="text-gray-600">Your data is encrypted and never stored permanently</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <Modal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        size="lg"
      >
        <ModalHeader>
          <h2 className="text-2xl font-bold text-gray-900">Prediction Result</h2>
          <p className="text-gray-600">AI-powered disease analysis</p>
        </ModalHeader>
        
        <ModalContent>
          {disease && (
            <div className="space-y-6">
              {/* Disease Name */}
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Predicted Disease
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{disease.disease}</h3>
              </div>

              {/* Description */}
              {disease.description && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{disease.description}</p>
                </div>
              )}

              {/* Precautions */}
              {disease.precautions && disease.precautions.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Recommended Precautions</h4>
                  <ul className="space-y-2">
                    {disease.precautions.map((precaution, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{precaution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <Alert variant="warning">
                <AlertTitle>Important Disclaimer</AlertTitle>
                <AlertDescription>
                  This prediction is for informational purposes only and should not replace professional medical advice. 
                  Please consult with a qualified healthcare provider for proper diagnosis and treatment.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </ModalContent>
        
        <ModalFooter>
          <div className="flex space-x-3 w-full">
            <Button
              variant="outline"
              onClick={() => setShowResultModal(false)}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setShowResultModal(false);
                setDisease(null);
                setSymptoms([{ id: 1, name: '' }]);
              }}
              className="flex-1"
            >
              New Prediction
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DiseaseFormModern;
