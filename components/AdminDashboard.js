"use client";

import { useSelector } from "react-redux";

export default function AdminDashboard() {
  const leaves = useSelector((state) => state.leave.leaves) || [];

  // 🔥 BASIC ANALYTICS
  const total = leaves.length;
  const approved = leaves.filter(l => l.status === "approved").length;
  const pending = leaves.filter(l => l.status === "pending").length;
  const rejected = leaves.filter(l => l.status === "rejected").length;

  return (
    <div className="admin-container">

      <h2>Admin Dashboard</h2>

      {/* ================= POLICY ================= */}
      <div className="card policy">
        <h3>Leave Policy Management</h3>

        <p><b>Sick Leave:</b> 8 days/year</p>
        <p><b>Casual Leave:</b> 10 days/year</p>
        <p><b>Vacation Leave:</b> 15 days/year</p>

        <p>✔ Carry Forward: Allowed</p>
        <p>✔ Encashment: Available</p>
        <p>✔ Probation Rule: No leave in first 3 months</p>
      </div>

      {/* ================= RECORDS ================= */}
      <div className="card records">
        <h3>Employee Leave Records</h3>

        {leaves.map((l) => (
          <div key={l.id} className="record-box">
            <p><b>Emp:</b> {l.empId}</p>
            <p>{l.type} | {l.startDate} → {l.endDate}</p>
            <p>Status: {l.status}</p>
          </div>
        ))}
      </div>

      {/* ================= TRACKING ================= */}
      <div className="card tracking">
        <h3>Leave Tracking & Compliance</h3>

        <p>Total Leaves: {total}</p>
        <p>Approved: {approved}</p>
        <p>Pending: {pending}</p>
        <p>Rejected: {rejected}</p>

        {pending > 5 && <p style={{color:"red"}}>⚠ Too many pending requests</p>}
      </div>

      {/* ================= REPORTS ================= */}
      <div className="card reports">
        <h3>Reports & Analytics</h3>

        <div className="report-box">
          <p>Total Requests</p>
          <h2>{total}</h2>
        </div>

        <div className="report-box">
          <p>Approved</p>
          <h2>{approved}</h2>
        </div>

        <div className="report-box">
          <p>Pending</p>
          <h2>{pending}</h2>
        </div>

        <div className="report-box">
          <p>Rejected</p>
          <h2>{rejected}</h2>
        </div>

      </div>

    </div>
  );
}