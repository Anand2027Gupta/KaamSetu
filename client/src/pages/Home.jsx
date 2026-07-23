import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Users } from 'lucide-react';

const Home = () => {
    return (
        <div className="fade-in">
            <header className="header">
                <h1 className="logo">KaamSetu</h1>
                <p>Connecting Workers to Work in UP</p>
            </header>

            <main className="card mt-2">
                <div className="text-center">
                    <h2 style={{ color: 'var(--navy)', marginBottom: '1rem' }}>Welcome to KaamSetu</h2>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>
                        Find reliable workers or find your next job across Uttar Pradesh.
                    </p>
                </div>

                <Link to="/register" className="btn btn-saffron" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Users size={20} />
                    Create Account
                </Link>

                <Link to="/login" className="btn btn-green" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Search size={20} />
                    Hire Workers
                </Link>

                <Link to="/login" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <MapPin size={20} />
                    Find Work (Login)
                </Link>
            </main>

            <footer style={{ marginTop: 'auto', padding: '2rem', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
                <p>© 2026 KaamSetu • Made for Uttar Pradesh</p>
            </footer>
        </div>
    );
};

export default Home;
