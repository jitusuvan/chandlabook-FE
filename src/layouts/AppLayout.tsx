import { useNavigate } from "react-router-dom";

type AppLayoutProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showProfile?: boolean;
  summaryCards?: React.ReactNode;
  children: React.ReactNode;
};

const AppLayout = ({ title, subtitle, showBack, showProfile, summaryCards, children }: AppLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-light d-flex justify-content-center align-items-start pt-3 pt-md-5 px-2 px-md-0">
      <div
        className="w-100 bg-white shadow-sm"
        style={{ maxWidth: 430, borderRadius: "16px", overflow: "hidden" }}
      >
        {/* RED HEADER */}
        <div
          className="bg-danger text-white position-relative d-flex flex-column justify-content-center"
          style={{ 
            minHeight: "180px", 
            height: "auto", 
            borderBottomLeftRadius: "16px", 
            borderBottomRightRadius: "16px",
            padding: "20px 0"
          }}
        >
          {showBack && (
            <div
              className="position-absolute start-0 top-0 mt-3 ms-3"
              onClick={() => navigate(-1)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              ←
            </div>
          )}

          {/* ✅ PROFILE ICON (only if showProfile=true) */}
          {showProfile && (
            <div
              className="position-absolute end-0 top-0 mt-3 me-3"
              onClick={() => navigate("/profile")}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#ffffff33",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              J
            </div>
          )}

          <div className="text-center px-3">
            <h4 className="fw-bold mb-1 fs-5 fs-md-4">{title}</h4>
            {subtitle && <p className="text-white-50 mb-0 small">{subtitle}</p>}
          </div>
          
          {summaryCards && (
            <div className="px-3">
              {summaryCards}
            </div>
          )}
        </div>

        <div className="p-3 p-md-4">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
