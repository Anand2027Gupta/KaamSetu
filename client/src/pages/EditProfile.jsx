import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save } from 'lucide-react';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: '',
        skillCategory: 'Painter',
        experience: '',
        district: '',
        dailyWage: '',
        availability: 'Full-time',
        phone: '',
        bio: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/worker/profile', {
                    headers: { 'x-auth-token': token }
                });
                if (res.data) {
                    setFormData(res.data);
                }
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/worker/profile', formData, {
                headers: { 'x-auth-token': token }
            });
            setMessage('Profile updated successfully!');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            setMessage('Error updating profile');
        }
    };

    if (loading) return <div className="container text-center mt-2">Loading...</div>;

    return (
        <div className="fade-in">
            <header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                <Link to="/dashboard" style={{ color: 'white' }}><ArrowLeft /></Link>
                <h1 className="logo" style={{ fontSize: '1.2rem' }}>Worker Profile</h1>
                <div style={{ width: '24px' }}></div>
            </header>

            <div className="card">
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={onChange} required placeholder="आपका पूरा नाम" />
                    </div>

                    <div className="form-group">
                        <label>Skill Category</label>
                        <select name="skillCategory" value={formData.skillCategory} onChange={onChange}>
                            <option value="Painter">Painter (पेंटर)</option>
                            <option value="Carpenter">Carpenter (बढ़ई)</option>
                            <option value="Plumber">Plumber (प्लंबर)</option>
                            <option value="Electrician">Electrician (इलेक्ट्रीशियन)</option>
                            <option value="Mason">Mason (मिस्त्री)</option>
                            <option value="Driver">Driver (ड्राइवर)</option>
                            <option value="Helper">Helper (हेल्पर)</option>
                            <option value="Laborer">Laborer (मजदूर)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Experience (Years)</label>
                        <input type="number" name="experience" value={formData.experience} onChange={onChange} required placeholder="कितने साल का अनुभव है?" />
                    </div>

                    <div className="form-group">
                        <label>District (UP)</label>
                        <input type="text" name="district" value={formData.district} onChange={onChange} required placeholder="आपका जिला (उदा. लखनऊ)" />
                    </div>

                    <div className="form-group">
                        <label>Daily Wage (₹)</label>
                        <input type="number" name="dailyWage" value={formData.dailyWage} onChange={onChange} required placeholder="एक दिन की दिहाड़ी" />
                    </div>

                    <div className="form-group">
                        <label>Availability</label>
                        <select name="availability" value={formData.availability} onChange={onChange}>
                            <option value="Full-time">Full-time (पूरा समय)</option>
                            <option value="Part-time">Part-time (पार्ट-टाइम)</option>
                            <option value="One-day">One-day (एक दिन के लिए)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" name="phone" value={formData.phone} onChange={onChange} required placeholder="मोबाइल नंबर" />
                    </div>

                    <div className="form-group">
                        <label>About You (Bio)</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={onChange}
                            placeholder="अपने बारे में कुछ लिखें..."
                            style={{ width: '100%', padding: '1rem', border: '2px solid #ddd', borderRadius: '8px', minHeight: '100px' }}
                        />
                    </div>

                    {message && <p className="text-center" style={{ color: message.includes('Error') ? 'red' : 'green', marginBottom: '1rem' }}>{message}</p>}

                    <button type="submit" className="btn btn-saffron" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Save size={20} />
                        Save Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
