"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check } from "lucide-react";

export interface EmployeeFormData {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  salutation: string;
  gender: string;
  grossSalary: string;
  profileColor: string;
}

interface EmployeeFormProps {
  initialData: EmployeeFormData;
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
  isUpdate?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isUpdate = false,
}) => {
  const [formData, setFormData] = useState<EmployeeFormData>(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "firstName" || name === "lastName") {
        newData.fullName = `${newData.firstName} ${newData.lastName}`.trim();
      }
      return newData;
    });
  };

  const handleSalutationChange = (value: string) => {
    let gender = "Unspecified";
    if (value === "Mr.") gender = "Male";
    else if (value === "Mrs." || value === "Ms.") gender = "Female";

    setFormData((prev) => ({
      ...prev,
      salutation: value,
      gender,
    }));
  };

  const handleColorChange = (value: string) => {
    setFormData((prev) => ({ ...prev, profileColor: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const formatSalary = (value: string) => {
    const number = Number.parseInt(value.replace(/\s/g, ""), 10);
    if (isNaN(number)) return "";
    return number.toLocaleString("en-US").replace(/,/g, " ");
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatSalary(e.target.value);
    setFormData((prev) => ({ ...prev, grossSalary: formattedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialData);
  };

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  return (
    <div className="border rounded-lg p-6 bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">Employee Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="firstName">First Name(s) *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                pattern="[A-Za-z]"
                title="Alphabetic only"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                pattern="[A-Za-z]"
                title="Alphabetic only"
                required
              />
            </div>
            <div>
              <Label htmlFor="salutation">Salutation *</Label>
              <Select onValueChange={handleSalutationChange} value={formData.salutation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr.">Dr.</SelectItem>
                  <SelectItem value="Mr.">Mr.</SelectItem>
                  <SelectItem value="Ms.">Ms.</SelectItem>
                  <SelectItem value="Mrs.">Mrs.</SelectItem>
                  <SelectItem value="Mx.">Mx.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Gender *</Label>
              <RadioGroup value={formData.gender} onValueChange={handleGenderChange} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Unspecified" id="unspecified" />
                  <Label htmlFor="unspecified">Unspecified</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="employeeNumber">Employee # *</Label>
              <Input
                id="employeeNumber"
                name="employeeNumber"
                value={formData.employeeNumber}
                onChange={handleInputChange}
                required
                pattern="\d*"
                title="Numeric only"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                readOnly
                disabled
                className="bg-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="grossSalary">Gross Salary $PY</Label>
              <Input
                id="grossSalary"
                name="grossSalary"
                value={formData.grossSalary}
                onChange={handleSalaryChange}
                pattern="\d*"
                title="Numeric only"
              />
            </div>
            <div>
              <Label>Employee Profile Colour</Label>
              <RadioGroup value={formData.profileColor} onValueChange={handleColorChange} className="flex space-x-4">
                {["Default", "Green", "Blue", "Red"].map((color) => (
                  <div key={color} className="flex flex-col items-center">
                    <RadioGroupItem value={color} id={color.toLowerCase()} className="sr-only" />
                    <Label
                      htmlFor={color.toLowerCase()}
                      className={`w-8 h-8 rounded-sm flex items-center justify-center cursor-pointer ${
                        color === "Default"
                          ? "bg-gray-200"
                          : color === "Green"
                          ? "bg-green-500"
                          : color === "Blue"
                          ? "bg-blue-500"
                          : "bg-red-500"
                      }`}
                    >
                      {formData.profileColor === color && <Check className="text-white" />}
                    </Label>
                    <span className="mt-1 text-sm">{color}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            className={
              formData.profileColor === "Green"
                ? "bg-green-500 hover:bg-green-600"
                : formData.profileColor === "Blue"
                ? "bg-blue-500 hover:bg-blue-600"
                : formData.profileColor === "Red"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-primary hover:bg-primary/90"
            }
          >
            {isUpdate ? "Update Employee" : "Add Employee"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
