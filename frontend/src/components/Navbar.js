import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="bg-pinkTheme-dark text-white py-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Status App</h1>
                <ul className="flex space-x-6">
                    <li>
                        <Link
                            to="/"
                            className="hover:bg-pinkTheme-light hover:text-pinkTheme-dark px-4 py-2 rounded transition"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/services"
                            className="hover:bg-pinkTheme-light hover:text-pinkTheme-dark px-4 py-2 rounded transition"
                        >
                            Services
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/incidents"
                            className="hover:bg-pinkTheme-light hover:text-pinkTheme-dark px-4 py-2 rounded transition"
                        >
                            Incidents
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/status"
                            className="hover:bg-pinkTheme-light hover:text-pinkTheme-dark px-4 py-2 rounded transition"
                        >
                            Public Status
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                window.location.href = '/login';
                            }}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
