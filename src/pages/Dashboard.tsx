import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <AppLayout title="Chandlabook" subtitle="Welcome back, jitendra"  showProfile={true} >
      
      
      <div className="row g-3 mb-3">
        <div className="col-6">
          <div 
            className="card p-3 shadow-sm" 
            onClick={() => navigate("/add-record")}
            style={{ cursor: "pointer" }}
          >
            Add Record
          </div>
        </div>
        <div className="col-6">
          <div 
            className="card p-3 shadow-sm" 
            onClick={() => navigate("/guest-history")}
            style={{ cursor: "pointer" }}
          >
            View History
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-6">
          <div className="card p-3 shadow-sm">Today ₹300</div>
        </div>
        <div className="col-6">
          <div className="card p-3 shadow-sm">Upcoming ₹150</div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12">
          <div 
            className="card p-3 shadow-sm text-center" 
            onClick={() => navigate("/profile")}
            style={{ cursor: "pointer" }}
          >
            Profile
          </div>
        </div>
      </div>

    </AppLayout>
  );
};

export default Dashboard;
