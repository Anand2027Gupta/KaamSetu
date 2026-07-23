import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Briefcase } from 'lucide-react';
import axios from 'axios';

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/employer/my-jobs', {
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
        fetchJobs();
    }, []);

    return (
        <div className="fade-in">
            <header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                <Link to="/dashboard" style={{ color: 'white' }}><ArrowLeft /></Link>
                <h1 className="logo" style={{ fontSize: '1.2rem' }}>My Posted Jobs</h1>
                <div style={{ width: '24px' }}></div>
            </header>

            <div style={{ padding: '1rem' }}>
                {loading ? <p className="text-center">Loading jobs...</p> : (
                    jobs.length === 0 ? (
                        <div className="card text-center" style={{ padding: '3rem' }}>
                            <Briefcase size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                            <p>No jobs posted yet.</p>
                            <Link to="/post-job" className="btn btn-green mt-2">Post Your First Job</Link>
                        </div>
                    ) : (
                        jobs.map(job => (
                            <div key={job._id} className="card" style={{ margin: '0 0 1rem 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h3 style={{ color: 'var(--green)' }}>{job.title}</h3>
                                    <span style={{
                                        background: job.status === 'Open' ? '#e8f5e9' : '#fff3e0',
                                        color: job.status === 'Open' ? '#2e7d32' : '#ef6c00',
                                        padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'
                                    }}>
                                        {job.status}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>{job.description}</p>
                                <div style={{ display: 'flex', gap: '15px', marginTop: '1rem', color: '#555', fontSize: '0.9rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {job.location}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {job.duration}</span>
                                </div>
                                <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem', color: 'var(--navy)', fontWeight: 'bold' }}>
                                    Wage: ₹{job.wage}/day
                                </div>
                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default MyJobs;
