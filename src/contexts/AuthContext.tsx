import React, {
  createContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode, FormEvent } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import global from "../config/Global.json";

interface AuthToken {
  access: string;
  refresh: string;
}

interface User {
  [key: string]: any;
}

interface AuthContextType {
  user: User;
  authToken: AuthToken | null;
  isAuthenticated: boolean;
  loginUser: (e: FormEvent<HTMLFormElement>) => void;
  autoLogin: (username: string, password: string) => Promise<boolean>;
  signupUser: (userData: any) => Promise<boolean>;
  logOutUser: (message?: string) => void;
  setAuthToken: (token: AuthToken | null) => void;
  setUser: (user: User) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | any>(undefined);

export default AuthContext;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const getAPI = (API_NAME: string): string =>
    global.api.host + global.api[API_NAME as keyof typeof global.api];

  const [authToken, setAuthToken] = useState<AuthToken | null>(null);
  const [user, setUser] = useState<User>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const performLogin = async (username: string, password: string, showToast = true) => {
    try {
      const response = await axios.post(getAPI("token"), { username, password });
      const tokenData: AuthToken = response.data;

      let decoded: any = {};
      try {
        decoded = jwtDecode(tokenData.access);
      } catch {
        if (showToast) toast.error("Invalid token received.");
        return false;
      }

      const roles: string[] = decoded.roles || [];

      setAuthToken(tokenData);
      setUser(decoded);
      setIsAuthenticated(true);

      localStorage.setItem("authToken", JSON.stringify(tokenData));
      localStorage.setItem("user_type", "Student");
      localStorage.setItem("role", JSON.stringify(roles));

      const settings = JSON.parse(localStorage.getItem("settings") || "{}");
      if (settings.default_login_step_report_page) {
        localStorage.setItem("firstLoginAfterSettingFlag", "true");
      }

      if (showToast) toast.success("Login successful! Welcome back!");
      navigate("/");
      return true;
    } catch (error: any) {
      if (showToast) {
        const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           "Login failed.";
        toast.error(errorMessage);
      }
      console.error(error);
      return false;
    }
  };

  const loginUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    await performLogin(username, password);
  };

  const autoLogin = async (username: string, password: string): Promise<boolean> => {
    return await performLogin(username, password, false);
  };

  const signupUser = async (userData: any) => {
    try {
      const response = await axios.post(getAPI("createUser"), userData);
      const successMessage = response.data?.message || "User created successfully!";
      toast.success(successMessage);
      navigate("/login");
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         "Signup failed.";
      toast.error(errorMessage);
      console.error(error);
      return false;
    }
  };

  // AuthProvider: logOutUser
  const logOutUser = (message?: string) => {
    const isPasswordResetPage = !!matchPath(
      { path: "/auth/pass-reset/:temp_token" },
      location.pathname
    );

    if (!isPasswordResetPage) {
      setAuthToken(null);
      setUser({});
      setIsAuthenticated(false);

      // Clear all authentication related data from localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user_type");
      localStorage.removeItem("role");
      localStorage.removeItem("settings");
      localStorage.removeItem("firstLoginAfterSettingFlag");
      
      // Clear any other app-specific data that might persist user session
      localStorage.clear();

      if (message) {
        // use a fixed id so duplicates don't stack
        toast.error(message, { id: "logout-toast" });
      }

      navigate("/login", { replace: true });
    } else if (message) {
      toast.error(message, { id: "logout-toast" });
    }
  };

  const verifyTokenWithBackend = async (token: string): Promise<boolean> => {
    try {
      const response = await axios.get(getAPI("userProfile"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.status === 200;
    } catch (error: any) {
      // If 401/403/404, user doesn't exist or token invalid
      if (error.response?.status === 401 || error.response?.status === 403 || error.response?.status === 404) {
        return false;
      }
      return false;
    }
  };

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const refreshTokens = async (refreshToken?: string): Promise<boolean> => {
    const refresh = refreshToken || authToken?.refresh;
    if (!refresh) return false;

    try {
      const response = await axios.post(getAPI("refreshToken"), { refresh });
      const newToken: AuthToken = response.data;

      setAuthToken(newToken);

      try {
        setUser(jwtDecode(newToken.access));
      } catch {
        setUser({});
      }

      localStorage.setItem("authToken", JSON.stringify(newToken));
      setIsAuthenticated(true);

      return true;
    } catch (err) {
      console.error("Refresh failed:", err);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const publicRoutes = [
        "/login",
        "/signup",
        "/forgot-password",
      ];

      const isPublicRoute = publicRoutes.some((route) =>
        matchPath({ path: route }, location.pathname)
      ) || matchPath({ path: "/reset-password/:temp_token" }, location.pathname);

      const storedToken = localStorage.getItem("authToken");

      if (storedToken) {
        try {
          const tokenData: AuthToken = JSON.parse(storedToken);

          if (!isTokenExpired(tokenData.access)) {
            // Verify token with backend to ensure user still exists
            const isValidUser = await verifyTokenWithBackend(tokenData.access);
            
            if (isValidUser) {
              setAuthToken(tokenData);
              try {
                setUser(jwtDecode(tokenData.access));
              } catch {
                setUser({});
              }
              setIsAuthenticated(true);
            } else {
              // User account deleted or token invalid
              localStorage.clear();
              setAuthToken(null);
              setUser({});
              setIsAuthenticated(false);
              if (!isPublicRoute) {
                navigate("/login", { replace: true });
              }
            }
          } else {
            console.log("Token expired, attempting refresh...");
            const refreshed = await refreshTokens(tokenData.refresh);
            if (!refreshed) {
              console.log("Refresh failed");
              // Clear all localStorage data when refresh fails
              localStorage.clear();
              if (!isPublicRoute) {
                logOutUser("Session expired.");
              }
            } else {
              console.log("Token refreshed successfully");
            }
          }
        } catch (error) {
          console.error("Error parsing token:", error);
          // Clear all localStorage data on token parsing error
          localStorage.clear();
          if (!isPublicRoute) {
            logOutUser();
          }
        }
      } else {
        // No token found - ensure user is logged out
        setAuthToken(null);
        setUser({});
        setIsAuthenticated(false);
        
        if (!isPublicRoute) {
          navigate("/login", { replace: true });
        }
      }

      setLoading(false);
    };

    initializeAuth();

    const interval = setInterval(async () => {
      const stored = localStorage.getItem("authToken");
      if (!stored) return;

      let tokenData: AuthToken;
      try {
        tokenData = JSON.parse(stored);
      } catch {
        return;
      }

      try {
        const decoded: any = jwtDecode(tokenData.access);
        const timeUntilExpiry = decoded.exp * 1000 - Date.now();

        if (timeUntilExpiry < 2 * 60 * 1000) {
          await refreshTokens(tokenData.refresh);
        }
      } catch {
        await refreshTokens(tokenData.refresh);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        isAuthenticated,
        loginUser,
        autoLogin,
        signupUser,
        logOutUser,
        setAuthToken,
        setUser,
        loading,
      }}
    >
      {children}
      <Toaster position="top-right" />
    </AuthContext.Provider>
  );
};
