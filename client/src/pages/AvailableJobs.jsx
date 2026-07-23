import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, Calendar, Search } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const AvailableJobs = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        location: ''
    });

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const query = new URLSearchParams(filters).toString();
            const res = await axios.get(`http://localhost:5000/api/worker/available-jobs?${query}`, {
                headers: { 'x-auth-token': token }
            });
            if (res.data.success) {
                setJobs(res.data.data);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    const startChat = async (jobId, employerId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/chat/init', {
                recipientId: employerId,
                jobId: jobId
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

    useEffect(() => {
        fetchJobs();
    }, []);

    const onFilterChange = e => setFilters({ ...filters, [e.target.name]: e.target.value });

    return (
        <div className="fade-in">
            <header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                <Link to="/dashboard" style={{ color: 'white' }}><ArrowLeft /></Link>
                <h1 className="logo" style={{ fontSize: '1.2rem' }}>{t('find_work')}</h1>
                <div style={{ width: '24px' }}></div>
            </header>

            <div style={{ padding: '1rem' }}>
                <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <select
                            name="category"
                            value={filters.category}
                            onChange={onFilterChange}
                            style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                        >
                            <option value="">{t('skill')}</option>
                            <option value="Painter">Painter</option>
                            <option value="Carpenter">Carpenter</option>
                            <option value="Laborer">Laborer</option>
                        </select>
                        <input
                            type="text"
                            name="location"
                            placeholder={t('location')}
                            value={filters.location}
                            onChange={onFilterChange}
                            style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                        />
                        <button onClick={fetchJobs} className="btn-green" style={{ padding: '0 1rem', borderRadius: '8px', border: 'none' }}>
                            <Search size={20} color="white" />
                        </button>
                    </div>
                </div>

                {loading ? <p className="text-center">Finding jobs...</p> : (
                    jobs.length === 0 ? (
                        <div className="text-center" style={{ marginTop: '2rem', padding: '2rem', color: '#888' }}>
                            <Briefcase size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                            <p>No jobs found for your criteria.</p>
                        </div>
                    ) : (
                        jobs.map(job => (
                            <div key={job._id} className="card" style={{ margin: '0 0 1rem 0', padding: '1.2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ color: 'var(--saffron)' }}>{job.title}</h3>
                                        <p style={{ color: '#666', fontSize: '0.9rem' }}>{job.category}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            ₹{job.wage}/day
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '15px', marginTop: '1rem', color: '#555', fontSize: '0.9rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <MapPin size={16} /> {job.location}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Calendar size={16} /> {job.duration}
                                    </span>
                                </div>

                                <button
                                    onClick={() => startChat(job._id, job.employer?._id || job.employer)}
                                    className="btn btn-green"
                                    style={{ marginTop: '1rem', padding: '0.7rem', fontSize: '1rem' }}
                                >
                                    Chat with Employer
                                </button>
                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default AvailableJobs;
