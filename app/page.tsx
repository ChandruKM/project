"use client";

import { useDispatch } from "react-redux";
import { login } from "../redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    if (username === "admin" && password === "123" && role === "admin") {
      dispatch(login({ username: "admin", role: "admin", empId: "admin" }));
      router.push("/dashboard");
      return;
    }

    const res = await fetch("/api/get");
    const data = await res.json();

    const user = data.users.find(
      (u: any) =>
        u.username === username &&
        u.password === password &&
        u.role === role
    );

    if (!user) {
      alert("Invalid credentials");
      return;
    }

    dispatch(login(user));
    router.push("/dashboard");
  };

  const handleSignup = async () => {
    const res = await fetch("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "user",
        payload: { username, password, role, empId: username },
      }),
    });

    if (!res.ok) {
      alert("Signup failed");
      return;
    }

    alert("Signup successful");
    setIsSignup(false);
  };

  return (
    <>
    <header className="header">
  <div className="header-left">
    <img src="/t.png" alt="Company Logo" className="logo-img" />
    <span className="company-name">TechCorp Solutions</span>
  </div>
</header>
      <div className="main-container">
        <div className="bg-animation"></div>
        <div className="left-panel">
          <h1>Employee Leave Management Portal</h1>
          <h3>Efficient • Transparent • Reliable</h3>

          <p>
            Welcome to our centralized leave management system designed to
            streamline employee leave requests and approval workflows.
          </p>

          <p>
            Employees can easily apply for leave, track request status,
            and manage their leave history, while managers can efficiently
            review and approve requests in real-time.
          </p>

          <p>
            This system enhances productivity, ensures transparency,
            and simplifies workforce management across the organization.
          </p>
        </div>

        <div className="right-panel">
          <div className="login-container">

            <h2 className="login-title">
              {isSignup ? "Sign Up" : "Login"}
            </h2>

            <input
              className="input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              {!isSignup && <option value="admin">Admin</option>}
            </select>

            <button
              className="login-btn"
              onClick={isSignup ? handleSignup : handleLogin}
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </button>

            <p className="toggle-text">
              {isSignup ? "Already have an account?" : "New user?"}{" "}
              <span onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? "Login" : "Sign up"}
              </span>
            </p>

          </div>
        </div>

      </div>

      {/* 🔥 FOOTER ADDED */}
      <footer style={{
        textAlign: "center",
        padding: "10px",
        fontSize: "13px",
        color: "#aaa",
        background: "transparent"
      }}>
        © 2026 Leave Management System | Designed for efficient workforce management
      </footer>
    </>
  );
}