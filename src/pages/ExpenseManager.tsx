import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AppLayout from '../layouts/AppLayout';
import useApi from '../hooks/useApi';
import { FaEdit, FaTrash, FaRupeeSign, FaFileInvoiceDollar } from 'react-icons/fa';

interface Expense {
  id: string;
  name: string;
  amount: number;
  notes?: string;
  created_at: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  event_type: string;
}

const ExpenseManager = () => {
  // const navigate = useNavigate();
  const { Get, Post, Put, Delete } = useApi();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    eventId: '',
    name: '',
    amount: '',
    notes: ''
  });

  useEffect(() => {
    fetchEvents();
    fetchAllExpenses();
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
    }
  };

  const fetchAllExpenses = async () => {
    try {
      const response = await Get("expense");
      console.log('All Expenses API response:', response);
      
      let expenseData = [];
      if (Array.isArray(response)) {
        expenseData = response;
      } else if (response && Array.isArray(response.results)) {
        expenseData = response.results;
      } else if (response && Array.isArray(response.data)) {
        expenseData = response.data;
      }
      
      setExpenses(expenseData);
    } catch (error) {
      console.error('Failed to fetch all expenses:', error);
      setExpenses([]);
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

      if (editingExpense) {
        await Put("expense", editingExpense.id, payload);
        toast.success('Expense updated successfully!');
      } else {
        await Post('expense', payload);
        toast.success('Expense added successfully!');
      }

      resetForm();
      fetchAllExpenses();
    } catch (error: any) {
      console.error('Failed to save expense:', error);
      toast.error(error.response?.data?.message || 'Failed to save expense');
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      eventId: '', // Will need event info from expense
      name: expense.name,
      amount: expense.amount.toString(),
      notes: expense.notes || ''
    });
  };

  const handleDelete = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      await Delete("expense", expenseId);
      toast.success('Expense deleted successfully!');
      fetchAllExpenses();
    } catch (error) {
      console.error('Failed to delete expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const resetForm = () => {
    setFormData({ eventId: '', name: '', amount: '', notes: '' });
    setEditingExpense(null);
  };

  const getTotalExpenses = () => {
    if (!Array.isArray(expenses)) return 0;
    return expenses.reduce((total, expense) => total + (expense.amount || 0), 0);
  };

  if (loading) {
    return (
      <AppLayout title="All Expenses" showBack>
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="All Expenses" showBack>
      <div className="px-2">
        <div className="card border-0 shadow-sm mb-4 bg-primary text-white rounded-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">All Events</h6>
                <small className="opacity-75">Total Expenses</small>
              </div>
              <div className="text-end">
                <h4 className="mb-0">₹{getTotalExpenses().toLocaleString()}</h4>
                <small className="opacity-75">{Array.isArray(expenses) ? expenses.length : 0} items</small>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4 rounded-4">
          <div className="card-body">
            <h6 className="fw-semibold mb-3">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h6>

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
                {editingExpense ? 'Update' : 'Add'} Expense
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

        {Array.isArray(expenses) && expenses.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-semibold mb-0">All Expenses</h6>
          </div>
        )}

        {!Array.isArray(expenses) || expenses.length === 0 ? (
          <div className="text-center py-3">
            <FaFileInvoiceDollar size={32} className="text-muted mb-2" />
            <p className="text-muted small">No expenses found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="card border-0 shadow-sm rounded-4 mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6 className="fw-semibold mb-1">{expense.name}</h6>
                      <div className="d-flex align-items-center mb-2">
                        <FaRupeeSign className="text-success me-1" />
                        <span className="fw-bold text-success">
                          {expense.amount.toLocaleString()}
                        </span>
                      </div>
                      {expense.notes && (
                        <p className="text-muted small mb-2">{expense.notes}</p>
                      )}
                      <small className="text-muted">
                        {new Date(expense.created_at).toLocaleDateString('en-IN')}
                      </small>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary rounded-pill"
                        onClick={() => handleEdit(expense)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill"
                        onClick={() => handleDelete(expense.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ExpenseManager;