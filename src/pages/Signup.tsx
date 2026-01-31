import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import AppLayout from "../layouts/AppLayout";
import global from "../config/Global.json";
import { validateForm, commonRules } from "../utils/validation";
import type { ValidationErrors } from "../utils/validation";
import FormInput from "../components/ui/FormInput";

const Signup = () => {
  const navigate = useNavigate();
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
  groups: [],  // sending empty array here
};
    try {
      const apiUrl = global.api.host + global.api.createUser;
      await axios.post(apiUrl, payload);

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <AppLayout
      title="Welcome Back"
      subtitle="Create account to continue"
      // showBack
    >
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
    </AppLayout>
  );
};

export default Signup;
