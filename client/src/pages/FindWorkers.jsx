import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Star, MapPin, Phone, MessageSquare, ArrowUpDown } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const FindWorkers = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [workers, setWorkers] = useState([]);
    const [filters, setFilters] = useState({
        skill: '',
        district: '',
        minRating: '',
    });
    const [sortBy, setSortBy] = useState('rating'); // 'rating' or 'wage'
    const [loading, setLoading] = useState(false);

    const fetchWorkers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const query = new URLSearchParams(filters).toString();
            const res = await axios.get(`http://localhost:5000/api/employer/search-workers?${query}`, {
                headers: { 'x-auth-token': token }
            });

            if (res.data.success) {
                let sortedData = [...res.data.data];
                if (sortBy === 'rating') {
                    sortedData.sort((a, b) => b.rating - a.rating);
                } else {
                    sortedData.sort((a, b) => a.dailyWage - b.dailyWage);
                }
                setWorkers(sortedData);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkers();
    }, [sortBy]);

    const onFilterChange = e => setFilters({ ...filters, [e.target.name]: e.target.value });

    const startChat = async (workerId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/chat/init', {
                recipientId: workerId
            }, {
                headers: { 'x-auth-token': token }
            });
            if (res.data.success) {
                navigate(`/chat/${res.data.data._id}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const reportUser = async (userId) => {
        const reason = prompt("Describe the issue (e.g. Fraud, Bad behavior):");
        if (!reason) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/report', {
                reportedUserId: userId,
                reason
            }, {
                headers: { 'x-auth-token': token }
            });
            alert("Report submitted to Admin.");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fade-in">
            <header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                <Link to="/dashboard" style={{ color: 'white' }}><ArrowLeft /></Link>
                <h1 className="logo" style={{ fontSize: '1.2rem' }}>{t('find_workers')}</h1>
                <div style={{ width: '24px' }}></div>
            </header>

            <div style={{ padding: '1rem' }}>
                {/* Search Bar */}
                <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                        <select
                            name="skill"
                            value={filters.skill}
                            onChange={onFilterChange}
                            style={{ flex: 1, padding: '1rem', border: '2px solid #ddd', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold' }}
                        >
                            <option value="">{t('skill')}</option>
                            <option value="Painter">Painter (पेंटर)</option>
                            <option value="Carpenter">Carpenter (बढ़ई)</option>
                            <option value="Plumber">Plumber (प्लंबर)</option>
                            <option value="Electrician">Electrician (बिजली वाला)</option>
                            <option value="Mason">Mason (मिस्त्री)</option>
                            <option value="Laborer">Laborer (मजदूर)</option>
                        </select>
                        <button onClick={fetchWorkers} className="btn-green" style={{ border: 'none', borderRadius: '12px', padding: '0 1.2rem' }}>
                            <Search size={24} color="white" />
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            name="district"
                            placeholder={t('location')}
                            value={filters.district}
                            onChange={onFilterChange}
                            style={{ flex: 1, padding: '1rem', border: '2px solid #ddd', borderRadius: '12px' }}
                        />
                        <button
                            onClick={() => setSortBy(prev => prev === 'rating' ? 'wage' : 'rating')}
                            style={{ padding: '0 1rem', border: '2px solid var(--navy)', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            <ArrowUpDown size={18} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{sortBy === 'rating' ? 'Rating' : 'Wage'}</span>
                        </button>
                    </div>
                </div>

                {/* Worker List */}
                {loading ? <p className="text-center">Finding best workers...</p> : (
                    workers.length === 0 ? <p className="text-center">No workers found.</p> : (
                        workers.map(worker => (
                            <div key={worker._id} className="card" style={{ margin: '0 0 1rem 0', padding: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <img
                                        src={worker.profilePhoto || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                        alt="worker"
                                        style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #eee' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <h3 style={{ color: 'var(--navy)', fontSize: '1.2rem' }}>{worker.name}</h3>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <span
                                                    onClick={() => reportUser(worker.user || worker._id)}
                                                    style={{ cursor: 'pointer', opacity: 0.5 }}
                                                >
                                                    <AlertTriangle size={16} color="red" />
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbc02d', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    {worker.rating} <Star size={18} fill="#fbc02d" />
                                                </span>
                                            </div>
                                        </div>
                                        <p style={{ color: 'var(--saffron)', fontWeight: 'bold', fontSize: '1rem', marginTop: '4px' }}>{worker.skillCategory}</p>
                                        <p style={{ color: '#666', fontSize: '0.9rem' }}>{worker.experience} Years Exp.</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                    <div style={{ fontSize: '1rem', color: '#555' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={18} /> {worker.district}</span>
                                    </div>
                                    <div style={{ fontWeight: 'bold', color: 'var(--green)', fontSize: '1.2rem' }}>
                                        ₹{worker.dailyWage}/day
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '1.5rem' }}>
                                    <a href={`tel:${worker.phone}`} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.8rem', margin: 0 }}>
                                        <Phone size={20} />
                                    </a>
                                    <button onClick={() => startChat(worker.user || worker._id)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.8rem', margin: 0, color: 'var(--navy)', borderColor: 'var(--navy)' }}>
                                        <MessageSquare size={20} />
                                    </button>
                                    <button className="btn btn-green" style={{ color: 'white', padding: '0.8rem', margin: 0, fontWeight: 'bold' }}>
                                        {t('hire')}
                                    </button>
                                </div>
                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default FindWorkers;
