import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

import Auth from './pages/auth/Auth';
import Services from './pages/services/Services';
import SideNav from './pages/incident/SideNav';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/auth" />}/>
            <Route path="/auth" element={<Auth/>}/>
            <Route path="/services" element={<Services/>}/>
            <Route path="/incidents" element={<SideNav/>}/>
        </Routes>
    );
}

export default App;
