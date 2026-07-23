import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import axios from 'axios';

const PostJob = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        wage: '',
        duration: '',
        category: 'Painter'
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/employer/jobs', formData, {
                headers: { 'x-auth-token': token }
            });
            setMessage('Job posted successfully!');
            setTimeout(() => navigate('/my-jobs'), 1500);
        } catch (err) {
            setMessage('Error posting job');
        }
    };

    return (
        <div className="fade-in">
            <header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                <Link to="/dashboard" style={{ color: 'white' }}><ArrowLeft /></Link>
                <h1 className="logo" style={{ fontSize: '1.2rem' }}>Post New Job</h1>
                <div style={{ width: '24px' }}></div>
            </header>

            <div className="card">
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Job Title</label>
                        <input type="text" name="title" value={formData.title} onChange={onChange} required placeholder="काम का नाम (उदा. घर की पुताई)" />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={onChange}>
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
                        <label>Location (District in UP)</label>
                        <input type="text" name="location" value={formData.location} onChange={onChange} required placeholder="जिला (उदा. लखनऊ)" />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={onChange}
                            required
                            placeholder="काम की पूरी जानकारी लिखें..."
                            style={{ width: '100%', padding: '1rem', border: '2px solid #ddd', borderRadius: '8px', minHeight: '80px' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Daily Wage Offered (₹)</label>
                        <input type="number" name="wage" value={formData.wage} onChange={onChange} required placeholder="एक दिन की दिहाड़ी" />
                    </div>

                    <div className="form-group">
                        <label>Estimated Duration</label>
                        <input type="text" name="duration" value={formData.duration} onChange={onChange} required placeholder="उदा. 2 दिन या 1 हफ्ता" />
                    </div>

                    {message && <p className="text-center" style={{ color: message.includes('Error') ? 'red' : 'green', marginBottom: '1rem' }}>{message}</p>}

                    <button type="submit" className="btn btn-green" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <PlusCircle size={20} />
                        Post Work Now
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;
