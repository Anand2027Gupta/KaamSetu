import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Briefcase, AlertTriangle, Trash2, CheckCircle } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, jobs: 0, reports: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('reports');
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const fetchData = async (tab) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/admin/${tab}`, {
                headers: { 'x-auth-token': token }
            });
            if (res.data.success) {
                setData(res.data.data);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData(activeTab);
    }, [activeTab]);

    const handleResolve = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/report/${id}`, {}, {
                headers: { 'x-auth-token': token }
            });
            fetchData('reports');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fade-in">
            <header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                <Link to="/dashboard" style={{ color: 'white' }}><ArrowLeft /></Link>
                <h1 className="logo" style={{ fontSize: '1.2rem' }}>Admin Control</h1>
                <div style={{ width: '24px' }}></div>
            </header>

            <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`btn ${activeTab === 'reports' ? 'btn-navy' : 'btn-outline'}`}
                        style={{ flex: 1 }}
                    >
                        <AlertTriangle size={18} /> Reports
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`btn ${activeTab === 'users' ? 'btn-navy' : 'btn-outline'}`}
                        style={{ flex: 1 }}
                    >
                        <Users size={18} /> Users
                    </button>
                    <button
                        onClick={() => setActiveTab('jobs')}
                        className={`btn ${activeTab === 'jobs' ? 'btn-navy' : 'btn-outline'}`}
                        style={{ flex: 1 }}
                    >
                        <Briefcase size={18} /> Jobs
                    </button>
                </div>

                {loading ? <p className="text-center">Loading admin data...</p> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {data.length === 0 ? <p className="text-center">No items found.</p> : (
                            data.map((item, idx) => (
                                <div key={idx} className="card" style={{ padding: '1rem' }}>
                                    {activeTab === 'reports' && (
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontWeight: 'bold', color: 'red' }}>Reason: {item.reason}</span>
                                                <span className={`badge ${item.status === 'Pending' ? 'bg-orange' : 'bg-green'}`}>{item.status}</span>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', margin: '5px 0' }}>Reported By: {item.reporter?.name}</p>
                                            <p style={{ fontSize: '0.9rem', margin: '5px 0' }}>Against: {item.reportedUser?.name}</p>
                                            {item.status === 'Pending' && (
                                                <button onClick={() => handleResolve(item._id)} className="btn btn-green mt-1" style={{ width: 'auto', padding: '5px 15px' }}>
                                                    Mark Resolved
                                                </button>
                                            )}
                                        </>
                                    )}
                                    {activeTab === 'users' && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h3 style={{ margin: 0 }}>{item.name}</h3>
                                                <p style={{ margin: 0, color: '#666' }}>{item.phone} | {item.role}</p>
                                            </div>
                                            <Trash2 size={20} color="red" style={{ cursor: 'pointer' }} />
                                        </div>
                                    )}
                                    {activeTab === 'jobs' && (
                                        <div>
                                            <h3 style={{ margin: 0, color: 'var(--green)' }}>{item.title}</h3>
                                            <p style={{ margin: 0, color: '#666' }}>By: {item.employer?.name}</p>
                                            <p style={{ margin: 0, fontWeight: 'bold' }}>Status: {item.status}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
