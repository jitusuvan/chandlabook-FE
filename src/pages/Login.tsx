import AppLayout from "../layouts/AppLayout";

const Login = () => {
  return (
    <AppLayout title="Welcome Back" subtitle="Sign in to continue">
      <div className="mb-3">
        <label>Email / Phone</label>
        <input className="form-control form-control-lg" />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input type="password" className="form-control form-control-lg" />
      </div>

      <div className="text-end text-danger mb-3">Forgot Password?</div>

      <button className="btn btn-danger w-100 btn-lg">Login</button>
    </AppLayout>
  );
};

export default Login;
