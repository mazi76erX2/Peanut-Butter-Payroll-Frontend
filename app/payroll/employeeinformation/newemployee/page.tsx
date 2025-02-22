"use client";

import React, { useState } from "react";
import EmployeeTable, { Employee } from "../../../components/EmployeeTable";
import EmployeeForm, { EmployeeFormData } from "../../../components/EmployeeForm";
import useEmployees from "../../../hooks/useEmployees";

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

  const [employees, setEmployees] = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeFormData>(initialFormData);

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee as EmployeeFormData);
  };

  const handleFormSubmit = (data: EmployeeFormData) => {
    if (selectedEmployee.employeeNumber) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.employeeNumber === selectedEmployee.employeeNumber ? data : emp
        )
      );
    } else {
      setEmployees((prev) => [...prev, data]);
    }
    setSelectedEmployee(initialFormData);
  };

  const handleCancel = () => {
    setSelectedEmployee(initialFormData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Peanut Butter Payroll
      </h1>
      <div className="mb-8 flex justify-center">
        <img src="/illustration.svg" alt="Illustration" className="w-1/2 max-w-md" />
      </div>
      <EmployeeTable employees={employees} onSelect={handleEmployeeSelect} onAdd={handleCancel} />
      <div className="mt-8">
        <EmployeeForm
          initialData={selectedEmployee}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          isUpdate={selectedEmployee.employeeNumber !== ""}
        />
      </div>
    </div>
  );
}
