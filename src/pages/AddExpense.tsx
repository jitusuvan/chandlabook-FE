import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AppLayout from '../layouts/AppLayout';
import useApi from '../hooks/useApi';
import PaginatedSearchSelect from '../components/ui/PaginatedSearchSelect';
import { capitalizeFirst } from '../utils/textUtils';

interface Event {
  id: string;
  name: string;
  date: string;
  event_type: string;
}

const AddExpense = () => {
  const navigate = useNavigate();
  const { Post } = useApi();
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    notes: ''
  });

  const handleSubmit = async () => {
    if (!selectedEvent) {
      toast.error('Please select an event');
      return;
    }
    
    if (!formData.name.trim() || !formData.amount) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      const payload = {
        event: selectedEvent.id,
        name: formData.name.trim(),
        amount: parseFloat(formData.amount),
        notes: formData.notes.trim() || null
      };

      await Post('expense', payload);
      toast.success('Expense added successfully!');
      
      resetForm();
      navigate('/expenses');
    } catch (error: any) {
      console.error('Failed to save expense:', error);
      toast.error(error.response?.data?.message || 'Failed to save expense');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', amount: '', notes: '' });
    setSelectedEvent(null);
  };

  return (
    <AppLayout title="Add Expense" showBack>
      <div className="px-2">
        <div className="card border-0 shadow-sm mb-4 rounded-4">
          <div className="card-body">
            <h6 className="fw-semibold mb-3">Add New Expense</h6>

            <div className="mb-3">
              <label className="form-label fw-semibold">Select Event *</label>
              <PaginatedSearchSelect
                api="events"
                getOptionLabel={(event) => `${event.name} - ${new Date(event.date).toLocaleDateString()}`}
                onSelect={(event) => setSelectedEvent(event)}
                value={selectedEvent}
                placeholder="Search and select event..."
              />
            </div>
              
            <div className="mb-3">
              <label className="form-label fw-semibold">Expense Name *</label>
              <input
                type="text"
                className="form-control form-control-lg rounded-4"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: capitalizeFirst(e.target.value)})}
                placeholder="e.g., Decoration, Catering, etc."
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Amount *</label>
              <div className="input-group input-group-lg">
                <span className="input-group-text">₹</span>
                <input
                  type="number"
                  className="form-control rounded-end-4"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Notes</label>
              <textarea
                className="form-control rounded-4"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: capitalizeFirst(e.target.value)})}
                placeholder="Additional details (optional)"
              />
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-danger flex-fill rounded-4"
                onClick={handleSubmit}
              >
                Add Expense
              </button>
              <button
                className="btn btn-outline-secondary flex-fill rounded-4"
                onClick={resetForm}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="alert alert-info rounded-4">
          <small>
            💡 <strong>Tip:</strong> After adding the expense, you'll be redirected to view all expenses.
          </small>
        </div>
      </div>
    </AppLayout>
  );
};

export default AddExpense;