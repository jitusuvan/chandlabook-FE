import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AppLayout from '../layouts/AppLayout';
import useApi from '../hooks/useApi';


interface Event {
  id: string;
  name: string;
  date: string;
  event_type: string;
}

const AddExpense = () => {
  const navigate = useNavigate();
  const { Get, Post } = useApi();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    eventId: '',
    name: '',
    amount: '',
    notes: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await Get('events');
      let eventData = [];
      if (Array.isArray(response)) {
        eventData = response;
      } else if (response && Array.isArray(response.results)) {
        eventData = response.results;
      }
      setEvents(eventData);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.eventId) {
      toast.error('Please select an event');
      return;
    }
    
    if (!formData.name.trim() || !formData.amount) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      const payload = {
        event: formData.eventId,
        name: formData.name.trim(),
        amount: parseFloat(formData.amount),
        notes: formData.notes.trim() || null
      };

      await Post('expense', payload);
      toast.success('Expense added successfully!');
      
      // Reset form
      setFormData({ eventId: '', name: '', amount: '', notes: '' });
      
      // Navigate to expenses list
      navigate('/expenses');
    } catch (error: any) {
      console.error('Failed to save expense:', error);
      toast.error(error.response?.data?.message || 'Failed to save expense');
    }
  };

  const resetForm = () => {
    setFormData({ eventId: '', name: '', amount: '', notes: '' });
  };

  if (loading) {
    return (
      <AppLayout title="Add Expense" showBack>
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Add Expense" showBack>
      <div className="px-2">
        <div className="card border-0 shadow-sm mb-4 rounded-4">
          <div className="card-body">
            <h6 className="fw-semibold mb-3">Add New Expense</h6>

            <div className="mb-3">
              <label className="form-label fw-semibold">Select Event *</label>
              <select
                className="form-select form-select-lg rounded-4"
                value={formData.eventId}
                onChange={(e) => setFormData({...formData, eventId: e.target.value})}
              >
                <option value="">Choose an event...</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {new Date(event.date).toLocaleDateString('en-IN')}
                  </option>
                ))}
              </select>
            </div>
              
            <div className="mb-3">
              <label className="form-label fw-semibold">Expense Name *</label>
              <input
                type="text"
                className="form-control form-control-lg rounded-4"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
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