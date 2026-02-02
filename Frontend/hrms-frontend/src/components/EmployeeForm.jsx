import { useState } from "react";
import { addEmployee } from "../api";

export default function EmployeeForm({ onSuccess, existingEmployees = [] }) {
  const [form, setForm] = useState({
    employee_id: "",
    name: "",
    email: "",
    department: "",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    // Employee ID validation: must be integer and unique
    if (!form.employee_id.trim()) {
      newErrors.employee_id = "Employee ID is required";
    } else if (!/^\d+$/.test(form.employee_id.trim())) {
      newErrors.employee_id = "Employee ID must be a number";
    } else if (existingEmployees.some(emp => emp.employee_id === form.employee_id.trim())) {
      newErrors.employee_id = "This Employee ID already exists";
    }

    // Name validation
    if (!form.name.trim()) newErrors.name = "Full Name is required";

    // Email validation
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    // Department validation
    if (!form.department.trim()) newErrors.department = "Department is required";

    return newErrors;
  };

  const submit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await addEmployee(form);
      setForm({ employee_id: "", name: "", email: "", department: "" });
      setMessage(res?.message || "Employee added successfully!");
      setErrors({});
      onSuccess();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.message || "Something went wrong.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
      <form
        onSubmit={submit}
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          width: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      > 
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Register Employee</h3>

        <div>
          <input
            name="employee_id"
            placeholder="Employee ID (numbers only)"
            value={form.employee_id}
            onChange={handleChange}
          />
          {errors.employee_id && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "3px" }}>
              {errors.employee_id}
            </p>
          )}
        </div>

        <div>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "3px" }}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "3px" }}>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
          />
          {errors.department && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "3px" }}>
              {errors.department}
            </p>
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: "12px",
            border: "none",
            borderRadius: "6px",
            background: "#1976d2",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Register 
        </button>

        {message && (
          <p
            style={{
              textAlign: "center",
              color: message.includes("successfully") ? "green" : "red",
              fontWeight: "500",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
