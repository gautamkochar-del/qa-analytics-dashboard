import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import api from "../api/axios";

// Mock API module
vi.mock("../api/axios", () => {
  return {
    default: {
      get: vi.fn(), post: vi.fn(), interceptors: {
        request: { use: vi.fn() }, }, }, };
});

const TestingComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <div>
      <div data-testid="auth">{isAuthenticated ? "true" : "false"}</div>
      <div data-testid="username">{user?.name || "none"}</div>
      <button onClick={() => login("admin@company.com", "password123")}>
        Login Box
      </button>
      <button onClick={logout}>Logout Box</button>
    </div>
  );
};

describe("AuthContext Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should initialize as unauthenticated when token not present", async () => {
    api.get.mockRejectedValueOnce(new Error("No Token"));

    render(
      <AuthProvider>
        <TestingComponent />
      </AuthProvider>
    );

    // Initial load screen wait
    await waitFor(() => {
      expect(screen.getByTestId("auth").textContent).toBe("false");
    });
  });

  it("should mutate context user state on successful login request", async () => {
    api.post.mockResolvedValueOnce({
      data: {
        id: 1, name: "Admin User", email: "admin@company.com", role: "Admin", token: "fake-jwt-token-xyz", }, });

    render(
      <AuthProvider>
        <TestingComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("Login Box"));

    await waitFor(() => {
      expect(screen.getByTestId("auth").textContent).toBe("true");
      expect(screen.getByTestId("username").textContent).toBe("Admin User");
      expect(localStorage.getItem("qa_dash_token")).toBe("fake-jwt-token-xyz");
    });
  });

  it("should remove user profile on logout trigger", async () => {
    api.post.mockResolvedValueOnce({
      data: {
        id: 1, name: "Admin User", email: "admin@company.com", role: "Admin", token: "fake-jwt-token-xyz", }, });

    render(
      <AuthProvider>
        <TestingComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("Login Box"));
    
    await waitFor(() => {
      expect(screen.getByTestId("auth").textContent).toBe("true");
    });

    fireEvent.click(screen.getByText("Logout Box"));

    expect(screen.getByTestId("auth").textContent).toBe("false");
    expect(screen.getByTestId("username").textContent).toBe("none");
    expect(localStorage.getItem("qa_dash_token")).toBeNull();
  });
});
