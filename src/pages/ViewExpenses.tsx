import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AppLayout from '../layouts/AppLayout';
import useApi from '../hooks/useApi';
import { FaEdit, FaTrash, FaRupeeSign, FaFileInvoiceDollar, FaPlus } from 'react-icons/fa';

interface Expense {
  id: string;
  name: string;
  amount: string | number;
  notes?: string;
  created_at: string;
  event_name?: string;
  event_date?: string;
}

const ViewExpenses = () => {
  const navigate = useNavigate();
  const { Get, Delete, Put } = useApi();
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    notes: ''
  });

  useEffect(() => {
    fetchAllExpenses();
  }, []);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      name: expense.name,
      amount: expense.amount.toString(),
      notes: expense.notes || ''
    });
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setEditingExpense(null);
    setShowEditModal(false);
    setFormData({ name: '', amount: '', notes: '' });
  };

  const handleUpdateExpense = async () => {
    if (!formData.name.trim() || !formData.amount) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        amount: parseFloat(formData.amount),
        notes: formData.notes.trim() || null
      };

      await Put("expense", editingExpense!.id, payload);
      toast.success('Expense updated successfully!');
      handleCloseEdit();
      fetchAllExpenses();
    } catch (error: any) {
      console.error('Failed to update expense:', error);
      toast.error('Failed to update expense');
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

  const getTotalExpenses = () => {
    if (!Array.isArray(expenses)) return 0;
    return expenses.reduce((total, expense) => total + (parseFloat(expense.amount.toString()) || 0), 0);
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

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-semibold mb-0">Expenses</h6>
          <button
            className="btn btn-danger btn-sm rounded-pill"
            onClick={() => navigate('/add-expense')}
          >
            <FaPlus className="me-1" />
            Add Expense
          </button>
        </div>

        {!Array.isArray(expenses) || expenses.length === 0 ? (
          <div className="text-center py-5">
            <FaFileInvoiceDollar size={48} className="text-muted mb-3" />
            <p className="text-muted">No expenses found</p>
            <button
              className="btn btn-outline-danger rounded-pill"
              onClick={() => navigate('/add-expense')}
            >
              Add Your First Expense
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="card border-0 shadow-sm rounded-4 mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6 className="fw-semibold mb-1">{expense.name}</h6>
                      {expense.event_name && (
                        <div className="d-flex align-items-center mb-1">
                          <small className="text-primary fw-semibold">{expense.event_name}</small>
                          {expense.event_date && (
                            <small className="text-muted ms-2">
                              • {new Date(expense.event_date).toLocaleDateString('en-IN')}
                            </small>
                          )}
                        </div>
                      )}
                      <div className="d-flex align-items-center mb-2">
                        <FaRupeeSign className="text-success me-1" />
                        <span className="fw-bold text-success">
                          {parseFloat(expense.amount.toString()).toLocaleString()}
                        </span>
                      </div>
                      {expense.notes && (
                        <p className="text-muted small mb-2">{expense.notes}</p>
                      )}
                    
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

        {/* Edit Modal */}
        {showEditModal && editingExpense && (
          <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog">
              <div className="modal-content rounded-4">
                <div className="modal-header">
                  <h6 className="modal-title fw-semibold">Edit Expense</h6>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleCloseEdit}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Expense Name *</label>
                    <input
                      type="text"
                      className="form-control rounded-4"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Decoration, Catering, etc."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Amount *</label>
                    <div className="input-group">
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
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary rounded-4" 
                    onClick={handleCloseEdit}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger rounded-4" 
                    onClick={handleUpdateExpense}
                  >
                    Update Expense
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ViewExpenses;