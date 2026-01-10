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
        className="card border-0 shadow-sm rounded-4 text-center p-3"
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <div
          className={`mx-auto mb-2 d-flex align-items-center justify-content-center bg-${color} bg-opacity-10 text-${color}`}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            fontSize: 20,
          }}
        >
          {icon}
        </div>

        <div className="fw-semibold small">{label}</div>
      </div>
    </div>
  );
};

export default DashboardCard;
