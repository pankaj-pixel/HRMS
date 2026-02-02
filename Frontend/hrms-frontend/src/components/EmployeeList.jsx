import { useEffect, useState } from "react";
import { getEmployees, deleteEmployee } from "../api";

export default function EmployeeList({ refresh }) {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    async function fetchEmployees() {
      const emps = await getEmployees();
      setEmployees(emps);
    }
    fetchEmployees();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    await deleteEmployee(id);
    setEmployees(employees.filter((e) => e.id !== id));
  };

  return (
    <div>
      <h3 style={{ marginBottom: "20px" }}>All Employees</h3>

      {employees.length === 0 ? (
        <p>No employees found</p>
      ) : (
        <div style={{
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          overflowX: "auto",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Department</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id}>
                  <td style={tdStyle}>{e.employee_id}</td>
                  <td style={tdStyle}>{e.name}</td>
                  <td style={tdStyle}>{e.email}</td>
                  <td style={tdStyle}>{e.department}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleDelete(e.id)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "4px",
                        background: "red",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = { textAlign: "left", padding: "12px", borderBottom: "2px solid #ccc", background: "#f4f6f8" };
const tdStyle = { padding: "12px", borderBottom: "1px solid #eee" };
