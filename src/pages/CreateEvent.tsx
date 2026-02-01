import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import useApi from "../hooks/useApi";
import FormInput from "../components/ui/FormInput";
import type { ValidationErrors } from "../utils/validation";
import { capitalizeFirst } from "../utils/textUtils";

const CreateEvent = () => {
  const { Post } = useApi();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    event_type: "chandlo",
    select_type: "aavel",
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
        select_type: "aavel",
        bride_groom_name: "",
      });
      
      // Navigate to events list
      navigate('/events');
      
    } catch (error: any) {
      console.error("Event creation failed:", error);
      toast.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title="Create Event" showBack>
    <div className="px-2">

    {/* EVENT TYPE */}
    <div className="mb-4">
      <label className="form-label fw-semibold">Event Type</label>
      <div className="d-flex bg-light rounded-pill p-1">
        <button
          type="button"
          className={`btn flex-fill rounded-pill fw-semibold ${
            eventData.event_type === "chandlo" ? "btn-danger" : "btn-light"
          }`}
          onClick={() => handleInputChange("event_type", "chandlo")}
        >
          Chandlo
        </button>
        <button
          type="button"
          className={`btn flex-fill rounded-pill fw-semibold ${
            eventData.event_type === "marriage" ? "btn-danger" : "btn-light"
          }`}
          onClick={() => handleInputChange("event_type", "marriage")}
        >
          Marriage
        </button>
      </div>
    </div>

    {/* EVENT NAME */}
    <div className="mb-3">
      <FormInput
  label="Event Name"
  placeholder="e.g., Grand Wedding Celebration"
  value={eventData.name}
  maxLength={100}
  error={errors.name}
  onChange={(e) => handleInputChange("name", capitalizeFirst(e.target.value))}
/>
   
    </div>

    {/* EVENT DATE */}
    <div className="mb-3">
      <FormInput
  label="Event Date"
  type="date"
  value={eventData.date}
  onChange={(e) => handleInputChange("date", e.target.value)}
  error={errors.date}
/>

      {/* <label className="form-label fw-semibold">Event Date</label>
      <input
        type="date"
        className={`form-control form-control-lg rounded-4 ${
          errors.date ? "is-invalid" : ""
        }`}
        value={eventData.date}
        onChange={(e) => handleInputChange("date", e.target.value)}
      />
      {errors.date && <div className="invalid-feedback">{errors.date}</div>} */}
    </div>

    {/* CONTRIBUTION TYPE - REMOVED */}
    {/* Contribution type is now automatically set to "aavel" */}

    {/* ❤️ COUPLE DETAILS */}
    {eventData.event_type === "marriage" && (
      <div className="border rounded-4 p-3 mb-4 bg-light">
        <div className="fw-semibold text-danger mb-3">
          ❤️ Couple Details
        </div>

        <FormInput
          placeholder="Bride & Groom Name (e.g., Raj & Priya)"
          value={eventData.bride_groom_name}
          onChange={(e) =>
            handleInputChange("bride_groom_name", capitalizeFirst(e.target.value))
          }
          error={errors.bride_groom_name}
        />
      </div>
    )}

    {/* INFO */}
    <div className="alert alert-danger rounded-4 small">
      Once created, you can start adding guests and recording contributions.
    </div>

    {/* SUBMIT */}
    <button
      className="btn btn-danger btn-lg w-100 rounded-4"
      onClick={handleSubmit}
      disabled={isSubmitting}
    >
      {isSubmitting ? "Creating Event..." : "Create Event"}
    </button>
  </div>
    </AppLayout>
  );
};

export default CreateEvent;