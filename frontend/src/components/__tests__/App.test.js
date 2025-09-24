import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../../App";

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

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

describe("App", () => {
  test("renders without crashing", () => {
    render(<App />);
    // Assert the hero heading appears by first line
    expect(screen.getByText(/AI Disease/i)).toBeInTheDocument();
    // Be robust to multiple matches for "Prediction" by selecting all
    expect(screen.getAllByText(/Prediction/i).length).toBeGreaterThan(0);
  });
});
