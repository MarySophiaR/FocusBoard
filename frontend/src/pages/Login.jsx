import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  async function handleLogin(e) {
  e.preventDefault();
  try {
    const res = await API.post("/auth/login", {
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
    console.log("LOGIN PAGE EXECUTED");
    localStorage.setItem(
    "loginType",
    "login"
    );
    navigate("/");
  }
  catch (err) {
    setMessage(
      err.response?.data?.error ||
      "Login Failed"
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
          Welcome Back
        </h2>
        <form
          className="auth-form"
          onSubmit={handleLogin}
        >
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
            Login
          </button>
        </form>
        {message &&
          <p className="auth-message">
            {message}
          </p>
        }
        <p className="auth-footer">
          Don't have an account?
          <Link to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
export default Login;