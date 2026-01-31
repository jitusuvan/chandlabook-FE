import { useEffect, useState } from "react";

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
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        <div className="col-12 col-md-6 col-lg-4 mx-auto">
          <div 
            className={`h-100 d-flex align-items-center justify-content-center bg-danger ${
              fadeOut ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ 
              transition: 'opacity 0.5s ease-out',
              maxWidth: '430px'
            }}
          >
            <div className="text-center text-white px-4">
              <div className="mb-4">
                <div 
                  className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '80px', height: '80px' }}
                >
                  <span className="fs-1">📖</span>
                </div>
              </div>
              
              <h1 className="fw-bold mb-2" style={{ fontSize: '2rem' }}>
                ChandlaBook
              </h1>
              
              <p className="mb-4 opacity-75">
                Manage your events & contributions
              </p>
              
              <div className="spinner-border text-white" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;