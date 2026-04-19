import React, { useState, useRef } from "react";

import AppLayout from "../layouts/AppLayout";
import useApi from "../hooks/useApi";
import GuestList from "../pages/GuestList";
import GuestRecords from "../pages/GuestRecords";

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  surname: string;
  mobile_no: string;
  city: string;
  guest_name?: string;
}

interface GuestSummary {
  aavel_total: number;
  mukel_total: number;
  difference: number;
}

const GuestHistory = () => {
  const { GetPaginatedData, Post } = useApi();
 

  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [summary, setSummary] = useState<GuestSummary | null>(null);

  // CSV Import States
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [csvPreview, setCsvPreview] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"info" | "success" | "error">(
    "info",
  );
  const [, setCsvContent] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectGuest = async (guest: Guest) => {
    setSelectedGuest(guest);
    try {
      const result = await GetPaginatedData("guestRecord", {
        queryParams: { guest: guest.id },
      });

      if (result.data && result.data.length > 0) {
        const firstResult = result.data[0];
        if (firstResult.aavel_total !== undefined) {
          setSummary({
            aavel_total: firstResult.aavel_total,
            mukel_total: firstResult.mukel_total,
            difference: firstResult.difference,
          });
        }

        // Update guest with guest_name if available
        const recordWithGuestName = result.data.find(
          (record: any) => record.guest_name,
        );
        if (recordWithGuestName && recordWithGuestName.guest_name) {
          setSelectedGuest((prev) =>
            prev
              ? { ...prev, guest_name: recordWithGuestName.guest_name }
              : null,
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch records", error);
    }
  };

  const handleBackClick = () => {
    if (selectedGuest) {
      setSelectedGuest(null);
      setSummary(null);
    } else {
      // Default back behavior when no guest selected
      window.history.back();
    }
  };

  // CSV Import Functions

  const importData = async () => {
   

    if (!selectedFile) {
      showStatus("No file selected", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setStatusMessage("Importing...");
    setStatusType("info");

    try {
      const response = await Post("bulkImportRecord", formData);
      const result = response.data;

      showStatus(
        `✅ Success: ${result.guests_created || 0} guests + ${result.records_created || 0} records created! Closing...`,
        "success",
      );

      // Auto close modal and refresh WITHOUT splashscreen
      setTimeout(() => {
        toggleImportModal();
        window.location.href = window.location.pathname; // Soft refresh - no splashscreen
      }, 2000);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.message ||
        "Unknown error";
      showStatus(`❌ Error: ${errorMsg}`, "error");
    }
  };

  const showStatus = (message: string, type: "info" | "success" | "error") => {
    setStatusMessage(message);
    setStatusType(type);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setSelectedFile(file);
  
    setStatusMessage("");
  };

  const toggleImportModal = () => {
    setShowImportModal(!showImportModal);
    if (!showImportModal) {
      setSelectedFile(null);
      // setCsvPreview([]);
      setStatusMessage("");
      setCsvContent("");
    }
  };

  return (
    <AppLayout
      title={
        selectedGuest
          ? selectedGuest.guest_name ||
            `${selectedGuest.first_name}  ${selectedGuest.surname}`
          : "History"
      }
      showBack
      onBackClick={handleBackClick}
    >
   {!selectedGuest ? (
  <div>
    {/* Bulk Import Section */}
    <div className="mb-4 p-3 p-md-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-4 border border-blue-100 shadow-sm">
      <div className="row align-items-center g-3">
        
        {/* Title */}
        <div className="col-12 col-lg">
          <h6 className="fw-bold text-dark mb-0 d-flex align-items-center">
            📥 Bulk Import CSV Guests
          </h6>
        </div>

        {/* Buttons */}
        <div className="col-12 col-lg-auto">
          <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
            <a
              href="/sampleformat.csv"
              download="sample.csv"
              className="btn btn-sm text-white fw-semibold px-3 rounded-3"
              style={{
                background: "linear-gradient(135deg,#6c757d,#495057)",
                fontSize: "13px",
                minWidth: "140px",
              }}
            >
              Download Sample
            </a>

            <button
              onClick={toggleImportModal}
              className="btn btn-sm text-white fw-semibold px-3 rounded-3"
              style={{
                background: "linear-gradient(135deg,#0d6efd,#084298)",
                fontSize: "13px",
                minWidth: "120px",
              }}
            >
              Import CSV
            </button>
          </div>
        </div>
        </div>
        </div>
              
          {/* Guest List */}
          <GuestList onSelectGuest={handleSelectGuest} />
        </div>
      ) : (
        <GuestRecords guest={selectedGuest} summary={summary} />
      )}

      {/* CSV Import Modal */}
      {showImportModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
            onClick={toggleImportModal}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
                <h2 className="text-2xl font-bold">📊 CSV Bulk Import</h2>
                <p className="text-indigo-100">
                  Upload guest records in CSV format
                </p>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* File Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select CSV File
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-green-600 font-medium">
                      ✅ {selectedFile.name} (
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {/* Preview Table */}

                {/* Status */}
                {statusMessage && (
                  <div
                    className={`p-4 rounded-xl mb-4 text-sm font-medium ${
                      statusType === "success"
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : statusType === "error"
                          ? "bg-red-50 border border-red-200 text-red-800"
                          : "bg-blue-50 border border-blue-200 text-blue-800"
                    }`}
                  >
                    {statusMessage}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={toggleImportModal}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={importData}
                  disabled={!selectedFile}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  🚀 Import Data
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default GuestHistory;
