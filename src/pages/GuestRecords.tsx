import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useApi from "../hooks/useApi";
import { confirmDelete } from "../utils/sweetAlert";
import { FaEdit, FaTrash, FaRupeeSign, FaCalendarAlt, FaCreditCard, FaCheckCircle, FaClock } from "react-icons/fa";

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
  event_type?: string;
  event_name?: string;
  pay_later?: boolean;
  payment_status?: string;
}

interface GuestSummary {
  aavel_total: number;
  mukel_total: number;
  difference: number;
}

interface GuestRecordsProps {
  guest: Guest;
  summary: GuestSummary | null;
}

const GuestRecords = ({ guest, summary }: GuestRecordsProps) => {
  const { GetPaginatedData, Patch, Delete, Put } = useApi();
  const [records, setRecords] = useState<GuestRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [editingRecord, setEditingRecord] = useState<GuestRecord | null>(null);
  const [editForm, setEditForm] = useState({
    date: "",
    amount: "",
    select: "mukel",
    event: "chandlo",
    bride_groom: ""
  });

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const result = await GetPaginatedData("guestRecord", { 
          queryParams: { guest: guest.id } 
        });
        
        // Filter out summary data - only keep records with valid record fields
        const validRecords = result.data.filter((record: any) => 
          record.id && record.date && record.amount && 
          !record.hasOwnProperty('aavel_total')
        );
        
        setRecords(validRecords);
        setHasNextPage(!!result.nextPage);
      } catch (error) {
        console.error("Failed to fetch records", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guest.id]);

  const loadMoreRecords = async () => {
    if (!hasNextPage || loadingMore) return;
    
    setLoadingMore(true);
    try {
      const result = await GetPaginatedData("guestRecord", { 
        page: currentPage + 1,
        queryParams: { guest: guest.id } 
      });
      
      const validRecords = result.data.filter((record: any) => 
        record.id && record.date && record.amount && 
        !record.hasOwnProperty('aavel_total')
      );
      
      setRecords(prev => [...prev, ...validRecords]);
      setCurrentPage(prev => prev + 1);
      setHasNextPage(!!result.nextPage);
    } catch (error) {
      console.error("Failed to load more records", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleEditRecord = (record: GuestRecord) => {
    setEditingRecord(record);
    setEditForm({
      date: record.date,
      amount: record.amount,
      select: record.select,
      event: record.event,
      bride_groom: record.bride_groom || ""
    });
  };

  const handleUpdateRecord = async () => {
    if (!editingRecord) return;
    
    try {
      await Patch("guestRecord", editingRecord.id, editForm);
      
      setRecords(records.map(record => 
        record.id === editingRecord.id 
          ? { ...record, ...editForm }
          : record
      ));
      
      setEditingRecord(null);
      toast.success("Record updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update record");
    }
  };

  const handleTogglePayLater = async (recordId: string, currentPayLater: boolean) => {
    try {
      await Put("guestRecord", recordId, { pay_later: !currentPayLater });
      
      setRecords(records.map(record => 
        record.id === recordId 
          ? { ...record, pay_later: !currentPayLater }
          : record
      ));
      
      toast.success(`Payment status updated to ${!currentPayLater ? 'Pay Later' : 'Paid'}!`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update payment status");
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    const confirmed = await confirmDelete("This record will be permanently deleted!");
    if (!confirmed) return;
    
    try {
      await Delete("guestRecord", recordId);
      
      setRecords(records.filter(record => record.id !== recordId));
      toast.success("Record deleted successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete record");
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading records...</div>;
  }

  if (records.length === 0) {
    return <div className="text-center py-5 text-muted">No records found</div>;
  }

  return (
    <>
      {summary && (
        <div className="row g-2 mb-3 mx-1">
          <div className="col-4">
            <div className="card text-center bg-light border-0 shadow-sm">
              <div className="card-body p-2 py-3">
                <small className="text-muted d-block mb-1">Aavel</small>
                <div className="fw-bold text-success fs-6">₹{summary.aavel_total}</div>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card text-center bg-light border-0 shadow-sm">
              <div className="card-body p-2 py-3">
                <small className="text-muted d-block mb-1">Mukel</small>
                <div className="fw-bold text-danger fs-6">₹{summary.mukel_total}</div>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card text-center bg-light border-0 shadow-sm">
              <div className="card-body p-2 py-3">
                <small className="text-muted d-block mb-1">Difference</small>
                <div className="fw-bold text-primary fs-6">₹{summary.difference}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {records.map((record) => (
        <div
          key={record.id}
          className="card border-0 shadow-sm rounded-4 mb-3"
        >
          <div className="card-body p-3">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <div className="d-flex align-items-center mb-1">
                  <FaRupeeSign className="text-success me-1" size={14} />
                  <h6 className="mb-0 fw-bold text-success">{record.amount}</h6>
                  {record.pay_later && (
                    <span className="badge bg-warning text-dark ms-2 rounded-pill">
                      <FaClock className="me-1" size={10} />
                      Pay Later
                    </span>
                  )}
                </div>
                <div className="d-flex align-items-center text-muted small">
                  <FaCalendarAlt className="me-1" size={10} />
                  <span>{new Date(record.date).toLocaleDateString()}</span>
                </div>
              </div>
              <span className={`badge rounded-pill ${record.select === "aavel" ? "bg-success" : "bg-danger"}`}>
                {record.select === "aavel" ? "Aavel" : "Mukel"}
              </span>
            </div>

            <div className="mb-3">
              <small className="text-muted d-block">
                <strong>Event:</strong> {record.event_type === "chandlo" ? "Chandlo" : "Marriage"}
                {record.bride_groom && ` - ${record.bride_groom}`}
              </small>
              {record.event_name && (
                <small className="text-muted d-block">
                  <strong>Event Name:</strong> {record.event_name}
                </small>
              )}
            </div>
            
            <div className="d-flex gap-2">
              <button 
                className={`btn btn-sm rounded-pill flex-fill d-flex align-items-center justify-content-center ${
                  record.pay_later ? 'btn-warning' : 'btn-success'
                }`}
                onClick={() => handleTogglePayLater(record.id, record.pay_later || false)}
              >
                {record.pay_later ? (
                  <><FaCheckCircle className="me-1" size={12} />Mark as Paid</>
                ) : (
                  <><FaClock className="me-1" size={12} />Mark Pay Later</>
                )}
              </button>
              <button 
                className="btn btn-outline-primary btn-sm rounded-pill flex-fill d-flex align-items-center justify-content-center"
                onClick={() => handleEditRecord(record)}
              >
                <FaEdit className="me-1" size={12} />
                <span>Edit</span>
              </button>
              <button 
                className="btn btn-outline-danger btn-sm rounded-pill flex-fill d-flex align-items-center justify-content-center"
                onClick={() => handleDeleteRecord(record.id)}
              >
                <FaTrash className="me-1" size={12} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {hasNextPage && (
        <div className="text-center mt-3">
          <button 
            className="btn btn-outline-primary"
            onClick={loadMoreRecords}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
      
      {/* Edit Modal */}
      {editingRecord && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Record</h5>
                <button 
                  className="btn-close" 
                  onClick={() => setEditingRecord(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={editForm.date}
                    onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={editForm.select}
                    onChange={(e) => setEditForm({...editForm, select: e.target.value})}
                  >
                    <option value="mukel">Mukel</option>
                    <option value="aavel">Aavel</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Event</label>
                  <select
                    className="form-select"
                    value={editForm.event}
                    onChange={(e) => setEditForm({...editForm, event: e.target.value})}
                  >
                    <option value="chandlo">Chandlo</option>
                    <option value="marriage">Marriage</option>
                  </select>
                </div>
                {editForm.event === "marriage" && (
                  <div className="mb-3">
                    <label className="form-label">Bride/Groom Name</label>
                    <input
                      className="form-control"
                      value={editForm.bride_groom}
                      onChange={(e) => setEditForm({...editForm, bride_groom: e.target.value})}
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setEditingRecord(null)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleUpdateRecord}
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

export default GuestRecords;
