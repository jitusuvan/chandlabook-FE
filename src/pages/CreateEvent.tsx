import { useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../layouts/AppLayout";
import useApi from "../hooks/useApi";
import { validateForm, commonRules } from "../utils/validation";
import type { ValidationErrors } from "../utils/validation";

const CreateEvent = () => {
  const { Post } = useApi();
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    event_type: "chandlo",
    select_type: "mukel",
    bride_groom_name: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setEventData({ ...eventData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateEventForm = () => {
    const newErrors: ValidationErrors = {};

    if (!eventData.name.trim()) {
      newErrors.name = "Event name is required";
    } else if (eventData.name.length < 3) {
      newErrors.name = "Event name must be at least 3 characters";
    }

    if (!eventData.date) {
      newErrors.date = "Event date is required";
    }

    if (eventData.event_type === "marriage" && !eventData.bride_groom_name.trim()) {
      newErrors.bride_groom_name = "Bride/Groom name is required for marriage events";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    setErrors({});
    
    const validationErrors = validateEventForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: eventData.name.trim(),
        date: eventData.date,
        event_type: eventData.event_type,
        select_type: eventData.select_type,
        ...(eventData.event_type === "marriage" && { 
          bride_groom_name: eventData.bride_groom_name.trim() 
        }),
      };

      await Post("events", payload);
      
      toast.success("Event created successfully!");
      
      // Reset form
      setEventData({
        name: "",
        date: "",
        event_type: "chandlo",
        select_type: "mukel",
        bride_groom_name: "",
      });
      
    } catch (error: any) {
      console.error("Event creation failed:", error);
      toast.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title="Create Event" showBack>
      <div className="container-fluid p-0">
        
        {/* Event Form */}
        <div className="border rounded p-3 mb-3" style={{ background: "#fff" }}>
          <h6 className="fw-bold mb-3">Event Details</h6>

          {/* Event Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Event Name</label>
            <input
              className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Enter event name (e.g., Diwali Chandlo 2024)"
              maxLength={100}
              value={eventData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          {/* Event Date */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Event Date</label>
            <input
              type="date"
              className={`form-control form-control-lg ${errors.date ? 'is-invalid' : ''}`}
              value={eventData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
            />
            {errors.date && <div className="invalid-feedback">{errors.date}</div>}
          </div>

          {/* Event Type & Select Type */}
          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label fw-semibold">Event Type</label>
              <select
                className="form-select form-select-lg"
                value={eventData.event_type}
                onChange={(e) => handleInputChange("event_type", e.target.value)}
              >
                <option value="chandlo">Chandlo</option>
                <option value="marriage">Marriage</option>
              </select>
            </div>
            <div className="col-6">
              <label className="form-label fw-semibold">Select Type</label>
              <select
                className="form-select form-select-lg"
                value={eventData.select_type}
                onChange={(e) => handleInputChange("select_type", e.target.value)}
              >
                <option value="mukel">Mukel</option>
                <option value="aavel">Aavel</option>
              </select>
            </div>
          </div>

          {/* Bride/Groom Name (only for marriage) */}
          {eventData.event_type === "marriage" && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Bride & Groom Name</label>
              <input
                className={`form-control form-control-lg ${errors.bride_groom_name ? 'is-invalid' : ''}`}
                placeholder="Enter bride & groom names (e.g., Raj & Priya)"
                maxLength={100}
                value={eventData.bride_groom_name}
                onChange={(e) => handleInputChange("bride_groom_name", e.target.value)}
              />
              {errors.bride_groom_name && <div className="invalid-feedback">{errors.bride_groom_name}</div>}
            </div>
          )}

          {/* Submit Button */}
          <button
            className="btn btn-danger w-100 btn-lg rounded-pill"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Event..." : "Create Event"}
          </button>
        </div>

        {/* Example Payloads */}
        <div className="border rounded p-3" style={{ background: "#f8f9fa" }}>
          <h6 className="fw-bold mb-2">Example Events</h6>
          <small className="text-muted">
            <strong>Chandlo:</strong> Diwali Chandlo 2024, Date: 2024-01-15, Type: chandlo, Select: mukel
            <br />
            <strong>Marriage:</strong> Raj-Priya Wedding, Date: 2024-02-20, Type: marriage, Select: aavel, Names: Raj & Priya
          </small>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateEvent;