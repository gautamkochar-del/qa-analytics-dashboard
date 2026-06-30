import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SnackbarProvider, useAppSnackbar } from "./SnackbarContext";

const TestingComponent = () => {
  const { snackbar, showSnackbar, closeSnackbar } = useAppSnackbar();

  return (
    <div>
      <div data-testid="msg">{snackbar.message || "none"}</div>
      <div data-testid="open">{snackbar.open ? "true" : "false"}</div>
      <div data-testid="severity">{snackbar.severity}</div>
      <button onClick={() => showSnackbar("Success message", "success")}>
        Show Success
      </button>
      <button onClick={closeSnackbar}>Close</button>
    </div>
  );
};

describe("Snackbar Context Tests", () => {
  it("should initialize with closed snackbar state", () => {
    render(
      <SnackbarProvider>
        <TestingComponent />
      </SnackbarProvider>
    );

    expect(screen.getByTestId("open").textContent).toBe("false");
    expect(screen.getByTestId("msg").textContent).toBe("none");
  });

  it("should open snackbar with correct text and severity", () => {
    render(
      <SnackbarProvider>
        <TestingComponent />
      </SnackbarProvider>
    );

    fireEvent.click(screen.getByText("Show Success"));

    expect(screen.getByTestId("open").textContent).toBe("true");
    expect(screen.getByTestId("msg").textContent).toBe("Success message");
    expect(screen.getByTestId("severity").textContent).toBe("success");
  });

  it("should close snackbar on close action", () => {
    render(
      <SnackbarProvider>
        <TestingComponent />
      </SnackbarProvider>
    );

    fireEvent.click(screen.getByText("Show Success"));
    fireEvent.click(screen.getByText("Close"));

    expect(screen.getByTestId("open").textContent).toBe("false");
  });
});
