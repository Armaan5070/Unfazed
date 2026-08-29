import { useContext } from "react"
import { AuthContext } from "../context/authContext"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar(){
    const navigate = useNavigate();
    const {userData, logout} = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    function handleLogout(){
        logout();
        navigate("/");
    }
    return (
        <nav className="px-8 py-5">
            <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="logo">UNFAZED</div>

                {/* Desktop Menu */}
                <div className="hidden md:block options">
                    <ul className="flex items-center gap-5">
                        <li><Link to="/therapist/dashboard">Dashboard</Link></li>
                        <li> Clients</li>
                        <li><Link to="/therapist/schedule">Schedule</Link></li>
                        <li>Notes</li>
                        <li>Analytics</li>
                    </ul>
                </div>

                {/* Desktop Profile */}
                <div className="hidden md:block profile">
                    {userData ? (
                        <div className="flex items-center gap-5">
                            <div>{userData.name}</div>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>

                {/* Hamburger */}
                <button
                    className="md:hidden text-2xl"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? "✕" : "☰"}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden mt-5 border-t pt-5">
                    <ul className="flex flex-col gap-4">
                        <li>
                            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                                Dashboard
                            </Link>
                        </li>

                        <li>
                            <Link to="/clients" onClick={() => setMenuOpen(false)}>
                                Clients
                            </Link>
                        </li>

                        <li>
                            <Link to="/schedule" onClick={() => setMenuOpen(false)}>
                                Schedule
                            </Link>
                        </li>

                        <li>
                            <Link to="/notes" onClick={() => setMenuOpen(false)}>
                                Notes
                            </Link>
                        </li>

                        <li>
                            <Link to="/analytics" onClick={() => setMenuOpen(false)}>
                                Analytics
                            </Link>
                        </li>

                        <li className="pt-2 border-t">
                            {userData ? (
                                <div className="flex flex-col gap-3">
                                    <div>{userData.name}</div>
                                    <button
                                        className="text-left"
                                        onClick={() => {
                                            logout();
                                            setMenuOpen(false);
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}