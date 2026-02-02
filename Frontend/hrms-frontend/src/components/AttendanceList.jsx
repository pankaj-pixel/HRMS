import { useEffect, useState } from "react";
import { getEmployees, getAttendance } from "../api";

export default function AttendanceList({ refresh }) {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filter, setFilter] = useState({ start: "", end: "" });

  // Fetch data on mount or refresh
  useEffect(() => {
    async function fetchData() {
      const emps = await getEmployees();
      setEmployees(emps);

      const allAttendance = [];
      for (let emp of emps) {
        const records = await getAttendance(emp.id);
        records.forEach(r =>
          allAttendance.push({ employee: emp.name, date: r.date, status: r.status })
        );
      }

      allAttendance.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAttendanceRecords(allAttendance);
      setFilteredRecords(allAttendance);
    }

    fetchData();
  }, [refresh]);

  // Filter by date
  useEffect(() => {
    const { start, end } = filter;
    if (!start && !end) return setFilteredRecords(attendanceRecords);

    const filtered = attendanceRecords.filter(r => {
      const date = new Date(r.date);
      if (start && date < new Date(start)) return false;
      if (end && date > new Date(end)) return false;
      return true;
    });
    setFilteredRecords(filtered);
  }, [filter, attendanceRecords]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Summary */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {employees.map(emp => {
          const presentCount = attendanceRecords.filter(r => r.employee === emp.name && r.status === "Present").length;
          return (
            <div key={emp.id} style={{
              flex: "1 1 150px",
              background: "#fff",
              padding: "10px",
              borderRadius: "6px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
            }}>
              <strong>{emp.name}</strong>
              <p>{presentCount} Present</p>
            </div>
          );
        })}
      </div>

      {/* Filter + Table */}
      <div style={{
        background: "#fff",
        padding: "10px",
        borderRadius: "6px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
      }}>
        <div style={{ marginBottom: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
          <label>Start Date: </label>
          <input type="date" value={filter.start} onChange={e => setFilter({ ...filter, start: e.target.value })} />
          <label>End Date: </label>
          <input type="date" value={filter.end} onChange={e => setFilter({ ...filter, end: e.target.value })} />
        </div>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {filteredRecords.length === 0 ? (
            <p>No attendance records found</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Employee</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((rec, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{rec.employee}</td>
                    <td style={tdStyle}>{rec.date}</td>
                    <td style={{ ...tdStyle, color: rec.status === "Absent" ? "red" : "green" }}>{rec.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const thStyle = { textAlign: "left", padding: "8px", borderBottom: "2px solid #ccc" };
const tdStyle = { padding: "8px", borderBottom: "1px solid #eee" };
