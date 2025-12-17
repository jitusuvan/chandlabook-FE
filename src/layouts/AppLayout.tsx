import { useNavigate } from "react-router-dom";

type AppLayoutProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showProfile?: boolean;   // ✅ NEW
  children: React.ReactNode;
};

const AppLayout = ({ title, subtitle, showBack, showProfile, children }: AppLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-light d-flex justify-content-center align-items-start pt-5">
      <div
        className="w-100 bg-white shadow-sm"
        style={{ maxWidth: 430, borderRadius: 24, overflow: "hidden" }}
      >
        {/* RED HEADER */}
        <div
          className="bg-danger text-white position-relative d-flex flex-column justify-content-center"
          style={{ height: 220, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
        >
          {showBack && (
            <span
              className="position-absolute start-0 top-50 translate-middle-y ms-3 fs-4"
              onClick={() => navigate(-1)}
              style={{ cursor: "pointer" }}
            >
              ←
            </span>
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

          <div className="text-center">
            <h4 className="fw-bold mb-1">{title}</h4>
            {subtitle && <p className="text-white-50 mb-0">{subtitle}</p>}
          </div>
        </div>

        <div className="p-4 px-3 px-md-4">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
