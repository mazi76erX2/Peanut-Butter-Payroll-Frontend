import { useState, useEffect } from "react";
import { EmployeeFormData } from "../components/EmployeeForm";

const initialEmployees: EmployeeFormData[] = [
  {
    employeeNumber: "1001",
    firstName: "Alice",
    lastName: "Anderson",
    fullName: "Alice Anderson",
    salutation: "Ms.",
    gender: "Female",
    grossSalary: "50 000",
    profileColor: "Blue",
  },
  {
    employeeNumber: "1002",
    firstName: "Bob",
    lastName: "Brown",
    fullName: "Bob Brown",
    salutation: "Mr.",
    gender: "Male",
    grossSalary: "60 000",
    profileColor: "Green",
  },
];

export default function useEmployees(): [
  EmployeeFormData[],
  React.Dispatch<React.SetStateAction<EmployeeFormData[]>>,
] {
  const [employees, setEmployees] = useState<EmployeeFormData[]>([]);

  useEffect(() => {
    // Simulate asynchronous loading (replace with actual fetch if needed)
    setTimeout(() => {
      setEmployees(initialEmployees);
    }, 500);
  }, []);

  return [employees, setEmployees];
}
