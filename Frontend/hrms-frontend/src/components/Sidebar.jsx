Sidebar.jsx
export default function Sidebar({ setPage }) {
  return (
    <div style={{
      width: "220px",
      background: "#1976d2",
      color: "#fff",
      height: "100vh",
      padding: "30px 20px",
      boxSizing: "border-box",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h2 style={{ margin: 0, fontSize: "24px" }}>HRMS Lite</h2>
      <nav style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "40px" }}>
        <button style={btnStyle} onClick={() => setPage("addEmployee")}>Register Employee</button>
        <button style={btnStyle} onClick={() => setPage("listEmployee")}>Team Overview</button>
        <button style={btnStyle} onClick={() => setPage("markAttendance")}>Log Attendance</button>
        <button style={btnStyle} onClick={() => setPage("viewAttendance")}>Attendance Report</button>
      </nav>
    </div>
  );
}

const btnStyle = {
  padding: "12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  background: "#1565c0",
  color: "white",
  textAlign: "left",
  fontSize: "16px",
  fontWeight: "500",
  transition: "0.2s",
};

btnStyle[':hover'] = { backgroundColor: "#0d47a1" }; // optional for hover effect
