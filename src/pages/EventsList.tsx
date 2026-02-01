import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import useApi from "../hooks/useApi";
import AuthContext from "../contexts/AuthContext";
import {  FaChartLine, FaHeart, FaFire, FaCircle, FaEdit, FaTrash } from "react-icons/fa";
import SearchInput from "../components/ui/SearchInput";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

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
  const { GetPaginatedData, Delete, Patch } = useApi();
  const { authToken } = useContext(AuthContext) || {};
  const [events, setEvents] = useState<Event[]>([]);
  const [, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchEvents = async (isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setEvents([]);
      } else {
        setLoadingMore(true);
      }
      
      let result;
      if (isLoadMore && nextPage) {
        // Use the full URL for next page
        const response = await fetch(nextPage, {
          headers: {
            'Authorization': `Bearer ${authToken?.access}`
          }
        });
        result = await response.json();
        result = {
          data: result.results,
          nextPage: result.next
        };
      } else {
        result = await GetPaginatedData("events", { 
          search: searchQuery.trim()
        });
      }
      
      if (isLoadMore) {
        setEvents(prev => [...prev, ...(result.data || [])]);
      } else {
        setEvents(result.data || []);
        if (!searchQuery.trim()) {
          setAllEvents(result.data || []);
        }
      }
      
      setNextPage(result.nextPage);
      setHasMore(!!result.nextPage);
    } catch (error) {
      console.error("Failed to fetch events", error);
      if (!isLoadMore) setEvents([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreEvents = () => {
    if (hasMore && !loadingMore) {
      fetchEvents(true);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchQuery]);

  const handleEdit = async (event: Event) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Event',
      html: `
        <div class="mb-3">
          <label class="form-label">Event Name</label>
          <input id="swal-input1" class="form-control" value="${event.name}">
        </div>
        <div class="mb-3">
          <label class="form-label">Event Date</label>
          <input id="swal-input2" type="date" class="form-control" value="${event.date}">
        </div>
        <div class="mb-3">
          <label class="form-label">Event Type</label>
          <select id="swal-input3" class="form-select">
            <option value="chandlo" ${event.event_type === 'chandlo' ? 'selected' : ''}>Chandlo</option>
            <option value="marriage" ${event.event_type === 'marriage' ? 'selected' : ''}>Marriage</option>
          </select>
        </div>
        <div class="mb-3" id="bride-groom-div" style="display: ${event.event_type === 'marriage' ? 'block' : 'none'}">
          <label class="form-label">Bride & Groom Name</label>
          <input id="swal-input4" class="form-control" value="${event.bride_groom_name || ''}">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancel',
      didOpen: () => {
        const eventTypeSelect = document.getElementById('swal-input3') as HTMLSelectElement;
        const brideGroomDiv = document.getElementById('bride-groom-div');
        eventTypeSelect.addEventListener('change', () => {
          if (brideGroomDiv) {
            brideGroomDiv.style.display = eventTypeSelect.value === 'marriage' ? 'block' : 'none';
          }
        });
      },
      preConfirm: () => {
        const name = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const date = (document.getElementById('swal-input2') as HTMLInputElement).value;
        const event_type = (document.getElementById('swal-input3') as HTMLSelectElement).value;
        const bride_groom_name = (document.getElementById('swal-input4') as HTMLInputElement).value;
        
        if (!name || !date) {
          Swal.showValidationMessage('Please fill all required fields');
          return false;
        }
        
        return { name, date, event_type, bride_groom_name };
      }
    });

    if (formValues) {
      try {
        await Patch("events", event.id, formValues);
        toast.success('Event updated successfully!');
        fetchEvents();
      } catch (error) {
        toast.error('Failed to update event');
      }
    }
  };

  const handleDelete = async (event: Event) => {
    const result = await Swal.fire({
      title: 'Delete Event',
      text: `Are you sure you want to delete "${event.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await Delete("events",event.id);
        Swal.fire('Deleted!', 'Event has been deleted.', 'success');
        fetchEvents();
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete event', 'error');
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

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
      
      <div className="mb-3">
        <SearchInput
          placeholder="Search events..."
          value={searchQuery}
          onChange={handleSearch}
        />
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
                {/* <button
                  className="btn btn-primary btn-sm rounded-pill flex-fill d-flex align-items-center justify-content-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/events/${event.id}/invitation`);
                  }}
                >
                  <FaShare className="me-2" size={12} />
                  <span className="fw-semibold">Invite</span>
                </button> */}
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
                <button
                  className="btn btn-warning btn-sm rounded-pill d-flex align-items-center justify-content-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(event);
                  }}
                >
                  <FaEdit size={12} />
                </button>
                <button
                  className="btn btn-danger btn-sm rounded-pill d-flex align-items-center justify-content-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(event);
                  }}
                >
                  <FaTrash size={12} />
                </button>
              </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && events.length > 0 && (
        <div className="text-center mt-3">
          <button
            className="btn btn-outline-danger rounded-pill"
            onClick={loadMoreEvents}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Loading...
              </>
            ) : (
              "Load More Events"
            )}
          </button>
        </div>
      )}

     
    </AppLayout>
  );
};

export default EventsList;