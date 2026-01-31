import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import AppLayout from "../layouts/AppLayout";
import AuthContext from "../contexts/AuthContext";
import { validateForm } from "../utils/validation";
import type { ValidationErrors } from "../utils/validation";
import toast from "react-hot-toast";
import headerImg from "../assets/image/hederimage.png";
import FormInput from "../components/ui/FormInput"; 
const Login = () => {
  const { loginUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const validationRules = {
      username: {
        required: true,
        maxLength: 50,
        custom: (value: string) => {
          const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          const phonePattern = /^[0-9]{10,15}$/;
          if (!emailPattern.test(value) && !phonePattern.test(value)) {
            return 'Enter valid email or phone number';
          }
          return null;
        }
      },
      password: { required: true, minLength: 1, maxLength: 30 }
    };

    const validationErrors = validateForm(formData, validationRules);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors below");
      return;
    }

    loginUser(e);
  };

  return (
    <AppLayout
      title="Login"
    >
      <div>
          <div className="mb-4">
    <img
      src={headerImg}
      alt="login header"
      className="w-100"
      style={{
        height: 200,
        objectFit: "cover",
        borderRadius: "0 0 20px 20px",
      }}
    />
  </div>
       <div className="text-center mb-4">
    <h2 className="fw-bold mb-1">Welcome back 👋</h2>
    <p className="text-muted" style={{ fontSize: 14 }}>
      Login to continue managing your records
    </p>
  </div>
  </div>
      <form onSubmit={handleSubmit}>
        {/* Email / Phone */}

        <FormInput
          label="Email / Phone"
          name="username"
          placeholder="Enter your email or phone"
          maxLength={50}
          error={errors.username}
        />

        {/* Password */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={`form-control form-control-lg pe-5 ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Enter your password"
              maxLength={30}
              required
            />
            <button
              type="button"
              className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </button>
          </div>
          {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
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
