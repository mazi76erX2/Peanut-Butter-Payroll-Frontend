"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export interface Employee {
  id?: number;
  employee_number: string;
  first_name: string;
  last_name: string;
  salutation: string;
  profile_color: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  onSelect: (employee: Employee) => void;
  onAdd: (employee: Employee | null) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onSelect,
  onAdd,
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const handleRowClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    onSelect(employee);
  };

  const handleAddClick = () => {
    onAdd(selectedEmployee);
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Current Employees</h2>
        <Button onClick={handleAddClick}>Add Employee</Button>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 bg-white z-10">
                Employee #
              </TableHead>
              <TableHead className="sticky top-0 bg-white z-10">
                First Name
              </TableHead>
              <TableHead className="sticky top-0 bg-white z-10">
                Last Name
              </TableHead>
              <TableHead className="sticky top-0 bg-white z-10">
                Salutation
              </TableHead>
              <TableHead className="sticky top-0 bg-white z-10">
                Profile Colour
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee, index) => {
              const isSelected = selectedEmployee?.id === employee.id;
              return (
                <TableRow
                  key={employee.id || index}
                  onClick={() => handleRowClick(employee)}
                  className={`cursor-pointer transition-colors hover:bg-gray-100 ${
                    isSelected
                      ? "bg-blue-100"
                      : index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                  }`}
                >
                  <TableCell>{employee.employee_number}</TableCell>
                  <TableCell>{employee.first_name}</TableCell>
                  <TableCell>{employee.last_name}</TableCell>
                  <TableCell>{employee.salutation}</TableCell>
                  <TableCell>{employee.profile_color}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeTable;
