import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmployeeManagement from "../payroll/employeeinformation/newemployee/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import '@testing-library/jest-dom';

// Mock Sonner's toast and Toaster components
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  Toaster: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const createTestQueryClient = () => new QueryClient();

describe("EmployeeManagement Integration Test", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  test("integration: seed backend, display data, update employee, and reflect changes", async () => {
    // Simulate seeded employee data from the backend.
    const seededEmployees = [
      {
        id: 1,
        employee_number: "3001",
        first_name: "Alice",
        last_name: "Smith",
        salutation: "Ms.",
        gender: "Female",
        gross_salary: "60000",
        profile_color: "Green",
        full_name: "Alice Smith",
        created_at: "2025-02-22T00:00:00Z",
        updated_at: "2025-02-22T00:00:00Z",
      },
    ];

    // First fetch call returns seeded data.
    fetchMock.mockResponseOnce(JSON.stringify(seededEmployees));

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <EmployeeManagement />
      </QueryClientProvider>,
    );

    // Verify that seeded employee is displayed.
    await waitFor(() => screen.getByText("Alice"));
    expect(screen.getByText("Alice")).toBeInTheDocument();

    // Simulate user updating the employee by changing the first name.
    fireEvent.change(screen.getByLabelText(/First Name\(s\)/i), {
      target: { value: "Alicia" },
    });
    // Prepare updated employee data.
    const updatedEmployee = {
      ...seededEmployees[0],
      first_name: "Alicia",
      full_name: "Alicia Smith",
    };

    // Next call (PUT request) returns updated employee.
    fetchMock.mockResponseOnce(JSON.stringify(updatedEmployee));

    // Click the "Update Employee" button.
    const submitButton = screen.getByRole("button", {
      name: /Update Employee/i,
    });
    fireEvent.click(submitButton);

    // Wait for success toast.
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Employee updated successfully!",
      );
    });

    // Next, simulate re-fetching employees with updated data.
    fetchMock.mockResponseOnce(JSON.stringify([updatedEmployee]));
    await waitFor(() => screen.getByText("Alicia"));
    expect(screen.getByText("Alicia")).toBeInTheDocument();
  });
});
