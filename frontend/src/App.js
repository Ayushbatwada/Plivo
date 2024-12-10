import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import Incidents from './pages/Incidents';
import StatusPage from './pages/Status';
import Login from './pages/Login';
import Navbar from './components/Navbar';

function App() {
  return (
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
  );
}

export default App;
