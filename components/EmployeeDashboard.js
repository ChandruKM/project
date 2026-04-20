"use client";
import { useDispatch, useSelector } from "react-redux";
import { applyLeave, updateLeave, deleteLeave } from "../redux/slices/leaveSlice";
import { useState, useEffect } from "react";   // ✅ ADDED

export default function EmployeeDashboard() {
  const dispatch = useDispatch();
  const leaves = useSelector((state) => state.leave.leaves);
  const user = useSelector((state) => state.user.currentUser);

  if (!user) return <h2>Loading...</h2>;

  const [empId, setEmpId] = useState("");
  const [type, setType] = useState("Sick");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState("");
  const [editId, setEditId] = useState(null);

useEffect(() => {
  if (!user) return;   // 🔥 IMPORTANT

  const loadLeaves = async () => {
    const res = await fetch("/api/leaves");
    const data = await res.json();

    // 🔥 clear old data (avoid duplicates)
    dispatch({ type: "leave/reset" });

    const userLeaves = data.filter(l => l.empId === user.empId);

    userLeaves.forEach(l => dispatch(applyLeave(l)));
  };

  loadLeaves();
}, [user]);   // 🔥 IMPORTANT CHANGE
  // ✅ ADD THIS FUNCTION
  const getWorkingDays = (start, end) => {
    let count = 0;
    let current = new Date(start);

    while (current <= new Date(end)) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) count++;
      current.setDate(current.getDate() + 1);
    }
    return count;
  };

  const initialBalance = {
    Sick: 5,
    Vacation: 15,
    Casual: 7,
  };

  const usedLeaves = {
    Sick: 0,
    Vacation: 0,
    Casual: 0,
  };

  leaves.forEach((l) => {
    if (l.status === "approved" && l.empId === user.empId) {
      const days = getWorkingDays(l.startDate, l.endDate);

      if (usedLeaves[l.type] !== undefined) {
        usedLeaves[l.type] += days;
      }
    }
  });

  const leaveBalance = {
    Sick: initialBalance.Sick - usedLeaves.Sick,
    Vacation: initialBalance.Vacation - usedLeaves.Vacation,
    Casual: initialBalance.Casual - usedLeaves.Casual,
  };

  const handleSubmit = async () => {
  if (!startDate || !endDate || !reason) {
    alert("Fill all fields");
    return;
  }
  // 🔥 BLOCK IF NO LEAVE BALANCE
if (leaveBalance[type] <= 0) {
  alert(`No ${type} leave balance available`);
  return;
}
  if (endDate < startDate) {
    alert("End date cannot be before start date");
    return;
  }

  // 🔥 CALCULATE DAYS
  const requestedDays = getWorkingDays(startDate, endDate);

  // 🔥 AVAILABLE BALANCE
  const availableDays = leaveBalance[type];

  let finalEndDate = endDate;

  // 🔥 LIMIT CHECK
  if (requestedDays > availableDays) {
    alert(`Only ${availableDays} days available. Adjusting leave.`);

    let count = 0;
    let current = new Date(startDate);

    while (count < availableDays) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) count++;
      if (count < availableDays) {
        current.setDate(current.getDate() + 1);
      }
    }

    finalEndDate = current.toISOString().split("T")[0];
  }

  const data = {
    id: editId ? editId : Date.now(),
    empId: user.empId,
    type,
    startDate,
    endDate: finalEndDate,   // 🔥 UPDATED HERE
    reason,
    file,
    status: "pending",
  };

  if (editId) {
    dispatch(updateLeave(data));
    setEditId(null);
  } else {
    await fetch("/api/leaves", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    dispatch(applyLeave(data));
  }

  setEmpId("");
  setType("Sick");
  setStartDate("");
  setEndDate("");
  setReason("");
  setFile("");
};

  return (
    <div className="emp-container">

      <h2>Employee Dashboard</h2>

      <div className="form-card">
        <center><h3>Apply Leave</h3></center>

        <input className="input" value={user.empId} disabled />

        <select className="input" value={type}
          onChange={(e) => setType(e.target.value)}>
          <option>Sick</option>
          <option>Vacation</option>
          <option>Casual</option>
        </select>

        <input className="input" type="date"
          value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        <input className="input" type="date"
          min={startDate}
          value={endDate} onChange={(e) => setEndDate(e.target.value)} />

        <input className="input" placeholder="Reason"
          value={reason} onChange={(e) => setReason(e.target.value)} />

        <input className="input" type="file"
          onChange={(e) => setFile(e.target.files[0]?.name)} />

        <center>
          <button className="apply-btn" onClick={handleSubmit}>
            {editId ? "Update Leave" : "Request Leave"}
          </button>
        </center>
      </div>
      
      <div className="balance-card">
        <h3>Leave Balance</h3>
        <div className="stats">
          <div className="stat">
            <div className="progress-circle sick">
              <span>{leaveBalance.Sick}</span>
            </div>
            <p>Sick</p>
          </div>
          <div className="stat">
            <div className="progress-circle vacation">
              <span>{leaveBalance.Vacation}</span>
            </div>
            <p>Vacation</p>
          </div>
          <div className="stat">
            <div className="progress-circle casual">
              <span>{leaveBalance.Casual}</span>
            </div>
            <p>Casual</p>
          </div>
        </div>
      </div>

      <div className="leave-section">
        <div className="leave-box">
          <center><h3>Leave History</h3></center>

          {leaves.length === 0 ? (
            <p>No leaves applied</p>
          ) : (
            <table className="leave-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Emp ID</th>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l, index) => (
                  <tr key={l.id}>
                    <td>{index + 1}</td>
                    <td>{l.empId}</td>
                    <td>{l.type}</td>
                    <td>{new Date(l.startDate).toLocaleDateString()}</td>
                    <td>{new Date(l.endDate).toLocaleDateString()}</td>
                    <td>{l.reason}</td>
                    <td className={`status ${l.status}`}>{l.status}</td>
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