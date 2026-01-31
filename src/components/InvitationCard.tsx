import  { forwardRef } from 'react';

interface InvitationCardProps {
  eventData: {
    name: string;
    date: string;
    event_type: string;
    bride_groom_name?: string;
  };
  hostName?: string;
}

const InvitationCard = forwardRef<HTMLDivElement, InvitationCardProps>(
  ({ eventData, hostName = "Your Family" }, ref) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    return (
      <div 
        ref={ref}
        className="invitation-card"
        style={{
          width: '400px',
          height: '600px',
          background: 'linear-gradient(135deg, #ff6b6b, #ffd93d)',
          padding: '30px',
          borderRadius: '20px',
          color: 'white',
          fontFamily: 'serif',
          position: 'relative',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}
      >
        {/* Decorative Border */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          right: '15px',
          bottom: '15px',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '15px'
        }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
            🎉 You're Invited! 🎉
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            {hostName} cordially invites you to
          </div>
        </div>

        {/* Event Details */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            {eventData.event_type === 'marriage' ? '💒 Wedding Ceremony' : '🎊 Chandlo Celebration'}
          </div>
          
          <div style={{ 
            fontSize: '20px', 
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            {eventData.name}
          </div>

          {eventData.bride_groom_name && (
            <div style={{ 
              fontSize: '18px', 
              marginBottom: '20px',
              fontStyle: 'italic'
            }}>
              {eventData.bride_groom_name}
            </div>
          )}
        </div>

        {/* Date & Time */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          background: 'rgba(255,255,255,0.2)',
          padding: '20px',
          borderRadius: '15px'
        }}>
          <div style={{ fontSize: '16px', marginBottom: '10px' }}>
            📅 Date & Time
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {formatDate(eventData.date)}
          </div>
          <div style={{ fontSize: '16px', marginTop: '5px' }}>
            Time: 11:00 AM onwards
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center',
          position: 'absolute',
          bottom: '40px',
          left: '30px',
          right: '30px'
        }}>
          <div style={{ fontSize: '14px', marginBottom: '10px' }}>
            Your presence will make our celebration complete
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            With love and blessings ❤️
          </div>
        </div>
      </div>
    );
  }
);

InvitationCard.displayName = 'InvitationCard';

export default InvitationCard;