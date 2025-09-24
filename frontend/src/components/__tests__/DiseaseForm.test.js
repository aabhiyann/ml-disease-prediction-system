/**
 * Tests for DiseaseForm component
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import DiseaseFormModern from "../DiseaseFormModern";
import apiService from "../../services/apiService";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    header: ({ children, ...props }) => <header {...props}>{children}</header>,
    section: ({ children, ...props }) => (
      <section {...props}>{children}</section>
    ),
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock the API service
jest.mock("../../services/apiService");

describe("DiseaseFormModern", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    // Mock API to never resolve
    apiService.checkHealth.mockImplementation(() => new Promise(() => {}));

    render(<DiseaseFormModern />);

    expect(screen.getByText("Connecting to AI Service")).toBeInTheDocument();
  });

  test("renders error state when API is unavailable", async () => {
    apiService.checkHealth.mockRejectedValue(new Error("Service unavailable"));

    render(<DiseaseFormModern />);

    await waitFor(() => {
      expect(screen.getByText("Service Unavailable")).toBeInTheDocument();
    });
  });

  test("renders form when API is available", async () => {
    apiService.checkHealth.mockResolvedValue({ status: "healthy" });
    apiService.getSymptoms.mockResolvedValue(["fever", "cough", "headache"]);

    render(<DiseaseFormModern />);

    await waitFor(() => {
      expect(screen.getByText("AI Disease Prediction")).toBeInTheDocument();
    });
  });

  test("adds new symptom when add button is clicked", async () => {
    apiService.checkHealth.mockResolvedValue({ status: "healthy" });
    apiService.getSymptoms.mockResolvedValue(["fever", "cough", "headache"]);

    render(<DiseaseFormModern />);

    await waitFor(() => {
      expect(screen.getByText("AI Disease Prediction")).toBeInTheDocument();
    });

    const addButton = screen.getByText("Add Another Symptom");
    fireEvent.click(addButton);

    expect(screen.getByText("Symptom 2")).toBeInTheDocument();
  });

  test("removes symptom when remove button is clicked", async () => {
    apiService.checkHealth.mockResolvedValue({ status: "healthy" });
    apiService.getSymptoms.mockResolvedValue(["fever", "cough", "headache"]);

    render(<DiseaseFormModern />);

    await waitFor(() => {
      expect(screen.getByText("AI Disease Prediction")).toBeInTheDocument();
    });

    // Add a second symptom
    const addButton = screen.getByText("Add Another Symptom");
    fireEvent.click(addButton);

    // Remove the second symptom
    const removeButton = screen.getByRole("button", {
      name: /Remove Symptom 2/i,
    });
    fireEvent.click(removeButton);

    expect(screen.queryByText("Symptom 2")).not.toBeInTheDocument();
  });

  test("shows error when no symptoms are selected", async () => {
    apiService.checkHealth.mockResolvedValue({ status: "healthy" });
    apiService.getSymptoms.mockResolvedValue(["fever", "cough", "headache"]);

    render(<DiseaseFormModern />);

    await waitFor(() => {
      expect(screen.getByText("AI Disease Prediction")).toBeInTheDocument();
    });

    const submitButton = screen.getByText("Get AI Prediction");
    fireEvent.click(submitButton);

    expect(
      screen.getByText("Please select at least one symptom.")
    ).toBeInTheDocument();
  });

  test("submits form with selected symptoms", async () => {
    apiService.checkHealth.mockResolvedValue({ status: "healthy" });
    apiService.getSymptoms.mockResolvedValue(["fever", "cough", "headache"]);
    apiService.predictDisease.mockResolvedValue({
      disease: "Common Cold",
      description: "A viral infection",
      precautions: ["Rest", "Stay hydrated"],
    });

    render(<DiseaseFormModern />);

    await waitFor(() => {
      expect(screen.getByText("AI Disease Prediction")).toBeInTheDocument();
    });

    // Select a symptom
    const symptomSelect = screen.getByDisplayValue("Select a symptom...");
    fireEvent.change(symptomSelect, { target: { value: "fever" } });

    // Submit form
    const submitButton = screen.getByText("Get AI Prediction");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(apiService.predictDisease).toHaveBeenCalledWith(["fever"]);
    });
  });

  test("displays prediction result in modal", async () => {
    apiService.checkHealth.mockResolvedValue({ status: "healthy" });
    apiService.getSymptoms.mockResolvedValue(["fever", "cough", "headache"]);
    apiService.predictDisease.mockResolvedValue({
      disease: "Common Cold",
      description: "A viral infection",
      precautions: ["Rest", "Stay hydrated"],
    });

    render(<DiseaseFormModern />);

    await waitFor(() => {
      expect(screen.getByText("AI Disease Prediction")).toBeInTheDocument();
    });

    // Select a symptom and submit
    const symptomSelect = screen.getByDisplayValue("Select a symptom...");
    fireEvent.change(symptomSelect, { target: { value: "fever" } });

    const submitButton = screen.getByText("Get AI Prediction");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Common Cold")).toBeInTheDocument();
      expect(screen.getByText("A viral infection")).toBeInTheDocument();
    });
  });
});
