import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import toast from "react-hot-toast";

import AppLayout from "../layouts/AppLayout";
import useApi from "../hooks/useApi";

const Signup = () => {
  const navigate = useNavigate();
  const { Post } = useApi();

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
      username: formData.get("email"), // 👈 email ko username bana do
      email: formData.get("email"),
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      password,
      // groups
    };
    try {
      // 🔥 ONLY "user" API (from Global.json)
      await Post("user", payload);

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
    </AppLayout>
  );
};

export default Signup;
