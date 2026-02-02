import { useState, useEffect } from "react";
import { getEmployees, getAttendance, markAttendance } from "../api";

export default function AttendanceForm() {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [form, setForm] = useState({ employeeId: "", date: "", status: "Present" });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchEmployees() {
      const emps = await getEmployees();
      setEmployees(emps);

      // Fetch existing attendance to prevent duplicates immediately
      const allAttendance = [];
      for (let emp of emps) {
        const records = await getAttendance(emp.id);
        records.forEach(r =>
          allAttendance.push({ employeeId: emp.id, date: r.date })
        );
      }
      setAttendanceRecords(allAttendance);
    }
    fetchEmployees();
  }, []);

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!form.employeeId) newErrors.employeeId = "Please select an employee";
    if (!form.date) newErrors.date = "Please select a date";

    // Check duplicate locally
    const duplicate = attendanceRecords.find(
      r => r.employeeId === form.employeeId && r.date === form.date
    );
    if (duplicate) newErrors.duplicate = "Attendance already marked for this employee on this date";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage("");
      return;
    }

    try {
      const res = await markAttendance(form); // payload maps employeeId -> employee_id inside api.js

      setMessage(res.message);
      setErrors({});

      if (res.success) {
        // Reset form
        setForm({ employeeId: "", date: "", status: "Present" });

        // Add to local attendanceRecords to prevent re-marking immediately
        setAttendanceRecords([...attendanceRecords, { employeeId: form.employeeId, date: form.date }]);
      }

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.message || "Something went wrong");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
      <form
        onSubmit={handleSubmit}
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
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Log Attendance</h3>

        <div>
          <select
            value={form.employeeId}
            onChange={(e) => {
              setForm({ ...form, employeeId: e.target.value });
              setErrors({ ...errors, employeeId: "", duplicate: "" });
            }}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
          {errors.employeeId && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "3px" }}>{errors.employeeId}</p>
          )}
        </div>

        <div>
          <input
            type="date"
            value={form.date}
            onChange={(e) => {
              setForm({ ...form, date: e.target.value });
              setErrors({ ...errors, date: "", duplicate: "" });
            }}
          />
          {errors.date && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "3px" }}>{errors.date}</p>
          )}
        </div>

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

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
          Log 
        </button>

        {errors.duplicate && (
          <p style={{ textAlign: "center", color: "red", fontWeight: "500" }}>{errors.duplicate}</p>
        )}

        {message && !errors.duplicate && (
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
