import AppLayout from "../layouts/AppLayout";

const Signup = () => {
  return (
    <AppLayout
      title="Welcome Back"
      subtitle="Create account to continue"
      showBack
    >
      <div className="mb-3">
        <label className="form-label">First Name</label>
        <input className="form-control form-control-lg" />
      </div>

      <div className="mb-3">
        <label className="form-label">Last Name</label>
        <input className="form-control form-control-lg" />
      </div>

      <div className="mb-3">
        <label className="form-label">Email Address</label>
        <input type="email" className="form-control form-control-lg" />
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <input type="password" className="form-control form-control-lg" />
      </div>

      <div className="mb-4">
        <label className="form-label">Confirm Password</label>
        <input type="password" className="form-control form-control-lg" />
      </div>

      <button className="btn btn-danger w-100 btn-lg mb-3">
        Create Account
      </button>

      <p className="text-center text-muted mb-0">
        Already have an account?{" "}
        <span className="text-danger fw-semibold" style={{ cursor: "pointer" }}>
          Login
        </span>
      </p>
    </AppLayout>
  );
};

export default Signup;
