import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useApi from "../hooks/useApi";
import { confirmDelete } from "../utils/sweetAlert";

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

interface GuestRecordsProps {
  guest: Guest;
}

const GuestRecords = ({ guest }: GuestRecordsProps) => {
  const { GetPaginatedData, Patch, Delete } = useApi();
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
      {records.map((record) => (
        <div
          key={record.id}
          className="border rounded p-3 mb-3 shadow-sm"
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

          <div className="d-flex gap-2 flex-wrap">
            <button 
              className="btn btn-outline-primary btn-sm flex-fill"
              onClick={() => handleEditRecord(record)}
            >
              Edit
            </button>
            <button 
              className="btn btn-outline-danger btn-sm flex-fill"
              onClick={() => handleDeleteRecord(record.id)}
            >
              Delete
            </button>
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
