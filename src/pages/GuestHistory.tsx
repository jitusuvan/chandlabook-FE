import { useState, useEffect } from "react";
import AppLayout from "../layouts/AppLayout";
import useApi from "../hooks/useApi";

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  surname: string;
  mobile_no: string;
  city: string;
}

interface GuestRecord {
  id: string;
  date: string;
  amount: string;
  select: string;
  event: string;
  bride_groom: string | null;
  guest: string;
}

const GuestHistory = () => {
  const { Get } = useApi();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [records, setRecords] = useState<GuestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const data = await Get("guest");
        setGuests(data.results || data);
      } catch (error) {
        console.error("Failed to fetch guests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectGuest = async (guest: Guest) => {
    setSelectedGuest(guest);
    setLoadingRecords(true);
    try {
      const data = await Get("guestRecord", `?guest=${guest.id}`);
      setRecords(data.results || data);
    } catch (error) {
      console.error("Failed to fetch records", error);
    } finally {
      setLoadingRecords(false);
    }
  };

  if (loading) {
    return (
      <AppLayout title="History" showBack>
        <div className="text-center py-5">Loading...</div>
      </AppLayout>
    );
  }

  if (guests.length === 0 && !loading) {
    return (
      <AppLayout title="History" showBack>
        <div className="text-center py-5 text-muted">No guests found</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="History" showBack>
      {!selectedGuest ? (
        <>
          <input
            className="form-control mb-3"
            placeholder="Search by name..."
          />

          {guests.map((guest) => (
            <div
              key={guest.id}
              className="border rounded p-3 mb-3"
              style={{ background: "#fff", cursor: "pointer" }}
              onClick={() => handleSelectGuest(guest)}
            >
              <h6 className="mb-1 fw-bold">
                {guest.first_name} {guest.last_name} {guest.surname}
              </h6>
              <small className="text-muted">{guest.city} • {guest.mobile_no}</small>
            </div>
          ))}
        </>
      ) : (
        <>
          <div className="border rounded p-3 mb-3" style={{ background: "#fff" }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="fw-bold mb-1">
                  {selectedGuest.first_name} {selectedGuest.last_name} {selectedGuest.surname}
                </h6>
                <small className="text-muted">{selectedGuest.city} • {selectedGuest.mobile_no}</small>
              </div>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setSelectedGuest(null);
                  setRecords([]);
                }}
              >
                Back
              </button>
            </div>
          </div>

          {loadingRecords ? (
            <div className="text-center py-5">Loading records...</div>
          ) : records.length === 0 ? (
            <div className="text-center py-5 text-muted">No records found</div>
          ) : (
            records.map((record) => (
        <div
          key={record.id}
          className="border rounded p-3 mb-3"
          style={{ background: "#fff" }}
        >
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 className="mb-0 fw-bold">₹{record.amount}</h6>
              <small className="text-muted">{new Date(record.date).toLocaleDateString()}</small>
            </div>
            <span className={`badge ${record.select === "aavel" ? "bg-success" : "bg-danger"}`}>
              {record.select === "aavel" ? "Aavel" : "Mukel"}
            </span>
          </div>

          <div className="mb-2">
            <small>
              <strong>Event:</strong> {record.event === "chandlo" ? "Chandlo" : "Marriage"}
              {record.bride_groom && ` - ${record.bride_groom}`}
            </small>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary btn-sm">Edit</button>
            <button className="btn btn-outline-danger btn-sm">Delete</button>
              </div>
            </div>
            ))
          )}
        </>
      )}
    </AppLayout>
  );
};

export default GuestHistory;
