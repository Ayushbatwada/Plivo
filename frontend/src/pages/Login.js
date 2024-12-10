import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:6000/v1/api/login', { email, password });
            localStorage.setItem('token', response.data.token); // Save the token to local storage
            navigate('/'); // Redirect to the home page after login
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-pinkTheme-light">
            <div className="bg-white shadow-xl rounded-lg p-8 w-96">
                <h1 className="text-3xl font-bold text-pinkTheme-dark mb-6 text-center">Welcome Back</h1>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-pinkTheme-dark font-medium mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 border border-pinkTheme-dark rounded focus:outline-none focus:ring-2 focus:ring-pinkTheme"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-pinkTheme-dark font-medium mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 border border-pinkTheme-dark rounded focus:outline-none focus:ring-2 focus:ring-pinkTheme"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-pinkTheme hover:bg-pinkTheme-dark text-white font-bold rounded transition duration-300"
                    >
                        Login
                    </button>
                </form>
                <p className="text-sm text-center text-gray-500 mt-4">
                    Don't have an account?{' '}
                    <a href="/register" className="text-pinkTheme-dark font-medium">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Login;
