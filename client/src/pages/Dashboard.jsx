import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Briefcase, Settings, LogOut, Star, Phone, MapPin, MessageSquare, Languages, Camera } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const Dashboard = () => {
    const { language, toggleLanguage, t } = useLanguage();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role === 'worker') {
            const fetchProfile = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get('http://localhost:5000/api/worker/profile', {
                        headers: { 'x-auth-token': token }
                    });
                    if (res.data.success) {
                        setProfile(res.data.data);
                    }
                } catch (err) {
                    console.log('Profile needs setup');
                }
            };
            fetchProfile();
        }
    }, [user, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="fade-in">
            <header className="header" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    <button onClick={toggleLanguage} style={{ background: 'white', border: 'none', borderRadius: '50%', padding: '8px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        <Languages size={18} /> {language === 'hi' ? 'EN' : 'हिन्दी'}
                    </button>
                </div>
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <Link to="/chat-list" style={{ background: 'white', border: 'none', borderRadius: '50%', padding: '8px', display: 'block', color: 'var(--navy)' }}>
                        <MessageSquare size={20} />
                    </Link>
                </div>
                <h1 className="logo">KaamSetu</h1>
                <p>{user.role === 'worker' ? `${t('dashboard')} (कामगार)` : `${t('dashboard')} (सेठ)`}</p>
            </header>

            <div style={{ padding: '1rem' }}>
                {/* User Card */}
                <div className="card" style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '2rem' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img
                            src={profile?.profilePhoto || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                            alt="Profile"
                            style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--saffron)', objectFit: 'cover' }}
                        />
                        {profile && (
                            <div style={{ position: 'absolute', bottom: '0', right: '5px', background: 'white', borderRadius: '50%', padding: '6px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                                <Star size={20} fill="gold" color="gold" />
                            </div>
                        )}
                    </div>
                    <h2 style={{ color: 'var(--navy)', marginTop: '0.5rem', fontSize: '1.5rem' }}>{user.name}</h2>
                    <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: 'bold' }}>{profile?.skillCategory || user.role.toUpperCase()}</p>

                    {profile && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '1rem', fontSize: '1rem', color: '#555' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={18} /> {profile.district}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={18} /> {profile.phone}</span>
                        </div>
                    )}
                </div>

                {/* Action Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '1.5rem' }}>
                    {user.role === 'worker' ? (
                        <>
                            <Link to="/jobs" className="card" style={{ textDecoration: 'none', textAlign: 'center', padding: '2rem' }}>
                                <Briefcase size={40} color="var(--saffron)" style={{ margin: '0 auto 15px' }} />
                                <span style={{ fontWeight: 'bold', color: 'var(--navy)', fontSize: '1.1rem' }}>{t('find_work')}</span>
                            </Link>
                            <Link to="/upload-work" className="card" style={{ textDecoration: 'none', textAlign: 'center', padding: '2rem' }}>
                                <Camera size={40} color="var(--saffron)" style={{ margin: '0 auto 15px' }} />
                                <span style={{ fontWeight: 'bold', color: 'var(--navy)', fontSize: '1.1rem' }}>{t('upload_work')}</span>
                            </Link>
                            <Link to="/edit-profile" className="card" style={{ textDecoration: 'none', textAlign: 'center', padding: '2rem', gridColumn: 'span 2' }}>
                                <User size={40} color="var(--saffron)" style={{ margin: '0 auto 11px' }} />
                                <span style={{ fontWeight: 'bold', color: 'var(--navy)', fontSize: '1.1rem' }}>{profile ? t('edit_profile') : t('setup_profile')}</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/post-job" className="card" style={{ textDecoration: 'none', textAlign: 'center', padding: '2rem' }}>
                                <Briefcase size={40} color="var(--green)" style={{ margin: '0 auto 15px' }} />
                                <span style={{ fontWeight: 'bold', color: 'var(--navy)', fontSize: '1.1rem' }}>{t('post_job')}</span>
                            </Link>
                            <Link to="/find-workers" className="card" style={{ textDecoration: 'none', textAlign: 'center', padding: '2rem' }}>
                                <User size={40} color="var(--green)" style={{ margin: '0 auto 15px' }} />
                                <span style={{ fontWeight: 'bold', color: 'var(--navy)', fontSize: '1.1rem' }}>{t('find_workers')}</span>
                            </Link>
                            <Link to="/my-jobs" className="card" style={{ textDecoration: 'none', textAlign: 'center', padding: '1.5rem', gridColumn: 'span 2' }}>
                                <Briefcase size={32} color="var(--green)" style={{ margin: '0 auto 10px' }} />
                                <span style={{ fontWeight: 'bold', color: 'var(--navy)' }}>{t('my_jobs')}</span>
                            </Link>
                        </>
                    )}
                    {user.role === 'admin' && (
                        <Link to="/admin" className="card" style={{ textDecoration: 'none', textAlign: 'center', padding: '1.5rem', gridColumn: 'span 2', background: 'var(--navy)' }}>
                            <Settings size={32} color="white" style={{ margin: '0 auto 10px' }} />
                            <span style={{ fontWeight: 'bold', color: 'white' }}>Admin Control Panel</span>
                        </Link>
                    )}
                </div>

                <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '60px' }}>
                    <LogOut size={24} />
                    {t('logout')}
                </button>
            </div>

            {!profile && user.role === 'worker' && (
                <div style={{ position: 'fixed', bottom: '20px', left: '20px', right: '20px', background: 'var(--saffron)', color: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.3)', animation: 'fadeIn 0.5s' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>अपनी प्रोफाइल पूरी करें ताकि सेठ आपको काम दे सकें!</p>
                    <Link to="/edit-profile" className="btn btn-white" style={{ background: 'white', color: 'var(--saffron)', marginTop: '0.8rem', padding: '0.8rem', fontSize: '1rem', fontWeight: '800' }}>
                        {t('setup_profile')}
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
