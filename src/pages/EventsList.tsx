import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import useApi from "../hooks/useApi";
import { FaShare, FaChartLine, FaHeart, FaFire, FaSearch, FaCircle } from "react-icons/fa";

interface Event {
  id: string;
  name: string;
  date: string;
  event_type: string;
  select_type: string;
  bride_groom_name?: string;
  total_amount?: number;
  created_at: string;
}

const EventsList = () => {
  const navigate = useNavigate();
  const { GetPaginatedData } = useApi();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const result = await GetPaginatedData("events", { 
        search: searchQuery.trim() 
      });
      setEvents(result.data || []);
    } catch (error) {
      console.error("Failed to fetch events", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchQuery]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getEventTypeIcon = (eventType: string) => {
    return eventType === "marriage" ? 
      <FaHeart className="text-danger" /> : 
      <FaFire className="text-warning" />;
  };

  const getSelectTypeBadge = (selectType: string) => {
    return selectType === "mukel" ? 
      <FaCircle className="text-danger" size={8} /> : 
      <FaCircle className="text-success" size={8} />;
  };

  return (
    <AppLayout title="Events" showBack>
      
      {/* Search Bar */}
      <div className="mb-3">
        <div className="input-group input-group-lg">
          <span className="input-group-text bg-white"><FaSearch /></span>
          <input
            className="form-control"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Create Event Button */}
      <div className="text-end mb-3">
        <button
          className="btn btn-danger btn-sm rounded-pill"
          onClick={() => navigate("/create-event")}
        >
          + Create Event
        </button>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-4">
          <div className="text-muted mb-3">
            {searchQuery ? `No events found for "${searchQuery}"` : "No events created yet"}
          </div>
          {!searchQuery && (
            <button
              className="btn btn-outline-danger rounded-pill"
              onClick={() => navigate("/create-event")}
            >
              Create Your First Event
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="card border-0 shadow-sm rounded-4 mb-3"
              style={{ cursor: "pointer" }}
              onClick={() => {
                // You can add navigation to event details page here
                console.log("Event clicked:", event);
              }}
            >
              <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center">
                  <span className="me-2 fs-4">{getEventTypeIcon(event.event_type)}</span>
                  <div>
                    <h6 className="fw-bold mb-0">{event.name}</h6>
                    <small className="text-muted">
                      {formatDate(event.date)}
                    </small>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-1">{getSelectTypeBadge(event.select_type)}</span>
                  <small className="text-muted text-capitalize">
                    {event.select_type}
                  </small>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <span className="badge bg-light text-dark text-capitalize rounded-pill px-3">
                    {event.event_type}
                  </span>
                  {event.bride_groom_name && (
                    <span className="ms-2 text-muted small">
                      {event.bride_groom_name}
                    </span>
                  )}
                  {event.total_amount && (
                    <span className="ms-2 fw-bold text-success">
                      ₹{event.total_amount.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary btn-sm rounded-pill flex-fill d-flex align-items-center justify-content-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/events/${event.id}/invitation`);
                  }}
                >
                  <FaShare className="me-2" size={12} />
                  <span className="fw-semibold">Invite</span>
                </button>
                <button
                  className="btn btn-success btn-sm rounded-pill flex-fill d-flex align-items-center justify-content-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/events/${event.id}/expenses`);
                  }}
                >
                  <FaChartLine className="me-2" size={12} />
                  <span className="fw-semibold">Expenses</span>
                </button>
              </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {events.length > 0 && (
        <div className="border-top pt-3 mt-3">
          <div className="row text-center">
            <div className="col-4">
              <div className="fw-bold">{events.length}</div>
              <small className="text-muted">Total Events</small>
            </div>
            <div className="col-4">
              <div className="fw-bold">
                {events.filter(e => e.event_type === "chandlo").length}
              </div>
              <small className="text-muted">Chandlo</small>
            </div>
            <div className="col-4">
              <div className="fw-bold">
                {events.filter(e => e.event_type === "marriage").length}
              </div>
              <small className="text-muted">Marriage</small>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default EventsList;