import React, { useState } from 'react';

function ServiceForm({ onSubmit }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name });
        setName('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <input
                type="text"
                placeholder="Service Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2"
                required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 ml-2">Add</button>
        </form>
    );
}

export default ServiceForm;
