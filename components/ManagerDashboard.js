"use client";

import { approveLeave, updateLeave } from "../redux/slices/leaveSlice";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function ManagerDashboard() {
  const dispatch = useDispatch();
  const leaves = useSelector((state) => state.leave.leaves) || [];

  const [date, setDate] = useState(new Date());

  // ✅ APPROVE
  const handleApprove = async (leave) => {
    if (leave.status === "approved") return;

    const updatedLeave = { ...leave, status: "approved" };

    try {
      await fetch("/api/approvedLeaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedLeave),
      });

      dispatch(approveLeave(updatedLeave));
    } catch (error) {
      console.error("Error saving approved leave:", error);
    }
  };

  // ✅ REJECT
  const handleReject = (leave) => {
    dispatch(
      updateLeave({
        ...leave,
        status: "rejected",
      })
    );
  };

  return (
    <div className="manager-grid">

      <h2>Manager Dashboard</h2>

      {/* LEFT - REQUESTS */}
      <div className="card requests">
        <center><h3>Leave Requests</h3></center>

        {leaves.length === 0 && <p>No requests</p>}

        {[...leaves].sort((a, b) => b.id - a.id).map((l, index) => (
          <div key={l.id} className="leave-card">

            <p>
              <b>Emp ID:</b> {l.empId}
              {index === 0 && (
                <span style={{
                  background: "red",
                  color: "white",
                  padding: "2px 6px",
                  marginLeft: "10px",
                  borderRadius: "6px",
                  fontSize: "12px"
                }}>
                  NEW
                </span>
              )}
            </p>

            <p><b>Type:</b> {l.type}</p>
            <p><b>Date:</b> {l.startDate} → {l.endDate}</p>
            <p><b>Reason:</b> {l.reason}</p>
            <p><b>Status:</b> {l.status}</p>

            {l.status === "pending" && (
              <div className="btn-group">
                <button onClick={() => handleApprove(l)}>Approve</button>
                <button onClick={() => handleReject(l)}>Reject</button>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* RIGHT - CALENDAR */}
      <div className="card calendar">
        <center><h3>Leave Calendar</h3></center>

        <Calendar
          onChange={setDate}
          value={date}

          tileClassName={({ date }) => {
            const leave = leaves.find((l) => {
              const start = new Date(l.startDate + "T00:00:00");
              const end = new Date(l.endDate + "T23:59:59");
              return date >= start && date <= end;
            });

            if (!leave) return null;

            if (leave.status === "approved") return "approved-date";
            if (leave.status === "pending") return "pending-date";
            if (leave.status === "rejected") return "rejected-date";

            return null;
          }}

          tileContent={({ date }) => {
            const dayLeaves = leaves.filter((l) => {
              const start = new Date(l.startDate + "T00:00:00");
              const end = new Date(l.endDate + "T23:59:59");
              return date >= start && date <= end;
            });

            if (dayLeaves.length === 0) return null;

            return (
              <div
                style={{ width: "100%", height: "100%" }}
                title={dayLeaves.map(l =>
                  `Emp: ${l.empId} | ${l.type} | ${l.status}`
                ).join("\n")}
              />
            );
          }}
        />

      </div>

      {/* REPORTS */}
      <div className="card reports full-width">
        <center><h3>Reports</h3></center>

        <div className="report-cards">

          <div className="report-box total">
            <h4>Total Leaves Requested</h4>
            <p>{leaves.length}</p>
          </div>

          <div className="report-box approved">
            <h4>Leaves Approved</h4>
            <p>{leaves.filter(l => l.status === "approved").length}</p>
          </div>

          <div className="report-box pending">
            <h4>Leaves Pending</h4>
            <p>{leaves.filter(l => l.status === "pending").length}</p>
          </div>

          <div className="report-box rejected">
            <h4>Leaves Rejected</h4>
            <p>{leaves.filter(l => l.status === "rejected").length}</p>
          </div>

        </div>
      </div>

    </div>
  );
}