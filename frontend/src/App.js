import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

import Auth from './pages/auth/Auth';
import Services from './pages/Services';
import Incidents from './pages/Incidents';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/auth" />}/>
            <Route path="/auth" element={<Auth/>}/>
            <Route path="/services" element={<Services/>}/>
            <Route path="/incidents" element={<Incidents/>}/>
        </Routes>
    );
}

export default App;
