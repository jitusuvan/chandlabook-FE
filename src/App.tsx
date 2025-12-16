

import './App.css'
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PublicRoute from './components/PublicRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
// import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/dashboard" element={<PublicRoute><Dashboard /></PublicRoute>} />
      {/* Add more routes here as needed */}
    </Routes>
  );
}

export default App;
