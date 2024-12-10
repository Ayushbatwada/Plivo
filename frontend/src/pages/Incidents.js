import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Incidents() {
    const [incidents, setIncidents] = useState([]);
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Open');

    useEffect(() => {
        fetchIncidents();
    }, []);

    const fetchIncidents = async () => {
        const response = await axios.get('http://localhost:6000/v1/api/incidents/get/all');
        setIncidents(response.data);
    };

    const addIncident = async () => {
        await axios.post('http://localhost:6000/v1/api/incidents/create/new', {
            description,
            status,
        });
        setDescription('');
        fetchIncidents();
    };

    const resolveIncident = async (id) => {
        await axios.put(`http://localhost:6000/v1/api/incidents/update`, {
            serviceId: id,
            status: 'Resolved',
        });
        fetchIncidents();
    };

    return (
        <div className="min-h-screen bg-pinkTheme-light p-8">
            <h1 className="text-3xl font-bold text-pinkTheme-dark text-center mb-6">
                Manage Incidents
            </h1>
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter incident description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="p-2 border rounded w-2/3 mr-2 focus:outline-none focus:ring-2 focus:ring-pinkTheme"
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pinkTheme"
                    >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                    <button
                        onClick={addIncident}
                        className="bg-pinkTheme text-white px-4 py-2 ml-2 rounded hover:bg-pinkTheme-dark transition"
                    >
                        Add Incident
                    </button>
                </div>
                <ul>
                    {incidents.map((incident) => (
                        <li
                            key={incident.id}
                            className="flex justify-between items-center py-2 px-4 border-b"
                        >
              <span>
                <strong>{incident.description}</strong> - {incident.status}
              </span>
                            {incident.status !== 'Resolved' && (
                                <button
                                    onClick={() => resolveIncident(incident.id)}
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                                >
                                    Resolve
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Incidents;
