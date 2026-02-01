import { useNavigate } from "react-router-dom";
import { useState, useEffect,useContext } from "react";
import AuthContext from "../contexts/AuthContext";

import useApi from "../hooks/useApi";
type AppLayoutProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showProfile?: boolean;
  summaryCards?: React.ReactNode;
  children: React.ReactNode;
  onBackClick?: () => void;
};

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}
const AppLayout = ({ title, subtitle, showBack, showProfile, summaryCards, children, onBackClick }: AppLayoutProps) => {
  const navigate = useNavigate();
  
  const { Get } = useApi();
    const { user, } = useContext(AuthContext);
    const [, setLoading] = useState(true);
const [userData, setUserData] = useState<User | null>(null);
 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await Get("userProfile", user?.user_id);
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.user_id) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="vh-100 bg-light d-flex justify-content-center p-0">
      <div
        className="w-100 bg-white shadow-sm d-flex flex-column"
        style={{ 
          maxWidth: "100%", 
          borderRadius: "0", 
          overflow: "hidden"
        }}
      >
        {/* HEADER */}
        <div
          className="bg-white text-black position-relative d-flex flex-column justify-content-center shadow-sm flex-shrink-0"
          style={{ 
            padding: "16px 0",
            minHeight: "60px"
          }}
        >
          
          {showBack && (
            <div
              className="position-absolute start-0 top-50 translate-middle-y ms-3"
              onClick={() => onBackClick ? onBackClick() : navigate(-1)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "bold",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.2)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              ←
            </div>
          )}

          {/* ✅ PROFILE ICON (only if showProfile=true) */}
          {showProfile && (
            <div
              className="position-absolute end-0 top-50 translate-middle-y me-3"
              onClick={() => navigate("/profile")}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#dc3545",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(220, 53, 69, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(220, 53, 69, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(220, 53, 69, 0.3)";
              }}
            >
              {userData?.first_name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <div className="text-center px-3">
          <h4 className="fw-semibold mb-1 fs-6">{title}</h4>
            {subtitle && <p className="text-white-30 mb-0 small">{subtitle}</p>}
          </div>
          
          {summaryCards && (
            <div className="px-3">
              {summaryCards}
            </div>
          )}
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-grow-1 overflow-auto" style={{ minHeight: 0 }}>
          <div className="p-3 p-md-4 p-lg-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
