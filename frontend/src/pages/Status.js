import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Status() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        const response = await axios.get('http://localhost:6000/v1/api/services/get/all');
        setServices(response.data);
    };

    return (
        <div className="min-h-screen bg-pinkTheme-light p-8">
            <h1 className="text-3xl font-bold text-pinkTheme-dark text-center mb-6">
                Public Status Page
            </h1>
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <ul>
                    {services.map((service) => (
                        <li
                            key={service.id}
                            className="flex justify-between py-2 px-4 border-b text-gray-700"
                        >
                            <span>{service.name}</span>
                            <span
                                className={`${
                                    service.status === 'Operational'
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                }`}
                            >
                {service.status}
              </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Status;
