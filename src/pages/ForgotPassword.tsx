import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import global from "../config/Global.json";
import headerImg from "../assets/image/hederimage.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(30);
  const [customErr, setCustomErr] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isUserExist, setIsUserExist] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsUserExist(false);
    setEmailError("");
    setCustomErr(false);
  };

  const checkUserExist = async (email: string) => {
    const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    let err = false;
    
    if (!emailRegex.test(email)) {
      setCustomErr(true);
      setEmailError("Please enter a valid email.");
      err = true;
    } else {
      setCustomErr(false);
      setEmailError("");
    }

    if (!err) {
      try {
        const response = await axios.post(
          `${global.api.host}${global.api.userExist}`,
          { email }
        );
        if (response.data.exists) {
          setCustomErr(false);
          setEmailError("");
          setIsUserExist(true);
        } else {
          setCustomErr(true);
          setEmailError("This user account does not exist.");
          setIsUserExist(false);
        }
      } catch (error: unknown) {
        setEmailError("Error checking user existence.");
        toast.error("Error checking user existence.");
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isUserExist && !customErr) {
      try {
        setIsButtonDisabled(true);
        await axios.post(`${global.api.host}${global.api.passwordReset}`, { email });
        toast.success("Password reset request sent successfully.");
        setEmail("");
        setTimer(30);
        setShowTimer(true);
      } catch (error: unknown) {
        const errorMessage = (error as any).response?.data?.detail || 
                           (error as any).response?.data?.message ||
                           "Email service temporarily unavailable. Please try again later.";
        setCustomErr(true);
        setEmailError(errorMessage);
        setIsButtonDisabled(false);
        toast.error(errorMessage);
      }
    }
  };

  useEffect(() => {
    let interval: number | undefined;
    if (showTimer && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsButtonDisabled(false);
      setShowTimer(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, showTimer]);

  return (
    <div className="vh-100 d-flex">
      {/* Mobile Layout */}
      <div className="d-block d-md-none w-100 bg-white">
        <div className="p-3">
          <div className="mb-4">
            <img
              src={headerImg}
              alt="forgot password header"
              className="w-100"
              style={{
                height: 200,
                objectFit: "cover",
                borderRadius: "0 0 20px 20px",
              }}
            />
          </div>
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-1">Forgot Password?</h2>
            <p className="text-muted" style={{ fontSize: 14 }}>
              Enter your email to receive a password reset link
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={(e) => checkUserExist(e.target.value)}
                className={`form-control form-control-lg ${customErr ? 'is-invalid' : ''}`}
                placeholder="Enter your email"
                maxLength={50}
                required
              />
              {emailError && <div className="invalid-feedback">{emailError}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-danger w-100 btn-lg mb-3"
              disabled={isButtonDisabled || !isUserExist}
            >
              {isButtonDisabled ? "Sending..." : "Send Reset Link"}
            </button>
            
            {showTimer && timer > 0 && (
              <div className="text-center mb-3">
                <small className="text-muted">
                  Wait for {timer} seconds to request a new one.
                </small>
              </div>
            )}
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
              <h4 className="fw-bold mb-1">Forgot Password?</h4>
              <p className="text-muted small">
                Enter your email to receive a password reset link
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={(e) => checkUserExist(e.target.value)}
                  className={`form-control ${customErr ? 'is-invalid' : ''}`}
                  placeholder="Enter your email"
                  maxLength={50}
                  required
                />
                {emailError && <div className="invalid-feedback">{emailError}</div>}
              </div>

              <button
                type="submit"
                className="btn btn-danger w-100 mb-3"
                disabled={isButtonDisabled || !isUserExist}
              >
                {isButtonDisabled ? "Sending..." : "Send Reset Link"}
              </button>
              
              {showTimer && timer > 0 && (
                <div className="text-center mb-3">
                  <small className="text-muted">
                    Wait for {timer} seconds to request a new one.
                  </small>
                </div>
              )}
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

export default ForgotPassword;