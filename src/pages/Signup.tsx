import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";

import AuthContext from "../contexts/AuthContext";
import { validateForm, commonRules } from "../utils/validation";
import type { ValidationErrors } from "../utils/validation";
import FormInput from "../components/ui/FormInput";
import headerImg from "../assets/image/hederimage.png";

const Signup = () => {
  const navigate = useNavigate();
  const { signupUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    const validationRules = {
      first_name: commonRules.name,
      last_name: commonRules.name,
      email: commonRules.email,
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

   const payload = {
  username: formData.get("email"),
  email: formData.get("email"),
  first_name: formData.get("first_name"),
  last_name: formData.get("last_name"),
  password,
  groups: [],
};

    await signupUser(payload);
  };

  return (
    <div className="vh-100 d-flex">
      {/* Mobile Layout */}
      <div className="d-block d-md-none w-100 bg-white">
        <div className="p-3">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-1">Create Account</h2>
            <p className="text-muted" style={{ fontSize: 14 }}>
              Join us to manage your events & contributions
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <FormInput
              label="First Name"
              name="first_name"
              maxLength={50}
              error={errors.first_name}
            />

            <FormInput
              label="Last Name"
              name="last_name"
              maxLength={50}
              error={errors.last_name}
            />

            <FormInput
              label="Email Address"
              type="email"
              name="email"
              maxLength={50}
              error={errors.email}
            />

            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-control form-control-lg pe-5 ${errors.password ? 'is-invalid' : ''}`}
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
              <label className="form-label">Confirm Password</label>
              <div className="position-relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  className={`form-control form-control-lg pe-5 ${errors.confirm_password ? 'is-invalid' : ''}`}
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

            <button type="submit" className="btn btn-danger w-100 btn-lg mb-3">
              Create Account
            </button>
          </form>

          <div className="text-center">
            <small className="text-muted">
              Already have an account?{" "}
              <span 
                className="text-danger" 
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => navigate("/login")}
              >
                Sign in
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
              <h4 className="fw-bold mb-1">Create Account</h4>
              <p className="text-muted small">
                Join us to manage your events & contributions
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label small">First Name</label>
                <input
                  name="first_name"
                  maxLength={50}
                  className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                  required
                />
                {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
              </div>

              <div className="mb-2">
                <label className="form-label small">Last Name</label>
                <input
                  name="last_name"
                  maxLength={50}
                  className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                  required
                />
                {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
              </div>

              <div className="mb-2">
                <label className="form-label small">Email Address</label>
                <input
                  type="email"
                  name="email"
                  maxLength={50}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  required
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-2">
                <label className="form-label small">Password</label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`form-control pe-5 ${errors.password ? 'is-invalid' : ''}`}
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
                <label className="form-label small">Confirm Password</label>
                <div className="position-relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    className={`form-control pe-5 ${errors.confirm_password ? 'is-invalid' : ''}`}
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

              <button type="submit" className="btn btn-danger w-100 mb-3">
                Create Account
              </button>
            </form>

            <div className="text-center">
              <small className="text-muted">
                Already have an account?{" "}
                <span 
                  className="text-danger" 
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </span>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
