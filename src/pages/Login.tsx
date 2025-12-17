import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import AppLayout from "../layouts/AppLayout";
import AuthContext from "../contexts/AuthContext";

const Login = () => {
  const { loginUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    loginUser(e); // 👈 AuthContext handles everything
  };

  return (
    <AppLayout
      title="Welcome Back"
      subtitle="Sign in to continue"
    >
      <form onSubmit={handleSubmit}>
        {/* Email / Phone */}
        <div className="mb-3">
          <label className="form-label">Email / Phone</label>
          <input
            type="text"
            name="username"           // 🔥 MUST MATCH AuthContext
            className="form-control form-control-lg"
            placeholder="Enter your email or phone"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"           // 🔥 MUST MATCH AuthContext
            className="form-control form-control-lg"
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Forgot password */}
        <div className="text-end text-danger mb-3">
          <small style={{ cursor: "pointer" }}>
            Forgot Password?
          </small>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-danger w-100 btn-lg mb-3"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="text-center">
        <small className="text-muted">
          Don't have an account?{" "}
          <span 
            className="text-danger" 
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/signup")}
          >
            Create account
          </span>
        </small>
      </div>
    </AppLayout>
  );
};

export default Login;
