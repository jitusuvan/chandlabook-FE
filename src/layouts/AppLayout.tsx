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
    <div className="vh-100 bg-light d-flex justify-content-center px-2 px-md-0">
      <div
        className="w-100 bg-white shadow-sm d-flex flex-column"
        style={{ maxWidth: 430, borderRadius: "16px", overflow: "hidden" }}
      >
        {/* HEADER */}
        <div
          className="bg-white text-black position-relative d-flex flex-column justify-content-center shadow-md flex-shrink-0"
          style={{ 
            padding: "10px 0"
          }}
        >
          
          {showBack && (
            <div
              className="position-absolute start-0 top-0 mt-2 ms-3"
              onClick={() => onBackClick ? onBackClick() : navigate(-1)}
              style={{
                width: "30px",
                height: "30px",
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
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#dc3545",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor:"pointer"
            }}
            >
               {userData?.first_name?.charAt(0) || "U"}
            
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
          <div className="p-3 p-md-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
