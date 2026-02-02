import EmployeeForm from "./EmployeeForm";
import EmployeeList from "./EmployeeList";
import AttendanceForm from "./AttendanceForm";
import AttendanceList from "./AttendanceList";
import { useState } from "react";

export default function Dashboard({ page }) {
  const [refreshEmployees, setRefreshEmployees] = useState(false);
  const [refreshAttendance, setRefreshAttendance] = useState(false);

  return (
    <div style={{ padding: "20px", flex: 1 }}>
      {page === "addEmployee" && (
        <EmployeeForm onSuccess={() => setRefreshEmployees(!refreshEmployees)} />
      )}
      {page === "listEmployee" && <EmployeeList refresh={refreshEmployees} />}
      {page === "markAttendance" && (
        <AttendanceForm onSuccess={() => setRefreshAttendance(!refreshAttendance)} />
      )}
      {page === "viewAttendance" && (
        <AttendanceList refresh={refreshAttendance} />
      )}
    </div>
  );
}
