import { useState, useEffect, useContext } from "react";
import AppLayout from "../layouts/AppLayout";
import useApi from "../hooks/useApi";
import AuthContext from "../contexts/AuthContext";

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

const Profile = () => {
  const { Get } = useApi();
  const { user, logOutUser } = useContext(AuthContext);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await Get("user", user?.user_id);
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

  

  if (loading) {
    return (
      <AppLayout title="Profile" showBack>
        <div className="text-center py-5">Loading...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Profile" showBack>
      <div className="border rounded p-4 mb-3" style={{ background: "#fff" }}>
        <div className="text-center mb-4">
          <div
            className="mx-auto mb-3"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#dc3545",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "2rem",
              fontWeight: "bold",
            }}
          >
            {userData?.first_name?.charAt(0) || "U"}
          </div>
          <h5 className="fw-bold mb-1">
            {userData?.first_name} {userData?.last_name}
          </h5>
          <small className="text-muted">{userData?.email}</small>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Username</label>
          <input
            type="text"
            className="form-control"
            value={userData?.username || ""}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input
            type="email"
            className="form-control"
            value={userData?.email || ""}
            disabled
          />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-6">
            <label className="form-label fw-semibold">First Name</label>
            <input
              type="text"
              className="form-control"
              value={userData?.first_name || ""}
              disabled
            />
          </div>
          <div className="col-6">
            <label className="form-label fw-semibold">Last Name</label>
            <input
              type="text"
              className="form-control"
              value={userData?.last_name || ""}
              disabled
            />
          </div>
        </div>
      </div>

      <button
        className="btn btn-danger w-100 btn-lg rounded-pill"
        onClick={() => logOutUser()}
      >
        Logout
      </button>
    </AppLayout>
  );
};

export default Profile;
