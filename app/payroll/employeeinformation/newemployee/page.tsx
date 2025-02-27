"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import EmployeeTable, { Employee } from "../../../components/EmployeeTable";
import EmployeeForm, {
  EmployeeFormData,
} from "../../../components/EmployeeForm";
import { toast, Toaster } from "sonner";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface ApiEmployee {
  id?: number;
  employee_number: string;
  first_name: string;
  last_name: string;
  salutation: string;
  gender?: string;
  gross_salary: string;
  profile_color: string;
  full_name: string;
  created_at?: string;
  updated_at?: string;
}


async function fetchEmployees(): Promise<ApiEmployee[]> {
  const res = await fetch(`${API_URL}/api/employees/?page=1&page_size=100`);
  if (!res.ok) throw new Error("Failed to fetch employees");
  return (await res.json()) as ApiEmployee[];
}


function snakeToCamel(obj: unknown): Record<string, unknown> {
  if (typeof obj !== "object" || obj === null) return {};
  const record = obj as Record<string, unknown>;
  const newObj: Record<string, unknown> = {};
  for (const key in record) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase(),
    );
    newObj[camelKey] = record[key];
  }
  return newObj;
}

function camelToSnake(obj: unknown): Record<string, unknown> {
  if (typeof obj !== "object" || obj === null) return {};
  const record = obj as Record<string, unknown>;
  const newObj: Record<string, unknown> = {};
  for (const key in record) {
    const snakeKey = key.replace(
      /[A-Z]/g,
      (letter) => "_" + letter.toLowerCase(),
    );
    newObj[snakeKey] = record[key];
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

  // Fetch employees as ApiEmployee[]
  const {
    data: employees,
    isLoading,
    error,
    refetch,
  } = useQuery<ApiEmployee[]>({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  // selectedEmployee is used for the form (camelCase)
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeFormData>({
    ...initialFormData,
  });

  useEffect(() => {
    if (error) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  }, [error]);

  // Called when the form is submitted.
  const handleFormSubmit = async (data: EmployeeFormData): Promise<void> => {
    const submissionData = {
      ...data,
      employeeNumber: parseInt(data.employeeNumber, 10),
      grossSalary: data.grossSalary.replace(/\s/g, ""),
    };
    const payload = camelToSnake(submissionData) as { id?: number };
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
        throw new Error((errData.detail as string) || "Operation failed");
      }
      await refetch();
      setSelectedEmployee({ ...initialFormData });
      if (submissionData.id) {
        toast.success("Employee updated successfully!");
      } else {
        toast.success("Employee added successfully!");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(`Error: ${err.message}`);
        console.error(err);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  // Load a table row's data into the form by converting from snake_case to camelCase.
  const handleSelectEmployee = (employee: Employee): void => {
    // employee here is in snake_case (same as ApiEmployee)
    setSelectedEmployee(snakeToCamel(employee) as unknown as EmployeeFormData);
  };

  // Handle the "Add Employee" button in the table.
  const handleDirectAdd = async (employee: Employee | null): Promise<void> => {
    if (!employee) {
      toast.error("Please select an employee from the table to add.");
      return;
    }
    const employeeData = snakeToCamel(employee) as unknown as EmployeeFormData;
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
        throw new Error((errData.detail as string) || "Failed to add employee");
      }
      await refetch();
      setSelectedEmployee({ ...initialFormData });
      toast.success("Employee added successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(`Error: ${err.message}`);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  // Clear the form
  const handleCancel = (): void => {
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
          <Image
            src="/illustration.svg"
            alt="Illustration"
            width={500}
            height={300}
          />
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
            {/* Pass employees directly; they are in ApiEmployee (snake_case) format */}
            <EmployeeTable
              employees={(employees ?? []) as Employee[]}
              onSelect={handleSelectEmployee}
              onAdd={handleDirectAdd}
            />
            <div className="mt-8">
              <EmployeeForm
                key={selectedEmployee.id ?? "new"}
                initialData={selectedEmployee}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
