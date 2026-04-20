"use client";

import { useSelector } from "react-redux";
import EmployeeDashboard from "../../components/EmployeeDashboard";
import ManagerDashboard from "../../components/ManagerDashboard";
import AdminDashboard from "../../components/AdminDashboard";

export default function Dashboard() {
  const user = useSelector((state: any) => state.user.currentUser);

  if (!user) return <h2>Please login first</h2>;

  if (user.role === "employee") return <EmployeeDashboard />;
  if (user.role === "manager") return <ManagerDashboard />;
  if (user.role === "admin") return <AdminDashboard />;

  return <h2>Invalid role</h2>;
}