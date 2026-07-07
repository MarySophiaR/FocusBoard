import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  async function handleRegister(e) {
  e.preventDefault();
  try {
    const res = await API.post("/auth/register", {
      username,
      email,
      password
    });
    localStorage.setItem(
      "token",
      res.data.token
    );
    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );
    localStorage.setItem(
      "loginType",
      "register"
    );
    // Redirect to Dashboard
    navigate("/");
  }
  catch (err) {
    setMessage(
      err.response?.data?.error ||
      "Registration Failed"
    );
  }
}
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-row">
            <div className="brand-icon">
              ◎
            </div>
            <h1>
              Focus Board
            </h1>
          </div>
          <p className="auth-subtitle">
            Organize today. Achieve tomorrow.
          </p>
        </div>
        <h2>
          Create Account
        </h2>
        <form
          className="auth-form"
          onSubmit={handleRegister}
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
          <button type="submit">
            Register
          </button>
        </form>
        {
          message &&
          <p className="auth-message">
            {message}
          </p>
        }
      </div>
    </div>
  );
}
export default Register;