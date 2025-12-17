import { useState } from "react";
import toast from "react-hot-toast";
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

const AddRecord = () => {
  const { Post, GetPaginatedData } = useApi();
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [guestData, setGuestData] = useState({
    first_name: "",
    last_name: "",
    surname: "",
    mobile_no: "",
    city: "",
  });
  const [records, setRecords] = useState([
    {
      date: "",
      amount: "",
      select: "mukel",
      event: "chandlo",
      bride_groom: "",
    },
  ]);

  const addRecord = () => {
    setRecords([
      ...records,
      {
        date: "",
        amount: "",
        select: "mukel",
        event: "chandlo",
        bride_groom: "",
      },
    ]);
  };

  const removeRecord = (index: number) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const updateRecord = (index: number, field: string, value: string) => {
    const newRecords = [...records];
    newRecords[index][field as keyof typeof newRecords[0]] = value as never;
    setRecords(newRecords);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const result = await GetPaginatedData("guest", { search: query });
      setSearchResults(result.data);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const handleSelectGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setSearchQuery(`${guest.first_name} ${guest.last_name} ${guest.surname}`);
    setSearchResults([]);
  };

  const handleSubmit = async () => {
    try {
      let guestId: string;

      if (selectedGuest) {
        // Use existing guest
        guestId = selectedGuest.id;
      } else {
        // Create new guest
        const guestResponse = await Post("guest", guestData);
        guestId = guestResponse.data.id;
      }

      // Create all records for this guest
      await Promise.all(
        records.map((record) => {
          const payload = {
            guest: guestId,
            date: record.date,
            amount: record.amount,
            select: record.select,
            event: record.event,
            ...(record.event === "marriage" && { bride_groom: record.bride_groom }),
          };
          return Post("guestRecord", payload);
        })
      );

      toast.success(`${records.length} record(s) created!`);
      setShowGuestForm(false);
      setSelectedGuest(null);
      setSearchQuery("");
      setGuestData({ first_name: "", last_name: "", surname: "", mobile_no: "", city: "" });
      setRecords([{ date: "", amount: "", select: "mukel", event: "chandlo", bride_groom: "" }]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create guest/record");
    }
  };

  return (
    <AppLayout title="Add Record" showBack>
      
      {/* 🔍 SEARCH GUEST */}
      {!showGuestForm && !selectedGuest && (
        <div className="mb-4">
          <label className="form-label fw-semibold">Search Guest</label>
          <div className="input-group input-group-lg">
            <span className="input-group-text bg-white">🔍</span>
            <input
              className="form-control"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="border rounded mt-2" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {searchResults.map((guest) => (
                <div
                  key={guest.id}
                  className="p-3 border-bottom"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectGuest(guest)}
                >
                  <div className="fw-bold">
                    {guest.first_name} {guest.last_name} {guest.surname}
                  </div>
                  <small className="text-muted">{guest.city} • {guest.mobile_no}</small>
                </div>
              ))}
            </div>
          )}

          <div className="text-end mt-2">
            <button
              className="btn btn-outline-danger btn-sm rounded-pill"
              onClick={() => setShowGuestForm(true)}
            >
              Add New Guest
            </button>
          </div>
        </div>
      )}

      {/* Selected Guest - Show Records Form */}
      {selectedGuest && !showGuestForm && (
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
                  setSearchQuery("");
                }}
              >
                Change
              </button>
            </div>
          </div>

          <h6 className="fw-bold mb-3">{records.length > 1 ? "Multiple Records" : "Single Record"}</h6>

          {/* 📅 RECORD DETAILS */}
          {records.map((record, idx) => (
            <div key={idx} className="border rounded p-3 mb-3" style={{ background: "#fff" }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Record {idx + 1}</h6>
                {records.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeRecord(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    value={record.date}
                    onChange={(e) => updateRecord(idx, "date", e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="Enter amount"
                    value={record.amount}
                    onChange={(e) => updateRecord(idx, "amount", e.target.value)}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <select
                    className="form-select form-select-lg"
                    value={record.select}
                    onChange={(e) => updateRecord(idx, "select", e.target.value)}
                  >
                    <option value="mukel">Mukel</option>
                    <option value="aavel">Aavel</option>
                  </select>
                </div>
                <div className="col-6">
                  <select
                    className="form-select form-select-lg"
                    value={record.event}
                    onChange={(e) => updateRecord(idx, "event", e.target.value)}
                  >
                    <option value="chandlo">Chandlo</option>
                    <option value="marriage">Marriage</option>
                  </select>
                </div>
              </div>

              {record.event === "marriage" && (
                <div className="mb-3">
                  <input
                    className="form-control form-control-lg"
                    placeholder="Bride/Groom name"
                    value={record.bride_groom}
                    onChange={(e) => updateRecord(idx, "bride_groom", e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline-danger rounded-pill mb-3"
            onClick={addRecord}
          >
            Add Another Record
          </button>

          <button
            className="btn btn-danger w-100 btn-lg rounded-pill"
            onClick={handleSubmit}
          >
            Create {records.length} Record{records.length > 1 ? "s" : ""}
          </button>
        </>
      )}

      {/* 👤 GUEST INFO AND RECORD FORM */}
      {showGuestForm && (
        <>
          <h6 className="fw-bold mb-3">Guest Information</h6>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <input
                className="form-control form-control-lg"
                placeholder="First name"
                value={guestData.first_name}
                onChange={(e) => setGuestData({ ...guestData, first_name: e.target.value })}
              />
            </div>
            <div className="col-6">
              <input
                className="form-control form-control-lg"
                placeholder="Last name"
                value={guestData.last_name}
                onChange={(e) => setGuestData({ ...guestData, last_name: e.target.value })}
              />
            </div>
            <div className="col-6">
              <input
                className="form-control form-control-lg"
                placeholder="Surname"
                value={guestData.surname}
                onChange={(e) => setGuestData({ ...guestData, surname: e.target.value })}
              />
            </div>
            <div className="col-6">
              <input
                className="form-control form-control-lg"
                placeholder="Mobile number"
                value={guestData.mobile_no}
                onChange={(e) => setGuestData({ ...guestData, mobile_no: e.target.value })}
              />
            </div>
            <div className="col-6">
              <input
                className="form-control form-control-lg"
                placeholder="City"
                value={guestData.city}
                onChange={(e) => setGuestData({ ...guestData, city: e.target.value })}
              />
            </div>
          </div>

          <h6 className="fw-bold mb-3 mt-4">{records.length > 1 ? "Multiple Records" : "Single Record"}</h6>

          {/* 📅 RECORD DETAILS */}
          {records.map((record, idx) => (
            <div key={idx} className="border rounded p-3 mb-3" style={{ background: "#fff" }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Record {idx + 1}</h6>
                {records.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeRecord(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    value={record.date}
                    onChange={(e) => updateRecord(idx, "date", e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="Enter amount"
                    value={record.amount}
                    onChange={(e) => updateRecord(idx, "amount", e.target.value)}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <select
                    className="form-select form-select-lg"
                    value={record.select}
                    onChange={(e) => updateRecord(idx, "select", e.target.value)}
                  >
                    <option value="mukel">Mukel</option>
                    <option value="aavel">Aavel</option>
                  </select>
                </div>
                <div className="col-6">
                  <select
                    className="form-select form-select-lg"
                    value={record.event}
                    onChange={(e) => updateRecord(idx, "event", e.target.value)}
                  >
                    <option value="chandlo">Chandlo</option>
                    <option value="marriage">Marriage</option>
                  </select>
                </div>
              </div>

              {record.event === "marriage" && (
                <div className="mb-3">
                  <input
                    className="form-control form-control-lg"
                    placeholder="Bride/Groom name"
                    value={record.bride_groom}
                    onChange={(e) => updateRecord(idx, "bride_groom", e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline-danger rounded-pill mb-3"
            onClick={addRecord}
          >
            Add Another Record
          </button>

          {/* ✅ SUBMIT */}
          <button
            className="btn btn-danger w-100 btn-lg rounded-pill"
            onClick={handleSubmit}
          >
            Create {records.length} Record{records.length > 1 ? "s" : ""}
          </button>
        </>
      )}

    </AppLayout>
  );
};

export default AddRecord;
