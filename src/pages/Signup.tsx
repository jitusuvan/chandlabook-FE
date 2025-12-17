import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import AppLayout from "../layouts/AppLayout";
import global from "../config/Global.json";

const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
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
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            name="first_name"
            className="form-control form-control-lg"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            name="last_name"
            className="form-control form-control-lg"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            className="form-control form-control-lg"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control form-control-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            name="confirm_password"
            className="form-control form-control-lg"
            required
          />
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
