import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useApi from "../hooks/useApi";
import { confirmDelete } from "../utils/sweetAlert";
import { FaSearch, FaEdit, FaTrash, FaUser, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  surname: string;
  mobile_no: string;
  city: string;
}

interface GuestListProps {
  onSelectGuest: (guest: Guest) => void;
}

const GuestList = ({ onSelectGuest }: GuestListProps) => {
  const { GetPaginatedData, Patch, Delete } = useApi();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    surname: "",
    mobile_no: "",
    city: ""
  });

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const result = await GetPaginatedData("guest");
        setGuests(result.data);
        setAllGuests(result.data);
        setHasNextPage(!!result.nextPage);
      } catch (error) {
        console.error("Failed to fetch guests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMoreGuests = async () => {
    if (!hasNextPage || loadingMore) return;
    
    setLoadingMore(true);
    try {
      const result = await GetPaginatedData("guest", { page: currentPage + 1 });
      setGuests(prev => [...prev, ...result.data]);
      setCurrentPage(prev => prev + 1);
      setHasNextPage(!!result.nextPage);
    } catch (error) {
      console.error("Failed to load more guests", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setGuests(allGuests);
      return;
    }

    try {
      const result = await GetPaginatedData("guest", { search: query });
      setGuests(result.data);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setEditForm({
      first_name: guest.first_name,
      last_name: guest.last_name || "",
      surname: guest.surname,
      mobile_no: guest.mobile_no,
      city: guest.city
    });
  };

  const handleUpdateGuest = async () => {
    if (!editingGuest) return;
    
    try {
      await Patch("guest", editingGuest.id, editForm);
      
      setGuests(guests.map(guest => 
        guest.id === editingGuest.id 
          ? { ...guest, ...editForm }
          : guest
      ));
      
      setEditingGuest(null);
      toast.success("Guest updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update guest");
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    const confirmed = await confirmDelete("This guest will be permanently deleted!");
    if (!confirmed) return;
    
    try {
      await Delete("guest", guestId);
      
      setGuests(guests.filter(guest => guest.id !== guestId));
      toast.success("Guest deleted successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete guest");
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (guests.length === 0 && !loading && searchQuery.trim().length >= 2) {
    return (
      <>
        <div className="input-group input-group-lg mb-3">
          <span className="input-group-text bg-white border-end-0">
            <FaSearch className="text-muted" />
          </span>
          <input
            className="form-control border-start-0 rounded-end-4"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="text-center py-5 text-muted">
          No guests found for "{searchQuery}"
        </div>
      </>
    );
  }

  if (guests.length === 0 && !loading) {
    return <div className="text-center py-5 text-muted">No guests found</div>;
  }

  return (
    <>
      <div className="input-group input-group-lg mb-3">
        <span className="input-group-text bg-white border-end-0">
          <FaSearch className="text-muted" />
        </span>
        <input
          className="form-control border-start-0 rounded-end-4"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {guests.map((guest) => (
        <div
          key={guest.id}
          className="card border-0 shadow-sm rounded-4 mb-3"
          style={{ transition: "all 0.2s ease" }}
        >
          <div className="card-body p-3">
            <div 
              className="cursor-pointer"
              onClick={() => onSelectGuest(guest)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center mb-2">
                <div className="bg-primary rounded-circle p-2 me-3">
                  <FaUser className="text-white" size={16} />
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1 fw-bold">
                    {guest.first_name} {guest.last_name} {guest.surname}
                  </h6>
                  <div className="d-flex align-items-center text-muted small">
                    <FaMapMarkerAlt className="me-1" size={12} />
                    <span className="me-3">{guest.city}</span>
                    <FaPhone className="me-1" size={12} />
                    <span>{guest.mobile_no}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-primary btn-sm rounded-pill flex-fill d-flex align-items-center justify-content-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditGuest(guest);
                }}
              >
                <FaEdit className="me-1" size={12} />
                <span>Edit</span>
              </button>
              <button 
                className="btn btn-outline-danger btn-sm rounded-pill flex-fill d-flex align-items-center justify-content-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteGuest(guest.id);
                }}
              >
                <FaTrash className="me-1" size={12} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {hasNextPage && !searchQuery && (
        <div className="text-center mt-3">
          <button 
            className="btn btn-outline-primary"
            onClick={loadMoreGuests}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
      
      {/* Edit Modal */}
      {editingGuest && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Guest</h5>
                <button 
                  className="btn-close" 
                  onClick={() => setEditingGuest(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">First Name</label>
                  <input
                    className="form-control"
                    value={editForm.first_name}
                    onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-control"
                    value={editForm.last_name}
                    onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Surname</label>
                  <input
                    className="form-control"
                    value={editForm.surname}
                    onChange={(e) => setEditForm({...editForm, surname: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mobile No</label>
                  <input
                    className="form-control"
                    value={editForm.mobile_no}
                    onChange={(e) => setEditForm({...editForm, mobile_no: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">City</label>
                  <input
                    className="form-control"
                    value={editForm.city}
                    onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setEditingGuest(null)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleUpdateGuest}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GuestList;