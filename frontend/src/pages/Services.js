import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Services() {
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState('');
    const [status, setStatus] = useState('Operational');

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        const response = await axios.get('http://localhost:6000/v1/api/services/get/all');
        setServices(response.data);
    };

    const addService = async () => {
        await axios.post('http://localhost:6000/v1/api/services/cretae/new', {
            name: newService,
            status,
        });
        setNewService('');
        fetchServices();
    };

    const deleteService = async (id) => {
        await axios.delete(`http://localhost:6000/v1/api/services/update`, {serviceId: id});
        fetchServices();
    };

    return (
        <div className="min-h-screen bg-pinkTheme-light p-8">
            <h1 className="text-3xl font-bold text-pinkTheme-dark text-center mb-6">
                Manage Services
            </h1>
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter service name"
                        value={newService}
                        onChange={(e) => setNewService(e.target.value)}
                        className="p-2 border rounded w-2/3 mr-2 focus:outline-none focus:ring-2 focus:ring-pinkTheme"
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pinkTheme"
                    >
                        <option value="Operational">Operational</option>
                        <option value="Degraded Performance">Degraded Performance</option>
                        <option value="Partial Outage">Partial Outage</option>
                        <option value="Major Outage">Major Outage</option>
                    </select>
                    <button
                        onClick={addService}
                        className="bg-pinkTheme text-white px-4 py-2 ml-2 rounded hover:bg-pinkTheme-dark transition"
                    >
                        Add
                    </button>
                </div>
                <ul>
                    {services.map((service) => (
                        <li
                            key={service.id}
                            className="flex justify-between items-center py-2 px-4 border-b"
                        >
              <span>
                <strong>{service.name}</strong> - {service.status}
              </span>
                            <button
                                onClick={() => deleteService(service.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Services;
