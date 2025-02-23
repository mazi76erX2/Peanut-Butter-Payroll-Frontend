// __tests__/EmployeeManagement.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import EmployeeManagement from "../payroll/employeeinformation/newemployee/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';


// Create a fresh QueryClient for each test to avoid cache contamination
const createTestQueryClient = () => new QueryClient();

describe("EmployeeManagement Page", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test("shows loading spinner while fetching employees", async () => {
    // Delay response to simulate loading
    fetchMock.mockResponseOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ body: JSON.stringify([]) }), 1000),
        ),
    );

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <EmployeeManagement />
      </QueryClientProvider>,
    );

    // Check that the spinner is rendered
    expect(screen.getByRole("status")).toBeInTheDocument();

    // Wait for the fetch to finish
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });

  test("renders employee data after fetching", async () => {
    const employees = [
      {
        id: 1,
        employee_number: "12345",
        first_name: "John",
        last_name: "Doe",
        salutation: "Mr.",
        gender: "Male",
        gross_salary: "50000",
        profile_color: "Blue",
        full_name: "John Doe",
        created_at: "2025-02-22T00:00:00Z",
        updated_at: "2025-02-22T00:00:00Z",
      },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(employees));

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <EmployeeManagement />
      </QueryClientProvider>,
    );

    // Wait until the employee's first name is rendered
    await waitFor(() => screen.getByText("John"));
    expect(screen.getByText("John")).toBeInTheDocument();
  });

  test("displays an alert on backend error", async () => {
    // Set fetch to return an error for the list endpoint
    fetchMock.mockReject(new Error("Backend failure"));

    // Spy on window.alert
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <EmployeeManagement />
      </QueryClientProvider>,
    );

    // Wait for the error to trigger alert
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(expect.stringContaining("Error"));
    });

    alertMock.mockRestore();
  });

  test("updates form fields when a table row is clicked", async () => {
    // Prepare fake employee data.
    const fakeEmployees = [
      {
        id: 1,
        employee_number: "1001",
        first_name: "Test",
        last_name: "User",
        salutation: "Mr.",
        gender: "Male",
        gross_salary: "50000",
        profile_color: "Blue",
        full_name: "Test User",
        created_at: "2025-02-22T00:00:00Z",
        updated_at: "2025-02-22T00:00:00Z",
      },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(fakeEmployees));

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <EmployeeManagement />
      </QueryClientProvider>,
    );

    // Wait for employee data to be rendered.
    await waitFor(() => screen.getByText("Test"));

    // Click on the table row to select the employee.
    fireEvent.click(screen.getByText("1001"));

    // Now, check that the form fields are populated.
    expect(screen.getByDisplayValue("Test")).toBeInTheDocument();
    expect(screen.getByDisplayValue("User")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Mr.")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Blue")).toBeInTheDocument();
  });

  test("displays error toast on API error during form submission", async () => {
    // Mock successful fetch for initial employees.
    fetchMock.mockResponseOnce(JSON.stringify([]));

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <EmployeeManagement />
      </QueryClientProvider>,
    );

    // Wait for the page to load.
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    // Prepare a mock for POST that returns error.
    fetchMock.mockReject(new Error("Backend failure"));

    // Fill in the form fields.
    fireEvent.change(screen.getByLabelText(/First Name\(s\)/i), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Employee #/i), {
      target: { value: "2001" },
    });

    // Click the submit button.
    const submitButton = screen.getByRole("button", { name: /Add Employee/i });
    fireEvent.click(submitButton);

    // Wait for the error toast to be called.
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("Backend failure"),
      );
    });
  });
});
