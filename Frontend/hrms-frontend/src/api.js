const BASE_URL = "https://hrms-1-x2am.onrender.com";


export async function getEmployees() {
  const res = await fetch(`${BASE_URL}/employees`);
  return res.json();
}

export async function addEmployee(data) {
  const res = await fetch(`${BASE_URL}/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json(); 

  if (!res.ok) {
    throw new Error(result.detail || result.message || "Something went wrong");
  }

  return result; 
}


export async function deleteEmployee(id) {
  await fetch(`${BASE_URL}/employees/${id}`, { method: "DELETE" });
}

export async function markAttendance(data) {
  const payload = {
    employee_id: parseInt(data.employeeId),
    date: data.date,
    status: data.status
  };

  const res = await fetch(`${BASE_URL}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.detail || result.message || "Something went wrong");
  }

  return result; // {success: true/false, message: "..."}
}


export async function getAttendance(empId) {
  const res = await fetch(`${BASE_URL}/attendance/${empId}`);
  return res.json();
}
