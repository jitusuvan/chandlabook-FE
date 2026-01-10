import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import useApi from "../hooks/useApi";
import { FaEnvelope } from "react-icons/fa";

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
    return eventType === "marriage" ? "💒" : "🪔";
  };

  const getSelectTypeBadge = (selectType: string) => {
    return selectType === "mukel" ? "🔴" : "🟢";
  };

  return (
    <AppLayout title="Events" showBack>
      
      {/* Search Bar */}
      <div className="mb-3">
        <div className="input-group input-group-lg">
          <span className="input-group-text bg-white">🔍</span>
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
              className="border rounded p-3 mb-3"
              style={{ background: "#fff", cursor: "pointer" }}
              onClick={() => {
                // You can add navigation to event details page here
                console.log("Event clicked:", event);
              }}
            >
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

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="badge bg-light text-dark text-capitalize">
                    {event.event_type}
                  </span>
                  {event.bride_groom_name && (
                    <span className="ms-2 text-muted small">
                      {event.bride_groom_name}
                    </span>
                  )}
                  {event.total_amount && (
                    <span className="ms-2 fw-bold text-success">
                      ₹{event.total_amount}
                    </span>
                  )}
                </div>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/events/${event.id}/invitation`);
                    }}
                  >
                    <FaEnvelope className="me-1" />
                    Invite
                  </button>
                  <small className="text-muted">
                    Created {formatDate(event.created_at)}
                  </small>
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