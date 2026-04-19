import { useEffect, useState } from "react";
import logoImg from "../assets/image/cb7.png";

type SplashScreenProps = {
  onComplete: () => void;
  duration?: number;
};

const SplashScreen = ({ onComplete, duration = 3000 }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-danger overflow-hidden">
      <div
        className={`text-center text-white px-4 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
        style={{
          transition: "opacity 0.5s ease-out",
        }}
      >
        <div className="mb-4">
          <div
            className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: "95px",
              height: "95px",
              animation: "pulseZoom 1.2s infinite ease-in-out",
              boxShadow: "0 8px 20px rgba(0,0,0,0.20)",
            }}
          >
            <img
              src={logoImg}
              alt="Logo"
              style={{
                width: "62px",
                height: "62px",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        <h1
          className="fw-bold mb-2"
          style={{
            fontSize: "2rem",
            letterSpacing: "1px",
          }}
        >
          ChandlaBook
        </h1>

        <p className="mb-4 opacity-75">
          Manage your events & contributions
        </p>

        <style>
          {`
            @keyframes pulseZoom {
              0% { transform: scale(1); }
              50% { transform: scale(1.12); }
              100% { transform: scale(1); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default SplashScreen;