import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
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
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="fade-in">
            <header className="header">
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                    <h1 className="logo">KaamSetu</h1>
                </Link>
                <p>Login to your account</p>
            </header>

            <div className="card">
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Login As</label>
                        <select name="role" value={formData.role} onChange={onChange}>
                            <option value="worker">Worker (Kaamgar)</option>
                            <option value="employer">Employer (Seth)</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Enter mobile number"
                            value={formData.phone}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={onChange}
                            required
                        />
                    </div>

                    {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

                    <button type="submit" className="btn btn-navy" style={{ background: 'var(--navy)', color: 'white' }}>
                        Login Now
                    </button>
                </form>

                <p className="text-center" style={{ marginTop: '1rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--navy)' }}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
