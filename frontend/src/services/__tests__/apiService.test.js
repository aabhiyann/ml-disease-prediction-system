/**
 * Tests for API service
 */
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";

// Mock axios
jest.mock("axios");
let apiService;

describe("apiService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Import after resetting mocks
    // eslint-disable-next-line global-require
    apiService = require("../apiService").default;
  });

  describe("checkHealth", () => {
    test("returns health data on successful request", async () => {
      const mockResponse = { data: { status: "healthy" } };
      axios.get.mockResolvedValue(mockResponse);

      const result = await apiService.checkHealth();

      expect(axios.get).toHaveBeenCalledWith(API_ENDPOINTS.HEALTH, expect.any(Object));
      expect(result).toEqual({ status: "healthy" });
    });

    test("throws error on failed request", async () => {
      const mockError = new Error("Network error");
      axios.get.mockRejectedValue(mockError);

      await expect(apiService.checkHealth()).rejects.toThrow(
        "Health check failed: Network error"
      );
    });
  });

  describe("getSymptoms", () => {
    test("returns symptoms list on successful request", async () => {
      const mockResponse = { data: { symptoms: ["fever", "cough", "headache"] } };
      axios.get.mockResolvedValue(mockResponse);

      const result = await apiService.getSymptoms();

      expect(axios.get).toHaveBeenCalledWith(API_ENDPOINTS.SYMPTOMS, expect.any(Object));
      expect(result).toEqual(["fever", "cough", "headache"]);
    });

    test("throws error on failed request", async () => {
      const mockError = new Error("Server error");
      axios.get.mockRejectedValue(mockError);

      await expect(apiService.getSymptoms()).rejects.toThrow(
        "Failed to fetch symptoms: Server error"
      );
    });
  });

  describe("getDiseases", () => {
    test("returns diseases list on successful request", async () => {
      const mockResponse = { data: { diseases: ["Cold", "Flu", "Fever"] } };
      axios.get.mockResolvedValue(mockResponse);

      const result = await apiService.getDiseases();

      expect(axios.get).toHaveBeenCalledWith(API_ENDPOINTS.DISEASES, expect.any(Object));
      expect(result).toEqual(["Cold", "Flu", "Fever"]);
    });

    test("throws error on failed request", async () => {
      const mockError = new Error("Server error");
      axios.get.mockRejectedValue(mockError);

      await expect(apiService.getDiseases()).rejects.toThrow(
        "Failed to fetch diseases: Server error"
      );
    });
  });

  describe("predictDisease", () => {
    test("returns prediction result on successful request", async () => {
      const mockResponse = {
        data: {
          disease: "Common Cold",
          description: "A viral infection",
          precautions: ["Rest", "Stay hydrated"],
        },
      };
      axios.post.mockResolvedValue(mockResponse);

      const symptoms = ["fever", "cough"];
      const result = await apiService.predictDisease(symptoms);

      expect(axios.post).toHaveBeenCalledWith(
        API_ENDPOINTS.PREDICT,
        { symptoms: symptoms },
        expect.any(Object)
      );
      expect(result).toEqual({
        disease: "Common Cold",
        description: "A viral infection",
        precautions: ["Rest", "Stay hydrated"],
      });
    });

    test("throws error with server error message", async () => {
      const mockError = {
        response: {
          data: { error: "Invalid symptoms provided" },
        },
      };
      axios.post.mockRejectedValue(mockError);

      await expect(apiService.predictDisease(["invalid"])).rejects.toThrow(
        "Invalid symptoms provided"
      );
    });

    test("throws generic error on network failure", async () => {
      const mockError = new Error("Network error");
      axios.post.mockRejectedValue(mockError);

      await expect(apiService.predictDisease(["fever"])).rejects.toThrow(
        "Prediction failed: Network error"
      );
    });
  });
});
