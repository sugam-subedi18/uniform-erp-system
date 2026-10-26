import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FabricInventory from './pages/FabricInventory';
import Orders from './pages/Orders';
import Dispatch from './pages/Dispatch';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/fabrics" element={<FabricInventory />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/dispatch" element={<Dispatch />} />
      <Route path="*" element={<h1 className="p-6">Page not found</h1>} />
    </Routes>
  );
}

export default App;
