import { useState } from "react";
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
  const { GetPaginatedData } = useApi();
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [summary, setSummary] = useState<GuestSummary | null>(null);



  const handleSelectGuest = async (guest: Guest) => {
    setSelectedGuest(guest);
    try {
      const result = await GetPaginatedData("guestRecord", { 
        queryParams: { guest: guest.id } 
      });
      
      if (result.data && result.data.length > 0) {
        const firstResult = result.data[0];
        if (firstResult.aavel_total !== undefined) {
          setSummary({
            aavel_total: firstResult.aavel_total,
            mukel_total: firstResult.mukel_total,
            difference: firstResult.difference
          });
        }
        
        // Update guest with guest_name if available
        const recordWithGuestName = result.data.find((record: any) => record.guest_name);
        if (recordWithGuestName && recordWithGuestName.guest_name) {
          setSelectedGuest(prev => prev ? {...prev, guest_name: recordWithGuestName.guest_name} : null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch records", error);
    }
  };





  return (
    <AppLayout 
      title={selectedGuest ? (selectedGuest.guest_name || `${selectedGuest.first_name}  ${selectedGuest.surname}`) : "History"}
      summaryCards={summary ? (
        <div className="row g-2 mt-3 mx-1">
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
      ) : undefined}
      showBack
    >
      {!selectedGuest ? (
        <GuestList onSelectGuest={handleSelectGuest} />
      ) : (
        <GuestRecords guest={selectedGuest} />
      )}

    </AppLayout>
  );
};

export default GuestHistory;
