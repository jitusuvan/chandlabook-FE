import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import DashboardCard from "../components/ui/DashboardCard";
import {
  FaPlus,
  FaCalendarPlus,
  FaUsers,
  // FaChartBar,
  FaWallet,
  // FaCalendarDay,
  // FaCalendarWeek,
  FaCalendarAlt,
  FaEnvelope,
  FaRupeeSign
} from "react-icons/fa";
import { useState, useEffect } from "react";


import useApi from "../hooks/useApi";
type DashboardSummary = {
  total_events: number;
  total_guests: number;
  total_records: number;
  total_amount: number;
  aavel_total: number;
  mukel_total: number;
  difference: number;
};


const Dashboard = () => {
  const navigate = useNavigate();

  const { Get } = useApi();
  const [loading, setLoading] = useState(true);
const [summary, setSummary] = useState<DashboardSummary>({
  total_events: 0,
  total_guests: 0,
  total_records: 0,
  total_amount: 0,
  aavel_total: 0,
  mukel_total: 0,
  difference: 0,
});
  const fetchDashboardSummary = async () => {
  try {
    setLoading(true);
    const response = await Get("dashboard");
    //  DEBUG
    console.log("Dashboard summary response 👉", response);
    console.log("Response data 👉", response?.data);
    console.log("Total guests 👉", response?.data?.total_guests);

    setSummary({
      total_events: response?.total_events || 0,
      total_guests: response?.total_guests || 0,
      total_records: response?.total_records || 0,
      total_amount: response?.total_amount || 0,
      aavel_total: response?.aavel_total || 0,
      mukel_total: response?.mukel_total || 0,
      difference: response?.difference || 0,
    });
  } catch (error) {
    console.error("Dashboard summary fetch failed ❌", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  return (
    <AppLayout title="Dashboard" showProfile>
      
      {/* 🔴 SUMMARY CARD */}
      <div className="card border-0 shadow-sm mb-4 bg-danger text-white rounded-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="opacity-75">TOTAL CONTRIBUTIONS</small>
            <div className="bg-white bg-opacity-25 p-2 rounded-3">
              <FaWallet />
            </div>
          </div>

          <h2 className="fw-bold mb-3">₹ 4,50,250</h2>

          <div className="d-flex justify-content-between">
            <div>
              <small className="opacity-75">ACTIVE EVENTS</small>
              <div className="fw-semibold">{loading ? "--" : summary.total_events}</div>
            </div>
            <div>
              <small className="opacity-75">TOTAL GUESTS</small>
              <div className="fw-semibold">{loading ? "--" : summary.total_guests}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ⚡ QUICK ACTIONS */}
      <h6 className="fw-semibold mb-3">Quick Actions</h6>

      <div className="row g-3">
        <DashboardCard
          icon={<FaPlus />}
          label="New Entry"
          color="danger"
          onClick={() => navigate("/add-record")}
        />

       <DashboardCard
          icon={<FaUsers />}
          label="Guest Record"
          color="primary"
          onClick={() => navigate("/guest-history")}
        />

        <DashboardCard
          icon={<FaCalendarPlus />}
          label="Add Event"
          color="warning"
          onClick={() => navigate("/create-event")}
        />

        <DashboardCard
          icon={<FaCalendarAlt />}
          label="View Events"
          color="info"
          onClick={() => navigate("/events")}
        />
        
        <DashboardCard
          icon={<FaEnvelope />}
          label="Invitations"
          color="success"
          onClick={() => navigate("/events")}
        />
        
        <DashboardCard
          icon={<FaRupeeSign />}
          label="Expenses"
          color="warning"
          onClick={() => navigate("/expenses")}
        />
        
       

        {/* <DashboardCard
          icon={<FaCalendarDay />}
          label="Today"
          color="secondary"
          onClick={() => navigate("/today")}
        /> */}

        {/* <DashboardCard
          icon={<FaCalendarWeek />}
          label="Upcoming"
          color="secondary"
          onClick={() => navigate("/upcoming")}
        /> */}
         
      </div>
    </AppLayout>
  );
};

export default Dashboard;
