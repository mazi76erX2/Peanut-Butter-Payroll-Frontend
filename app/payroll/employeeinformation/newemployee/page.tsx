"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import EmployeeTable, { Employee } from "../../../components/EmployeeTable";
import EmployeeForm, { EmployeeFormData } from "../../../components/EmployeeForm";
import { toast, Toaster } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchEmployees(): Promise<any[]> {
  const res = await fetch(`${API_URL}/api/employees/?page=1&page_size=100`);
  if (!res.ok) throw new Error("Failed to fetch employees");
  return res.json();
}

// Helper to convert snake_case keys from API to camelCase.
function snakeToCamel(obj: Record<string, any>): Record<string, any> {
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    newObj[camelKey] = obj[key];
  }
  return newObj;
}

// Helper to convert camelCase keys to snake_case keys for backend submission.
function camelToSnake(obj: Record<string, any>): Record<string, any> {
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => "_" + letter.toLowerCase());
    newObj[snakeKey] = obj[key];
  }
  return newObj;
}

export default function EmployeeManagement() {
  const initialFormData: EmployeeFormData = {
    employeeNumber: "",
    firstName: "",
    lastName: "",
    fullName: "",
    salutation: "",
    gender: "Unspecified",
    grossSalary: "",
    profileColor: "Default",
  };

  const {
    data: employees,
    isLoading,
    error,
    refetch,
  } = useQuery<EmployeeFormData[]>({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeFormData>({ ...initialFormData });

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : error}`);
    }
  }, [error]);

  // Called when the form is submitted.
  const handleFormSubmit = async (data: EmployeeFormData) => {
    const submissionData = {
      ...data,
      employeeNumber: parseInt(data.employeeNumber, 10),
      grossSalary: data.grossSalary.replace(/\s/g, ""),
    };
    const payload = camelToSnake(submissionData);
    try {
      let res;
      if (payload.id) {
        res = await fetch(`${API_URL}/api/employees/${payload.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_URL}/api/employees/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Operation failed");
      }
      await refetch();
      setSelectedEmployee({ ...initialFormData });
      if (submissionData.id) {
        toast.success("Employee updated successfully!");
      } else {
        toast.success("Employee added successfully!");
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
      console.error(err);
    }
  };

  // Load a table row's data into the form.
  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(snakeToCamel(employee) as EmployeeFormData);
  };

  // Handle the "Add Employee" button in the table.
  // If the employee already exists (has an ID), display an error toast.
  // Otherwise, convert the data and call the create endpoint.
  const handleDirectAdd = async (employee: Employee | null) => {
    if (!employee) {
      toast.error("Please select an employee from the table to add.");
      return;
    }
    const employeeData = snakeToCamel(employee) as EmployeeFormData;
    if (employeeData.id) {
      toast.error("Employee already exists in the database.");
      return;
    }
    const submissionData = {
      ...employeeData,
      employeeNumber: parseInt(employeeData.employeeNumber, 10),
      grossSalary: employeeData.grossSalary.replace(/\s/g, ""),
    };
    const payload = camelToSnake(submissionData);
    try {
      const res = await fetch(`${API_URL}/api/employees/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to add employee");
      }
      await refetch();
      setSelectedEmployee({ ...initialFormData });
      toast.success("Employee added successfully!");
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  // Clear the form
  const handleCancel = () => {
    setSelectedEmployee({ ...initialFormData });
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Peanut Butter Payroll
        </h1>
        <div className="mb-8 flex justify-center">
          <img src="/illustration.svg" alt="Illustration" className="w-1/2 max-w-md" />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div
              className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"
              role="status"
            ></div>
          </div>
        ) : (
          <>
            <EmployeeTable
              employees={employees ?? []}
              onSelect={handleSelectEmployee}
              onAdd={handleDirectAdd}
            />
            <div className="mt-8">
              <EmployeeForm
                key={selectedEmployee.id ?? "new"}
                initialData={selectedEmployee}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
                isUpdate={!!selectedEmployee.employeeNumber}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
