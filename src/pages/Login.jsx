import React, { useState } from "react";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // send email + password (backend expects email as USERNAME_FIELD)
      const response = await login({
        email: credentials.email,
        password: credentials.password,
      });
      // delegate storage to AuthContext so UI updates
      auth.login({
        access: response.data.access,
        refresh: response.data.refresh,
        user: response.data.user,
      });
      alert("Logged in successfully!");
    } catch (error) {
      console.error("Login error", error?.response || error);
      alert(
        "Login failed: " +
          (error?.response?.data?.detail || "Invalid credentials"),
      );
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
