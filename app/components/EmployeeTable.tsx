"use client";

import React from "react";
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
  employeeNumber: string;
  firstName: string;
  lastName: string;
  salutation: string;
  profileColor: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  onSelect: (employee: Employee) => void;
  onAdd: () => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onSelect,
  onAdd,
}) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Current Employees</h2>
        <Button onClick={onAdd}>Add Employee</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee #</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Salutation</TableHead>
            <TableHead>Profile Colour</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee, index) => (
            <TableRow
              key={index}
              onClick={() => onSelect(employee)}
              className="cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <TableCell>{employee.employeeNumber}</TableCell>
              <TableCell>{employee.firstName}</TableCell>
              <TableCell>{employee.lastName}</TableCell>
              <TableCell>{employee.salutation}</TableCell>
              <TableCell>{employee.profileColor}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
