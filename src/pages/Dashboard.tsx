import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import DashboardCard from "../components/ui/DashboardCard";
import {
  FaPlus,
  FaUsers,
  FaCalendarAlt,
  FaRupeeSign,
  FaClock,
  FaCalendarDay,
  FaChevronDown
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

type EventRecord = {
  id: string;
  guest_name: string;
  date: string;
  event_type: string;
  bride_groom: string | null;
  amount: string;
  select: string;
  pay_later: boolean;
};


const Dashboard = () => {
  const navigate = useNavigate();

  const { Get, GetPaginatedData } = useApi();
  const [loading, setLoading] = useState(true);
  const [todayEvents, setTodayEvents] = useState<EventRecord[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventRecord[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [todayPage, setTodayPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [hasMoreToday, setHasMoreToday] = useState(false);
  const [hasMoreUpcoming, setHasMoreUpcoming] = useState(false);
  const [loadingMoreToday, setLoadingMoreToday] = useState(false);
  const [loadingMoreUpcoming, setLoadingMoreUpcoming] = useState(false);
  const [activeTab, setActiveTab] = useState<"today" | "upcoming">("today");
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
    fetchTodayEvents();
    fetchUpcomingEvents();
  }, []);
const fetchTodayEvents = async () => {
  try {
    const result = await GetPaginatedData("today", { page: 1 });
    setTodayEvents(result.data || []);
    setHasMoreToday(!!result.nextPage);
  } catch (error) {
    console.error("Today API Error ❌", error);
  }
};

const fetchUpcomingEvents = async () => {
  try {
    const result = await GetPaginatedData("upcoming", { page: 1 });
    setUpcomingEvents(result.data || []);
    setHasMoreUpcoming(!!result.nextPage);
  } catch (error) {
    console.error("Upcoming API Error ❌", error);
  } finally {
    setLoadingEvents(false);
  }
};

const loadMoreToday = async () => {
  if (!hasMoreToday || loadingMoreToday) return;
  setLoadingMoreToday(true);
  try {
    const result = await GetPaginatedData("today", { page: todayPage + 1 });
    setTodayEvents(prev => [...prev, ...(result.data || [])]);
    setTodayPage(prev => prev + 1);
    setHasMoreToday(!!result.nextPage);
  } catch (error) {
    console.error("Load More Today Error ❌", error);
  } finally {
    setLoadingMoreToday(false);
  }
};

const loadMoreUpcoming = async () => {
  if (!hasMoreUpcoming || loadingMoreUpcoming) return;
  setLoadingMoreUpcoming(true);
  try {
    const result = await GetPaginatedData("upcoming", { page: upcomingPage + 1 });
    setUpcomingEvents(prev => [...prev, ...(result.data || [])]);
    setUpcomingPage(prev => prev + 1);
    setHasMoreUpcoming(!!result.nextPage);
  } catch (error) {
    console.error("Load More Upcoming Error ❌", error);
  } finally {
    setLoadingMoreUpcoming(false);
  }
};

  return (
    <AppLayout title="Dashboard" showProfile={true}>
      
      {/* 🔴 SUMMARY CARD */}
      <div className="card border-0 shadow-sm mb-4 bg-danger text-white rounded-4">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex justify-content-between">
            <div className="text-center flex-fill">
              <small className="opacity-75">ACTIVE EVENTS</small>
              <div className="fw-semibold fs-5 fs-md-4">{loading ? "--" : summary.total_events}</div>
            </div>
            <div className="text-center flex-fill">
              <small className="opacity-75">TOTAL GUESTS</small>
              <div className="fw-semibold fs-5 fs-md-4">{loading ? "--" : summary.total_guests}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ⚡ QUICK ACTIONS */}
      <h6 className="fw-semibold mb-2">Quick Actions</h6>

      <div className="row g-2 g-md-3 mb-3">
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
          icon={<FaCalendarAlt />}
          label="Events"
          color="info"
          onClick={() => navigate("/events")}
        />
        

        <DashboardCard
          icon={<FaRupeeSign />}
          label="Expenses"
          color="warning"
          onClick={() => navigate("/expenses")}
        />
      </div>

      {/* 📅 TABS */}
      <div className="mt-4">
        <div className="d-flex gap-2 gap-md-3 mb-3">
          <button 
            className={`btn btn-sm rounded-pill flex-fill d-flex align-items-center justify-content-center ${activeTab === "today" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("today")}
            style={{ padding: "8px 16px", fontSize: "14px", fontWeight: "500" }}
          >
            <FaCalendarDay className="me-2" size={14} />
            Today
          </button>
          <button 
            className={`btn btn-sm rounded-pill flex-fill d-flex align-items-center justify-content-center ${activeTab === "upcoming" ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => setActiveTab("upcoming")}
            style={{ padding: "8px 16px", fontSize: "14px", fontWeight: "500" }}
          >
            <FaClock className="me-2" size={14} />
            Upcoming
          </button>
        </div>

        {activeTab === "today" ? (
          <div>
            {loadingEvents ? (
              <div className="text-center py-3 text-muted">Loading...</div>
            ) : todayEvents.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 bg-light">
                <div className="card-body text-center py-4 text-muted">No events today</div>
              </div>
            ) : (
              <>
                <div className="row g-3 g-md-4">
                  {todayEvents.map((event) => (
                    <div key={event.id} className="col-12 col-md-6 col-lg-4">
                      <div className="card shadow-sm rounded-4 border-start border-primary border-4">
                        <div className="card-body p-3 p-md-4">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="fw-bold mb-1">{event.guest_name}</h6>
                              <small className="text-muted d-block">
                                {event.event_type === "chandlo" ? "Chandlo" : "Marriage"}
                                {event.bride_groom && ` - ${event.bride_groom}`}
                              </small>
                              <div className="d-flex align-items-center gap-2 mt-2">
                                <span className={`badge ${event.select === "aavel" ? "bg-success" : "bg-danger"}`}>
                                  {event.select === "aavel" ? "Aavel" : "Mukel"}
                                </span>
                                <span className="fw-bold text-success">₹{event.amount}</span>
                                {event.pay_later && (
                                  <span className="badge bg-warning text-dark">
                                    <FaClock className="me-1" size={10} />Pay Later
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {hasMoreToday && (
                  <div className="text-center mt-3">
                    <button 
                      className="btn btn-outline-primary btn-sm rounded-pill"
                      onClick={loadMoreToday}
                      disabled={loadingMoreToday}
                    >
                      {loadingMoreToday ? "Loading..." : <><FaChevronDown className="me-1" />Load More</>}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div>
            {loadingEvents ? (
              <div className="text-center py-3 text-muted">Loading...</div>
            ) : upcomingEvents.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 bg-light">
                <div className="card-body text-center py-4 text-muted">No upcoming events</div>
              </div>
            ) : (
              <>
                <div className="row g-3 g-md-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="col-12 col-md-6 col-lg-4">
                      <div className="card shadow-sm rounded-4 border-start border-warning border-4">
                        <div className="card-body p-3 p-md-4">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="fw-bold mb-1">{event.guest_name}</h6>
                              <small className="text-muted d-block mb-1">
                                {event.event_type === "chandlo" ? "Chandlo" : "Marriage"}
                                {event.bride_groom && ` - ${event.bride_groom}`}
                              </small>
                              <small className="text-muted d-block mb-2">
                                <FaCalendarAlt className="me-1" size={10} />
                                {new Date(event.date).toLocaleDateString()}
                              </small>
                              <div className="d-flex align-items-center gap-2">
                                <span className={`badge ${event.select === "aavel" ? "bg-success" : "bg-danger"}`}>
                                  {event.select === "aavel" ? "Aavel" : "Mukel"}
                                </span>
                                <span className="fw-bold text-success">₹{event.amount}</span>
                                {event.pay_later && (
                                  <span className="badge bg-warning text-dark">
                                    <FaClock className="me-1" size={10} />Pay Later
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {hasMoreUpcoming && (
                  <div className="text-center mt-3">
                    <button 
                      className="btn btn-outline-warning btn-sm rounded-pill"
                      onClick={loadMoreUpcoming}
                      disabled={loadingMoreUpcoming}
                    >
                      {loadingMoreUpcoming ? "Loading..." : <><FaChevronDown className="me-1" />Load More</>}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
