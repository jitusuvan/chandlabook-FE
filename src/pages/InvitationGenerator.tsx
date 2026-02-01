import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AppLayout from '../layouts/AppLayout';
import EditableInvitationCard from '../components/EditableInvitationCard';
import useApi from '../hooks/useApi';
import { FaWhatsapp, FaImage, FaFilePdf } from 'react-icons/fa';

interface EventData {
  id: number;
  name: string;
  date: string;
  event_type: string;
  bride_groom_name?: string;
}

interface Guest {
  id: number;
  name: string;
  phone: string;
}

const InvitationGenerator = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { Get } = useApi();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<number[]>([]);
  const [hostName, setHostName] = useState('Your Family');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetchEventData();
      fetchGuests();
    }
  }, [eventId]);

  const fetchEventData = async () => {
    try {
      const response = await Get("events",eventId);
      setEventData(response);
    } catch (error) {
      console.error('Failed to fetch event:', error);
      toast.error('Failed to load event details');
      navigate('/events');
    }
  };

  const fetchGuests = async () => {
    try {
      const response = await Get(`events/${eventId}/guests`);
      setGuests(response || []);
    } catch (error) {
      console.error('Failed to fetch guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAsPDF = () => {
    if (!eventData) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 400;
    canvas.height = 600;
    
    const gradient = ctx.createLinearGradient(0, 0, 400, 600);
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(1, '#ffd93d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 600);
    
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 15, 370, 570);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 You\'re Invited! 🎉', 200, 100);
    
    ctx.font = '14px serif';
    ctx.fillText(`${hostName} cordially invites you to`, 200, 130);
    
    ctx.font = 'bold 28px serif';
    const eventTypeText = eventData.event_type === 'marriage' ? '💒 Wedding Ceremony' : '🎊 Chandlo Celebration';
    ctx.fillText(eventTypeText, 200, 200);
    
    ctx.font = 'bold 20px serif';
    ctx.fillText(eventData.name, 200, 240);
    
    if (eventData.bride_groom_name) {
      ctx.font = 'italic 18px serif';
      ctx.fillText(eventData.bride_groom_name, 200, 270);
    }
    
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(50, 320, 300, 80);
    ctx.fillStyle = 'white';
    
    ctx.font = '16px serif';
    ctx.fillText('📅 Date & Time', 200, 345);
    
    const formattedDate = new Date(eventData.date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    ctx.font = 'bold 18px serif';
    ctx.fillText(formattedDate, 200, 370);
    
    ctx.font = '16px serif';
    ctx.fillText('Time: 11:00 AM onwards', 200, 390);
    
    ctx.font = '14px serif';
    ctx.fillText('Your presence will make our celebration complete', 200, 500);
    
    ctx.font = '12px serif';
    ctx.fillText('With love and blessings ❤️', 200, 530);
    
    const link = document.createElement('a');
    link.download = `${eventData.name}-invitation.pdf`;
    link.href = canvas.toDataURL('image/png');
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${eventData.name} - Invitation</title>
            <style>
              body { margin: 0; padding: 0; }
              img { width: 100%; height: 100vh; object-fit: contain; }
            </style>
          </head>
          <body>
            <img src="${canvas.toDataURL()}" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    
    toast.success('PDF ready for download!');
  };

  const generateAndShare = () => {
  // 1️⃣ generate image (same as your downloadAsImage)
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx || !eventData) return;

  canvas.width = 400;
  canvas.height = 600;

  const gradient = ctx.createLinearGradient(0, 0, 400, 600);
  gradient.addColorStop(0, '#ff6b6b');
  gradient.addColorStop(1, '#ffd93d');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 600);

  ctx.fillStyle = 'white';
  ctx.font = 'bold 22px serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎉 You’re Invited!', 200, 80);
  ctx.fillText(eventData.name, 200, 140);

  // 2️⃣ auto download
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'invitation.png';
  link.click();

  // 3️⃣ open WhatsApp with message
  const message = `🎉 You're invited to ${eventData.name} 🎉
Please see the invitation image above ❤️`;
  window.open(
    `https://wa.me/?text=${encodeURIComponent(message)}`,
    '_blank'
  );

  toast.success('Image ready! Attach it in WhatsApp & send ✅');
};

  const downloadAsImage = () => {
    if (!cardRef.current) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 400;
    canvas.height = 600;
    
    const gradient = ctx.createLinearGradient(0, 0, 400, 600);
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(1, '#ffd93d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 600);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 You\'re Invited! 🎉', 200, 80);
    
    ctx.font = '14px serif';
    ctx.fillText(`${hostName} cordially invites you to`, 200, 110);
    
    ctx.font = 'bold 20px serif';
    const eventTypeText = eventData?.event_type === 'marriage' ? '💒 Wedding' : '🎊 Chandlo';
    ctx.fillText(eventTypeText, 200, 150);
    
    ctx.font = 'bold 18px serif';
    ctx.fillText(eventData?.name || '', 200, 190);
    
    if (eventData?.bride_groom_name) {
      ctx.font = 'italic 16px serif';
      ctx.fillText(eventData.bride_groom_name, 200, 220);
    }
    
    ctx.font = '16px serif';
    ctx.fillText('📅 Date & Time', 200, 280);
    
    const formattedDate = new Date(eventData?.date || '').toLocaleDateString('en-IN');
    ctx.font = '14px serif';
    ctx.fillText(formattedDate, 200, 310);
    ctx.fillText('Time: 11:00 AM onwards', 200, 330);
    
    ctx.font = '12px serif';
    ctx.fillText('Your presence will make our celebration complete', 200, 450);
    ctx.fillText('With love and blessings ❤️', 200, 480);
    
    const link = document.createElement('a');
    link.download = `${eventData?.name || 'invitation'}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast.success('Image downloaded successfully!');
  };
  const shareToWhatsApp = (guest?: Guest) => {
    if (!eventData) return;

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const message = `🎉 *You're Invited!* 🎉

${hostName} cordially invites you to

*${eventData.event_type === 'marriage' ? '💒 Wedding Ceremony' : '🎊 Chandlo Celebration'}*

*${eventData.name}*
${eventData.bride_groom_name ? `${eventData.bride_groom_name}\n` : ''}

📅 *Date:* ${formatDate(eventData.date)}

⏰ *Time:* 11:00 AM onwards

Your presence will make our celebration complete ❤️

With love and blessings`;

    const encodedMessage = encodeURIComponent(message);
    
    if (guest?.phone) {
      const phoneNumber = guest.phone.replace(/[^\d]/g, '');
      window.open(`https://wa.me/91${phoneNumber}?text=${encodedMessage}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    }
  };

  const bulkWhatsAppShare = () => {
    if (selectedGuests.length === 0) {
      toast.error('Please select guests to share with');
      return;
    }

    selectedGuests.forEach((guestId, index) => {
      const guest = guests.find(g => g.id === guestId);
      if (guest) {
        setTimeout(() => {
          shareToWhatsApp(guest);
        }, index * 1000);
      }
    });

    toast.success(`Sharing with ${selectedGuests.length} guests`);
  };

  const toggleGuestSelection = (guestId: number) => {
    setSelectedGuests(prev => 
      prev.includes(guestId) 
        ? prev.filter(id => id !== guestId)
        : [...prev, guestId]
    );
  };

  const selectAllGuests = () => {
    setSelectedGuests(Array.isArray(guests) ? guests.map(g => g.id) : []);
  };

  const clearSelection = () => {
    setSelectedGuests([]);
  };

  if (loading) {
    return (
      <AppLayout title="Generate Invitation" showBack>
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!eventData) {
    return (
      <AppLayout title="Generate Invitation" showBack>
        <div className="text-center py-5">
          <p>Event not found</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Generate Invitation" showBack>
      <div className="px-2">
        <div className="mb-4">
          <label className="form-label fw-semibold">Host Name</label>
          <input
            type="text"
            className="form-control form-control-lg rounded-4"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            placeholder="Your Family Name"
          />
        </div>

        <div className="text-center mb-4">
          <h6 className="fw-semibold mb-3">Invitation Preview</h6>
          <div className="d-flex justify-content-center">
            <EditableInvitationCard 
              eventData={eventData}
              hostName={hostName}
            />
          </div>
        </div>

        <div className="row g-2 mb-4">
          <div className="col-4">
            <button
              className="btn btn-danger w-100 rounded-4"
              onClick={downloadAsPDF}
            >
              <FaFilePdf className="me-1" />
              PDF
            </button>
          </div>
          <div className="col-4">
            <button
              className="btn btn-warning w-100 rounded-4"
              onClick={downloadAsImage}
            >
              <FaImage className="me-1" />
              Image
            </button>
          </div>
          <div className="col-4">
            <button
              className="btn btn-success w-100 rounded-4"
              onClick={() => generateAndShare()}
            >
              <FaWhatsapp className="me-1" />
              Share
            </button>
          </div>
        </div>

        {Array.isArray(guests) && guests.length > 0 && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-semibold mb-0">Bulk WhatsApp Share</h6>
                <div>
                  <button 
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={selectAllGuests}
                  >
                    Select All
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={clearSelection}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {Array.isArray(guests) && guests.map(guest => (
                  <div key={guest.id} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`guest-${guest.id}`}
                      checked={selectedGuests.includes(guest.id)}
                      onChange={() => toggleGuestSelection(guest.id)}
                    />
                    <label className="form-check-label" htmlFor={`guest-${guest.id}`}>
                      {guest.name} {guest.phone && `(${guest.phone})`}
                    </label>
                  </div>
                ))}
              </div>

              <button
                className="btn btn-success w-100 rounded-4"
                onClick={bulkWhatsAppShare}
                disabled={selectedGuests.length === 0}
              >
                <FaWhatsapp className="me-2" />
                Send to {selectedGuests.length} Selected Guests
              </button>
            </div>
          </div>
        )}

        <div className="alert alert-info rounded-4 mt-4">
          <small>
            💡 <strong>Tip:</strong> You can take a screenshot of the invitation card above to save as an image, or use your browser's print function to save as PDF.
          </small>
        </div>
      </div>
    </AppLayout>
  );
};

export default InvitationGenerator;