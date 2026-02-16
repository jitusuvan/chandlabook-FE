import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import global from "../config/Global.json";
import { validateForm, commonRules } from "../utils/validation";
import type { ValidationErrors } from "../utils/validation";
import headerImg from "../assets/image/hederimage.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { temp_token } = useParams<{ temp_token: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!temp_token) {
      toast.error("Invalid reset link");
      navigate("/login");
    }
  }, [temp_token, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    const validationRules = {
      password: commonRules.password
    };

    const validationErrors = validateForm(formData, validationRules);

    if (password !== confirmPassword) {
      validationErrors.confirm_password = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${global.api.host}${global.api.confirmPassword}${temp_token}/`,
        { new_password: password }
      );
      
      toast.success(response.data?.detail || "Password reset successfully!");
      navigate("/login");
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to reset password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex">
      {/* Mobile Layout */}
      <div className="d-block d-md-none w-100 bg-white">
        <div className="p-3">
          <div className="mb-4">
            <img
              src={headerImg}
              alt="reset password header"
              className="w-100"
              style={{
                height: 200,
                objectFit: "cover",
                borderRadius: "0 0 20px 20px",
              }}
            />
          </div>
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-1">Reset Password</h2>
            <p className="text-muted" style={{ fontSize: 14 }}>
              Enter your new password
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-control form-control-lg pe-5 ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Enter new password"
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

            <div className="mb-4">
              <label className="form-label">Confirm New Password</label>
              <div className="position-relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  className={`form-control form-control-lg pe-5 ${errors.confirm_password ? 'is-invalid' : ''}`}
                  placeholder="Confirm new password"
                  maxLength={30}
                  required
                />
                <button
                  type="button"
                  className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
              {errors.confirm_password && <div className="invalid-feedback d-block">{errors.confirm_password}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-danger w-100 btn-lg mb-3"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="text-center">
            <small className="text-muted">
              Remember your password?{" "}
              <span 
                className="text-danger" 
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => navigate("/login")}
              >
                Back to Login
              </span>
            </small>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="d-none d-md-flex w-100">
        {/* Left Side - Image */}
        <div className="col-md-6 col-lg-7 d-flex align-items-center justify-content-center bg-light">
          <div className="text-center p-5">
            <img
              src={headerImg}
              alt="ChandlaBook"
              className="img-fluid rounded-4 shadow-lg"
              style={{ maxWidth: "400px", maxHeight: "500px", objectFit: "cover" }}
            />
            <h3 className="fw-bold mt-4 text-danger">ChandlaBook</h3>
            <p className="text-muted">Manage your events & contributions with ease</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="col-md-6 col-lg-5 d-flex align-items-center justify-content-center bg-white">
          <div className="w-100 px-4" style={{ maxWidth: "350px" }}>
            <div className="text-center mb-3">
              <h4 className="fw-bold mb-1">Reset Password</h4>
              <p className="text-muted small">
                Enter your new password
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label small">New Password</label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`form-control pe-5 ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Enter new password"
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

              <div className="mb-3">
                <label className="form-label small">Confirm New Password</label>
                <div className="position-relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    className={`form-control pe-5 ${errors.confirm_password ? 'is-invalid' : ''}`}
                    placeholder="Confirm new password"
                    maxLength={30}
                    required
                  />
                  <button
                    type="button"
                    className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
                {errors.confirm_password && <div className="invalid-feedback d-block">{errors.confirm_password}</div>}
              </div>

              <button
                type="submit"
                className="btn btn-danger w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            <div className="text-center">
              <small className="text-muted">
                Remember your password?{" "}
                <span 
                  className="text-danger" 
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </span>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;