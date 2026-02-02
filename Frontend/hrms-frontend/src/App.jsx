import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [page, setPage] = useState("addEmployee");

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setPage={setPage} />
      <Dashboard page={page} />
    </div>
  );
}
