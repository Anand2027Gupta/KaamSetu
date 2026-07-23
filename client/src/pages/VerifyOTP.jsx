import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const phone = location.state?.phone;

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { phone, otp });
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <div className="fade-in">
            <header className="header">
                <h1 className="logo">KaamSetu</h1>
                <p>Verify your mobile number</p>
            </header>

            <div className="card text-center">
                <p>Enter the 6-digit OTP sent to <strong>{phone}</strong></p>
                <form onSubmit={onSubmit} style={{ marginTop: '2rem' }}>
                    <div className="form-group">
                        <input
                            type="text"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            placeholder="000000"
                            style={{ fontSize: '2rem', textAlign: 'center', letterSpacing: '10px' }}
                            maxLength="6"
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit" className="btn btn-saffron mt-2">Verify & Dashboard</button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOTP;
