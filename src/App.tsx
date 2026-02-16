

import './App.css'
import './styles/global.css'
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PublicRoute from './components/PublicRoute';
import Dashboard from './pages/Dashboard';
import AddRecord from './pages/AddRecord';
import GuestHistory from './pages/GuestHistory';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import CreateEvent from './pages/CreateEvent';
import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import EventsList from './pages/EventsList';
import InvitationGenerator from './pages/InvitationGenerator';
import ExpenseManagement from './pages/ExpenseManagement';
// import ExpenseManager from './pages/ExpenseManager';
import AddExpense from './pages/AddExpense';
import ViewExpenses from './pages/ViewExpenses';


function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password/:temp_token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/add-record" element={<ProtectedRoute><AddRecord /></ProtectedRoute>} />
      <Route path="/guest-history" element={<ProtectedRoute><GuestHistory /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute><EventsList /></ProtectedRoute>} />
      <Route path="/events/:eventId/invitation" element={<ProtectedRoute><InvitationGenerator /></ProtectedRoute>} />
      <Route path="/events/:eventId/expenses" element={<ProtectedRoute><ExpenseManagement /></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><ViewExpenses /></ProtectedRoute>} />
      <Route path="/add-expense" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
