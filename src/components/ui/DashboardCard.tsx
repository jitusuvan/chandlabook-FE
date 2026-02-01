type CardProps = {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
};

const DashboardCard = ({ icon, label, color, onClick }: CardProps) => {
  return (
    <div className="col-6 col-md-4 col-lg-3 col-xl-2">
      <div
        className="card border-0 shadow-sm rounded-4 text-center p-2 p-md-3"
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <div
          className={`mx-auto mb-1 mb-md-2 d-flex align-items-center justify-content-center bg-${color} bg-opacity-10 text-${color}`}
          style={{
            width: window.innerWidth >= 768 ? 48 : 36,
            height: window.innerWidth >= 768 ? 48 : 36,
            borderRadius: "50%",
            fontSize: window.innerWidth >= 768 ? 20 : 16,
          }}
        >
          {icon}
        </div>

        <div className="fw-semibold" style={{ fontSize: window.innerWidth >= 768 ? '0.85rem' : '0.75rem' }}>{label}</div>
      </div>
    </div>
  );
};

export default DashboardCard;
