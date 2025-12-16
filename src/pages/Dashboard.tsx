import AppLayout from "../layouts/AppLayout";

const Dashboard = () => {
  return (
    <AppLayout title="Chandlabook" subtitle="Welcome back, jitendra">
      
      <div className="row g-3 mb-3">
        <div className="col-6">
          <div className="card p-3 shadow-sm">Add Record</div>
        </div>
        <div className="col-6">
          <div className="card p-3 shadow-sm">View History</div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-6">
          <div className="card p-3 shadow-sm">Today ₹300</div>
        </div>
        <div className="col-6">
          <div className="card p-3 shadow-sm">Upcoming ₹150</div>
        </div>
      </div>

    </AppLayout>
  );
};

export default Dashboard;
