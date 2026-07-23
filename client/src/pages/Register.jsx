import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        role: 'worker'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            if (res.data.success) {
                navigate('/verify-otp', { state: { phone: formData.phone } });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="fade-in">
            <header className="header">
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                    <h1 className="logo">KaamSetu</h1>
                </Link>
                <p>Create a new account</p>
            </header>

            <div className="card">
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Register As</label>
                        <select name="role" value={formData.role} onChange={onChange}>
                            <option value="worker">Worker (Kaamgar)</option>
                            <option value="employer">Employer (Seth)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={onChange} required />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" name="phone" value={formData.phone} onChange={onChange} required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={onChange} required />
                    </div>

                    {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

                    <button type="submit" className="btn btn-navy" style={{ background: 'var(--navy)', color: 'white' }}>
                        Register & Send OTP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
