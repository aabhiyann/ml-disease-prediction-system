import React, { useState, useEffect } from "react";
import logo from "../images/logo.png";
import apiService from "../services/apiService";

export default function DiseaseForm() {
  const [symptoms, setSymptoms] = useState([{ id: 1, name: "" }]);
  const [symptomData, setSymptomData] = useState([]);
  const [disease, setDisease] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check API health first
      await apiService.checkHealth();
      setApiStatus("connected");
      
      // Load symptoms
      const symptomsList = await apiService.getSymptoms();
      setSymptomData(symptomsList);
    } catch (error) {
      console.error("Initialization error:", error);
      setApiStatus("disconnected");
      setError("Unable to connect to the prediction service. Please try again later.");
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
      .filter(symptom => symptom.name !== "")
      .map(symptom => symptom.name);

    if (selectedSymptoms.length === 0) {
      setError("Please select at least one symptom.");
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.predictDisease(selectedSymptoms);
      setDisease(result);
      openModal("modal");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addSymptom = (e) => {
    e.preventDefault();
    const newId = Math.max(...symptoms.map(s => s.id)) + 1;
    setSymptoms([...symptoms, { id: newId, name: "" }]);
  };

  const removeSymptom = (symptomId) => {
    if (symptoms.length > 1) {
      setSymptoms(symptoms.filter(symptom => symptom.id !== symptomId));
    }
  };

  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.showModal();
      document.body.style.overflow = "hidden";
      const modalContent = modal.children[0];
      modalContent.scrollTop = 0;
      modalContent.classList.remove("opacity-0");
      modalContent.classList.add("opacity-100");
    }
  };

  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      const modalContent = modal.children[0];
      modalContent.classList.remove("opacity-100");
      modalContent.classList.add("opacity-0");
      setTimeout(() => {
        modal.close();
        document.body.style.overflow = "auto";
      }, 100);
    }
  };

  const formatSymptomName = (symptom) => {
    return symptom
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (apiStatus === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-100 via-green-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to prediction service...</p>
        </div>
      </div>
    );
  }

  if (apiStatus === "disconnected") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-100 via-green-100">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Service Unavailable</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={initializeApp}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Prediction Result Modal */}
      <dialog id="modal" className="bg-transparent z-0 relative w-screen h-screen">
        <div className="p-6 flex justify-center items-center fixed left-0 top-0 w-full h-full bg-gray-900 bg-opacity-50 z-50 transition-opacity duration-300 opacity-0">
          <div className="bg-white rounded-lg md:w-2/3 lg:w-1/2 relative max-h-[90vh] overflow-y-auto">
            <div>
              <div className="px-7 pt-6 pb-2 grid grid-cols-2">
                <h1 className="font-semibold text-left">Prediction Result</h1>
                <button
                  onClick={() => closeModal("modal")}
                  className="w-5 ml-auto cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              {disease && (
                <div className="overflow-y-auto mx-7 pb-6">
                  <div className="text-center my-4">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                      Predicted Disease
                    </h2>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h3 className="text-xl font-bold text-green-800">
                        {disease.disease}
                      </h3>
                    </div>
                  </div>
                  
                  {disease.description && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Description:</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {disease.description}
                      </p>
                    </div>
                  )}
                  
                  {disease.precautions && disease.precautions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Precautions:</h4>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                        {disease.precautions.map((precaution, index) => (
                          <li key={index}>{precaution}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      <strong>Disclaimer:</strong> This prediction is for informational purposes only. 
                      Please consult with a healthcare professional for proper medical advice.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </dialog>

      {/* Main Form */}
      <div className="min-w-full w-full h-screen bg-gradient-to-b from-green-100 via-green-100">
        <div className="relative h-4/5 w-full flex justify-center">
          <div className="w-4/5 lg:w-1/3 my-auto">
            <div className="mx-auto">
              <div className="md:grid md:gap-6">
                <a href="/">
                  <img
                    src={logo}
                    alt="MedicoAssist Logo"
                    className="h-24 filter drop-shadow hover:drop-shadow-lg mx-auto mt-8"
                  />
                </a>
                <h1 className="text-3xl sm:text-4xl bg-clip-text text-transparent font-bold bg-gradient-to-r from-green-800 to-green-500 text-center">
                  DISEASE PREDICTION
                </h1>
                
                {/* API Status Indicator */}
                <div className="text-center mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>
                    Service Connected
                  </span>
                </div>

                <div className="my-5 mb-4 shadow-xl">
                  <form onSubmit={handleSubmit}>
                    <div className="shadow overflow-hidden sm:rounded-md">
                      <div className="px-4 pt-5 bg-white sm:px-6 sm:pt-6">
                        <div className="grid gap-y-7">
                          {symptoms.map((symptom) => (
                            <div key={symptom.id} className="col-span-8 md:col-span-12">
                              <div className="flex items-center justify-between">
                                <label
                                  htmlFor={`symptom-${symptom.id}`}
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Symptom {symptom.id}
                                </label>
                                {symptoms.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeSymptom(symptom.id)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                              <select
                                id={`symptom-${symptom.id}`}
                                name={`symptom-${symptom.id}`}
                                value={symptom.name}
                                onChange={(e) => handleSymptomChange(symptom.id, e.target.value)}
                                className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                              >
                                <option value="">Select a symptom...</option>
                                {symptomData.map((symptomName) => (
                                  <option key={symptomName} value={symptomName}>
                                    {formatSymptomName(symptomName)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                          
                          <div className="col-span-8 md:col-span-12">
                            <button
                              type="button"
                              onClick={addSymptom}
                              className="border-2 py-2 mb-6 w-full border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            >
                              + Add Another Symptom
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        {error && (
                          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                          </div>
                        )}
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex justify-center w-full mb-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <svg
                                className="animate-spin ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Analyzing...
                            </>
                          ) : (
                            "Predict Disease"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
