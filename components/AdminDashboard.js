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

        {pending > 5 && (
          <p style={{ color: "red" }}>⚠ Too many pending requests</p>
        )}
      </div>

      {/* 🔥 EMPTY DIV TO FIX GRID (IMPORTANT) */}
      <div></div>

      {/* ================= REPORTS ================= */}
      <div className="card reports" style={{ gridColumn: "1 / 3" }}>
        <center><h3>Reports</h3></center>

        <div className="report-cards">

          <div className="report-box total">
            <h4>Total Leaves Requested</h4>
            <p>{total}</p>
          </div>

          <div className="report-box approved">
            <h4>Leaves Approved</h4>
            <p>{approved}</p>
          </div>

          <div className="report-box pending">
            <h4>Leaves Pending</h4>
            <p>{pending}</p>
          </div>

          <div className="report-box rejected">
            <h4>Leaves Rejected</h4>
            <p>{rejected}</p>
          </div>

        </div>
      </div>

    </div>
  );
}