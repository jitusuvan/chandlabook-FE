import { useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../layouts/AppLayout";
import useApi from "../hooks/useApi";
import { validateForm, commonRules } from "../utils/validation";
import type { ValidationErrors } from "../utils/validation";
import { capitalizeFirst } from "../utils/textUtils";
import FormInput from "../components/ui/FormInput";
import SearchInput from "../components/ui/SearchInput";
import PaginatedSearchSelect from "../components/ui/PaginatedSearchSelect";

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  surname: string;
  mobile_no: string;
  city: string;
}
interface Event {
  id: string;
  name: string;
  date: string;
  event_type: string;
  select_type: string;
  bride_groom_name?: string;
  total_amount?: number;
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
    // mobile_no: "",
    city: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [records, setRecords] = useState([
    {
      date: "",
      amount: "",
      select: "mukel",
      event: "chandlo",
      bride_groom: "",
      pay_later: false,
    },
  ]);
const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

const handleSelectEvent = (event: Event) => {
  setSelectedEvent(event);
  // Auto-fill record data from event
  setRecords([{
    date: event.date,
    amount: "",
    select: event.select_type,
    event: event.event_type,
    bride_groom: event.bride_groom_name || "",
    pay_later: false,
  }]);
};

  const addRecord = () => {
    setRecords([
      ...records,
      {
        date: "",
        amount: "",
        select: "aavel",
        event: "chandlo",
        bride_groom: "",
        pay_later: false,
      },
    ]);
  };

  const removeRecord = (index: number) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const updateRecord = (index: number, field: string, value: string) => {
    const newRecords = [...records];
    if (field === 'pay_later') {
      newRecords[index][field as keyof typeof newRecords[0]] = (value === 'true') as never;
    } else {
      newRecords[index][field as keyof typeof newRecords[0]] = value as never;
    }
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
    setErrors({});

    // Validate guest data if creating new guest
    if (!selectedGuest) {
      const guestFormData = new FormData();
      Object.entries(guestData).forEach(([key, value]) => {
        guestFormData.append(key, value);
      });

      const guestValidationRules = {
        first_name: commonRules.name,
        last_name: commonRules.name,
        surname: commonRules.name,
        // mobile_no: commonRules.phone,
        city: commonRules.city
      };

      const guestErrors = validateForm(guestFormData, guestValidationRules);
      if (Object.keys(guestErrors).length > 0) {
        setErrors(guestErrors);
        toast.error("Please fix guest information errors");
        return;
      }
    }

    // Validate records
    const recordErrors: ValidationErrors = {};
    records.forEach((record, idx) => {
      if (!record.date) recordErrors[`date_${idx}`] = "Date is required";
      if (!record.amount) recordErrors[`amount_${idx}`] = "Amount is required";
      else if (!/^\d+(\.\d{1,2})?$/.test(record.amount) || parseFloat(record.amount) <= 0) {
        recordErrors[`amount_${idx}`] = "Enter valid amount";
      }
      if (record.event === "marriage" && !record.bride_groom.trim()) {
        recordErrors[`bride_groom_${idx}`] = "Bride/Groom name is required";
      }
    });

    if (Object.keys(recordErrors).length > 0) {
      setErrors(recordErrors);
      toast.error("Please fix record errors");
      return;
    }

    try {
      let guestId: string;

      if (selectedGuest) {
        guestId = selectedGuest.id;
      } else {
        const guestResponse = await Post("guest", guestData);
        guestId = guestResponse.data.id;
      }

      // Create all records for this guest
      await Promise.all(
        records.map((record) => {
          const payload = {
  guest: guestId,
  event: selectedEvent?.id || null, // Add event FK
  date: record.date,
  amount: record.amount,
  select: record.select,
  event_type: record.event, // Changed from 'event' to 'event_type'
  pay_later: record.pay_later,
  ...(record.event === "marriage" && { bride_groom: record.bride_groom }),
};

          // const payload = {
          //   guest: guestId,
          //   date: record.date,
          //   amount: record.amount,
          //   select: record.select,
          //   event: record.event,
          //   ...(record.event === "marriage" && { bride_groom: record.bride_groom }),
          // };
          return Post("guestRecord", payload);
        })
      );

      toast.success(`${records.length} record(s) created!`);
      setShowGuestForm(false);
      setSelectedGuest(null);
      setSearchQuery("");
      setGuestData({ first_name: "", last_name: "", surname: "", city: "" });
      setRecords([{ date: "", amount: "", select: "mukel", event: "chandlo", bride_groom: "", pay_later: false }]);
      setErrors({});
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
          <SearchInput
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleSearch}
          />

          {/* Search Results */}
          {searchQuery.trim().length >= 2 && (
            <div className="border rounded mt-2" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {searchResults.length > 0 ? (
                searchResults.map((guest) => (
                  <div
                    key={guest.id}
                    className="p-3 border-bottom"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSelectGuest(guest)}
                  >
                    <div className="fw-bold">
                      {guest.first_name} {guest.last_name} {guest.surname}
                    </div>
                    <small className="text-muted">{guest.city}</small>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-muted">
                  No guests found for "{searchQuery}"
                </div>
              )}
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
                <small className="text-muted">{selectedGuest.city} </small>
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

          <div className="mb-3">
            <label className="form-label fw-semibold">Select Event (Auto-fill Details)</label>
            <PaginatedSearchSelect
              api="events"
              getOptionLabel={(event) => `${event.name} - ${new Date(event.date).toLocaleDateString()}`}
              onSelect={handleSelectEvent}
              value={selectedEvent}
              placeholder="Search and select event..."
            />
          </div>

          {/* Selected Event Display */}
          {selectedEvent && (
            <div className="border rounded p-3 mb-3" style={{ background: "#e8f5e8" }}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="fw-bold mb-1 text-success">📅 {selectedEvent.name}</h6>
                  <small className="text-muted">
                    {new Date(selectedEvent.date).toLocaleDateString()} • 
                    {selectedEvent.event_type} • {selectedEvent.select_type}
                    {selectedEvent.bride_groom_name && ` • ${selectedEvent.bride_groom_name}`}
                    {selectedEvent.total_amount && ` • ₹${selectedEvent.total_amount}`}
                  </small>
                </div>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    setSelectedEvent(null);
                    setRecords([{ date: "", amount: "", select: "mukel", event: "chandlo", bride_groom: "", pay_later: false }]);
                  }}
                >
                  Change
                </button>
              </div>
            </div>
          )}

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

              {/* Only show amount field if event is selected, otherwise show all fields */}
              {selectedEvent ? (
                <>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Amount</label>
                  <input
                    type="number"
                    className={`form-control form-control-lg ${errors[`amount_${idx}`] ? 'is-invalid' : ''}`}
                    placeholder="Enter amount"
                    min="1"
                    max="1000000"
                    step="0.01"
                    value={record.amount}
                    onChange={(e) => updateRecord(idx, "amount", e.target.value)}
                  />
                  {errors[`amount_${idx}`] && <div className="invalid-feedback">{errors[`amount_${idx}`]}</div>}
                </div>
                
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`payLaterEvent_${idx}`}
                    checked={record.pay_later}
                    onChange={(e) => updateRecord(idx, "pay_later", e.target.checked.toString())}
                  />
                  <label className="form-check-label" htmlFor={`payLaterEvent_${idx}`}>
                    Pay Later
                  </label>
                </div>
                </>
              ) : (
                <>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold">Date</label>
                      <input
                        type="date"
                        className={`form-control form-control-lg ${errors[`date_${idx}`] ? 'is-invalid' : ''}`}
                        value={record.date}
                        onChange={(e) => updateRecord(idx, "date", e.target.value)}
                      />
                      {errors[`date_${idx}`] && <div className="invalid-feedback">{errors[`date_${idx}`]}</div>}
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold">Amount</label>
                      <input
                        type="number"
                        className={`form-control form-control-lg ${errors[`amount_${idx}`] ? 'is-invalid' : ''}`}
                        placeholder="Enter amount"
                        min="1"
                        max="1000000"
                        step="0.01"
                        value={record.amount}
                        onChange={(e) => updateRecord(idx, "amount", e.target.value)}
                      />
                      {errors[`amount_${idx}`] && <div className="invalid-feedback">{errors[`amount_${idx}`]}</div>}
                    </div>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`payLaterManual_${idx}`}
                      checked={record.pay_later}
                      onChange={(e) => updateRecord(idx, "pay_later", e.target.checked.toString())}
                    />
                    <label className="form-check-label" htmlFor={`payLaterManual_${idx}`}>
                      Pay Later
                    </label>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold">Select Type</label>
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
                      <label className="form-label fw-semibold">Event Type</label>
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
                      <label className="form-label fw-semibold">Bride/Groom Name</label>
                      <input
                        className={`form-control form-control-lg ${errors[`bride_groom_${idx}`] ? 'is-invalid' : ''}`}
                        placeholder="Bride/Groom name"
                        maxLength={100}
                        value={record.bride_groom}
                        onChange={(e) => updateRecord(idx, "bride_groom", e.target.value)}
                      />
                      {errors[`bride_groom_${idx}`] && <div className="invalid-feedback">{errors[`bride_groom_${idx}`]}</div>}
                    </div>
                  )}
                  
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`payLater_${idx}`}
                      checked={record.pay_later}
                      onChange={(e) => updateRecord(idx, "pay_later", e.target.checked.toString())}
                    />
                    <label className="form-check-label" htmlFor={`payLater_${idx}`}>
                      Pay Later
                    </label>
                  </div>
                </>
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
              <FormInput
                placeholder="First name"
                name="first_name"
                maxLength={50}
                value={guestData.first_name}
                onChange={(e) => setGuestData({ ...guestData, first_name: capitalizeFirst(e.target.value) })}
                error={errors.first_name}
              />
            </div>
            <div className="col-6">
              <FormInput
                placeholder="Last name"
                name="last_name"
                maxLength={50}
                value={guestData.last_name}
                onChange={(e) => setGuestData({ ...guestData, last_name: capitalizeFirst(e.target.value) })}
                error={errors.last_name}
              />
            </div>
            <div className="col-6">
              <FormInput
                placeholder="Surname"
                name="surname"
                maxLength={50}
                value={guestData.surname}
                onChange={(e) => setGuestData({ ...guestData, surname: capitalizeFirst(e.target.value) })}
                error={errors.surname}
              />
            </div>
            <div className="col-6">
               <FormInput
                placeholder="City"
                name="city"
                maxLength={50}
                value={guestData.city}
                onChange={(e) => setGuestData({ ...guestData, city: capitalizeFirst(e.target.value) })}
                error={errors.city}
              />
              {/* <FormInput
                placeholder="Mobile number"
                name="mobile_no"
                maxLength={15}
                value={guestData.mobile_no}
                onChange={(e) => setGuestData({ ...guestData, mobile_no: e.target.value })}
                error={errors.mobile_no}
              /> */}
            </div>
            <div className="col-6">
             
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Select Event (Auto-fill Details)</label>
            <PaginatedSearchSelect
              api="events"
              getOptionLabel={(event) => `${event.name} - ${new Date(event.date).toLocaleDateString()}`}
              onSelect={handleSelectEvent}
              value={selectedEvent}
              placeholder="Search and select event..."
            />
          </div>

          {/* Selected Event Display */}
          {selectedEvent && (
            <div className="border rounded p-3 mb-3" style={{ background: "#e8f5e8" }}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="fw-bold mb-1 text-success">📅 {selectedEvent.name}</h6>
                  <small className="text-muted">
                    {new Date(selectedEvent.date).toLocaleDateString()} • 
                    {selectedEvent.event_type} • {selectedEvent.select_type}
                    {selectedEvent.bride_groom_name && ` • ${selectedEvent.bride_groom_name}`}
                    {selectedEvent.total_amount && ` • ₹${selectedEvent.total_amount}`}
                  </small>
                </div>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    setSelectedEvent(null);
                    setRecords([{ date: "", amount: "", select: "mukel", event: "chandlo", bride_groom: "", pay_later: false }]);
                  }}
                >
                  Change
                </button>
              </div>
            </div>
          )}


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

              {/* Only show amount field if event is selected, otherwise show all fields */}
              {selectedEvent ? (
                <div className="mb-3">
                  <label className="form-label fw-semibold">Amount</label>
                  <input
                    type="number"
                    className={`form-control form-control-lg ${errors[`amount_${idx}`] ? 'is-invalid' : ''}`}
                    placeholder="Enter amount"
                    min="1"
                    max="1000000"
                    step="0.01"
                    value={record.amount}
                    onChange={(e) => updateRecord(idx, "amount", e.target.value)}
                  />
                  {errors[`amount_${idx}`] && <div className="invalid-feedback">{errors[`amount_${idx}`]}</div>}
                </div>
              ) : (
                <>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold">Date</label>
                      <input
                        type="date"
                        className={`form-control form-control-lg ${errors[`date_${idx}`] ? 'is-invalid' : ''}`}
                        value={record.date}
                        onChange={(e) => updateRecord(idx, "date", e.target.value)}
                      />
                      {errors[`date_${idx}`] && <div className="invalid-feedback">{errors[`date_${idx}`]}</div>}
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold">Amount</label>
                      <input
                        type="number"
                        className={`form-control form-control-lg ${errors[`amount_${idx}`] ? 'is-invalid' : ''}`}
                        placeholder="Enter amount"
                        min="1"
                        max="1000000"
                        step="0.01"
                        value={record.amount}
                        onChange={(e) => updateRecord(idx, "amount", e.target.value)}
                      />
                      {errors[`amount_${idx}`] && <div className="invalid-feedback">{errors[`amount_${idx}`]}</div>}
                    </div>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`payLaterManual_${idx}`}
                      checked={record.pay_later}
                      onChange={(e) => updateRecord(idx, "pay_later", e.target.checked.toString())}
                    />
                    <label className="form-check-label" htmlFor={`payLaterManual_${idx}`}>
                      Pay Later
                    </label>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold">Select Type</label>
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
                      <label className="form-label fw-semibold">Event Type</label>
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
                      <label className="form-label fw-semibold">Bride/Groom Name</label>
                      <input
                        className={`form-control form-control-lg ${errors[`bride_groom_${idx}`] ? 'is-invalid' : ''}`}
                        placeholder="Bride/Groom name"
                        maxLength={100}
                        value={record.bride_groom}
                        onChange={(e) => updateRecord(idx, "bride_groom", e.target.value)}
                      />
                      {errors[`bride_groom_${idx}`] && <div className="invalid-feedback">{errors[`bride_groom_${idx}`]}</div>}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {/* Add Record Button - only show if no event selected */}
          {!selectedEvent && (
            <button
              type="button"
              className="btn btn-outline-danger rounded-pill mb-3"
              onClick={addRecord}
            >
              Add Another Record
            </button>
          )}

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
