

import './App.css'
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PublicRoute from './components/PublicRoute';
import Dashboard from './pages/Dashboard';
import AddRecord from './pages/AddRecord';
import GuestHistory from './pages/GuestHistory';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import CreateEvent from './pages/CreateEvent';
import EventsList from './pages/EventsList';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/add-record" element={<ProtectedRoute><AddRecord /></ProtectedRoute>} />
      <Route path="/guest-history" element={<ProtectedRoute><GuestHistory /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute><EventsList /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
