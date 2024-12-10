import React, { useState } from 'react';

function IncidentForm({ onSubmit }) {
    const [description, setDescription] = useState('');
    const [serviceId, setServiceId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ description, serviceId });
        setDescription('');
        setServiceId('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <input
                type="text"
                placeholder="Incident Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2"
                required
            />
            <input
                type="text"
                placeholder="Service ID"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="border p-2 ml-2"
                required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 ml-2">Add</button>
        </form>
    );
}

export default IncidentForm;
