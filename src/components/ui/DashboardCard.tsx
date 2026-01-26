type CardProps = {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
};

const DashboardCard = ({ icon, label, color, onClick }: CardProps) => {
  return (
    <div className="col-6">
      <div
        className="card border-0 shadow-sm rounded-4 text-center p-2"
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <div
          className={`mx-auto mb-1 d-flex align-items-center justify-content-center bg-${color} bg-opacity-10 text-${color}`}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            fontSize: 16,
          }}
        >
          {icon}
        </div>

        <div className="fw-semibold" style={{ fontSize: '0.75rem' }}>{label}</div>
      </div>
    </div>
  );
};

export default DashboardCard;
