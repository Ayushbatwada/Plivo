import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
    const [services, setServices] = useState([]);
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        fetchOverviewData();
    }, []);

    const fetchOverviewData = async () => {
        try {
            const serviceResponse = await axios.get('http://localhost:6000/v1/api/services/get/all');
            const incidentResponse = await axios.get('http://localhost:6000/v1/api/incidents/get/all');
            setServices(serviceResponse.data);
            setIncidents(incidentResponse.data);
        } catch (error) {
            console.error('Error fetching overview data:', error);
        }
    };

    return (
        <div className="min-h-screen bg-pinkTheme-light p-8">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-pinkTheme-dark text-center mb-6">
                    Status Dashboard
                </h1>

                {/* Service Status Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-pinkTheme-dark mb-4">Services Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="bg-white shadow-md rounded-lg p-4 text-center border-t-4"
                                style={{
                                    borderColor:
                                        service.status === 'Operational'
                                            ? '#22c55e' // Green for operational
                                            : service.status === 'Degraded Performance'
                                                ? '#eab308' // Yellow for degraded
                                                : '#ef4444', // Red for outages
                                }}
                            >
                                <h3 className="text-xl font-bold text-pinkTheme-dark">{service.name}</h3>
                                <p
                                    className={`mt-2 ${
                                        service.status === 'Operational'
                                            ? 'text-green-500'
                                            : service.status === 'Degraded Performance'
                                                ? 'text-yellow-500'
                                                : 'text-red-500'
                                    } font-semibold`}
                                >
                                    {service.status}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recent Incidents Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-pinkTheme-dark mb-4">Recent Incidents</h2>
                    <div className="bg-white shadow-md rounded-lg p-6">
                        {incidents.length === 0 ? (
                            <p className="text-gray-600">No incidents reported recently.</p>
                        ) : (
                            <ul className="divide-y">
                                {incidents.map((incident) => (
                                    <li key={incident.id} className="py-4">
                                        <p className="text-lg font-semibold text-gray-800">{incident.description}</p>
                                        <p
                                            className={`text-sm ${
                                                incident.status === 'Resolved' ? 'text-green-500' : 'text-yellow-500'
                                            }`}
                                        >
                                            Status: {incident.status}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>

                {/* Add Quick Links */}
                <section className="text-center">
                    <h2 className="text-2xl font-semibold text-pinkTheme-dark mb-4">Quick Links</h2>
                    <div className="flex justify-center space-x-4">
                        <a
                            href="/services"
                            className="bg-pinkTheme hover:bg-pinkTheme-dark text-white px-6 py-3 rounded shadow-md transition"
                        >
                            Manage Services
                        </a>
                        <a
                            href="/incidents"
                            className="bg-pinkTheme hover:bg-pinkTheme-dark text-white px-6 py-3 rounded shadow-md transition"
                        >
                            Manage Incidents
                        </a>
                        <a
                            href="/status"
                            className="bg-pinkTheme hover:bg-pinkTheme-dark text-white px-6 py-3 rounded shadow-md transition"
                        >
                            Public Status
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;
