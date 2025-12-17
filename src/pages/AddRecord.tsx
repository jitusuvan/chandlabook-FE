import AppLayout from "../layouts/AppLayout";

const AddRecord = () => {
  return (
    <AppLayout title="Add Record" showBack>
      
      {/* 🔍 SEARCH GUEST */}
      <div className="mb-4">
        <label className="form-label fw-semibold">Search Guest</label>
        <div className="input-group input-group-lg">
          <span className="input-group-text bg-white">
            🔍
          </span>
          <input
            className="form-control"
            placeholder="Search by name or village..."
          />
        </div>
        <div className="text-end mt-2">
          <button className="btn btn-outline-danger btn-sm rounded-pill">
            Cancel
          </button>
        </div>
      </div>

      {/* 👤 GUEST INFO */}
      <h6 className="fw-bold mb-3">Guest Information</h6>

      <div className="row g-3 mb-3">
        <div className="col-6">
          <input className="form-control form-control-lg" placeholder="First name" />
        </div>
        <div className="col-6">
          <input className="form-control form-control-lg" placeholder="Father's name" />
        </div>
        <div className="col-6">
          <input className="form-control form-control-lg" placeholder="Surname" />
        </div>
        <div className="col-6">
          <input className="form-control form-control-lg" placeholder="Village" />
        </div>
      </div>

      <div className="text-end mb-3">
        <button className="btn btn-outline-danger rounded-pill px-3">
          Multiple Records
        </button>
      </div>

      {/* 📅 RECORD DETAILS */}
      <div className="row g-3 mb-3">
        <div className="col-6">
          <input type="date" className="form-control form-control-lg" />
        </div>
        <div className="col-6">
          <input
            type="number"
            className="form-control form-control-lg"
            placeholder="Enter amount"
          />
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-6">
          <select className="form-select form-select-lg">
            <option>Aavel</option>
            <option>Mukel</option>
          </select>
        </div>
        <div className="col-6">
          <select className="form-select form-select-lg">
            <option>Chandlo</option>
            <option>Marriage</option>
          </select>
        </div>
      </div>

      <div className="form-check mb-4">
        <input className="form-check-input" type="checkbox" />
        <label className="form-check-label">Pay Later</label>
      </div>

      {/* ✅ SUBMIT */}
      <button className="btn btn-danger w-100 btn-lg rounded-pill">
        Save Record
      </button>

    </AppLayout>
  );
};

export default AddRecord;
