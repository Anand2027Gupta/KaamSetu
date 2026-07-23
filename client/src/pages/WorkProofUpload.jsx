import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, CheckCircle, MapPin, Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const WorkProofUpload = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [recentProofs, setRecentProofs] = useState([]);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/work-proof/my-proofs', {
                    headers: { 'x-auth-token': token }
                });
                if (res.data.success) {
                    setRecentProofs(res.data.data.slice(0, 4));
                }
            } catch (err) {
                console.error('Error fetching recent proofs', err);
            }
        };
        fetchRecent();
    }, [success]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!image) {
            toast.error('Please capture or select an image');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('image', image);
        formData.append('description', description);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/work-proof/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token
                }
            });
            setSuccess(true);
            toast.success('Work proof uploaded successfully!');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const triggerCamera = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="fade-in" style={{ padding: '1rem', paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                >
                    <ArrowLeft size={24} color="var(--navy)" />
                </button>
                <h2 style={{ marginLeft: '1rem', color: 'var(--navy)', fontSize: '1.5rem' }}>Upload Work Proof</h2>
            </div>

            {!success ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card"
                    style={{ margin: 0 }}
                >
                    <form onSubmit={handleUpload}>
                        <div
                            onClick={triggerCamera}
                            style={{
                                width: '100%',
                                height: '250px',
                                border: '2px dashed #ddd',
                                borderRadius: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f9f9f9',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                position: 'relative',
                                marginBottom: '1.5rem'
                            }}
                        >
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <>
                                    <Camera size={48} color="var(--saffron)" style={{ marginBottom: '1rem' }} />
                                    <p style={{ fontWeight: 600, color: '#666' }}>Tap to Take Photo / Upload</p>
                                    <p style={{ fontSize: '0.8rem', color: '#999' }}>PNG, JPG up to 5MB</p>
                                </>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                capture="environment"
                                style={{ display: 'none' }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Work Description (Optional)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Briefly describe what you've done today..."
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    border: '2px solid #ddd',
                                    borderRadius: '12px',
                                    minHeight: '100px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-saffron"
                            disabled={loading || !image}
                            style={{ opacity: (loading || !image) ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            {loading ? <Loader2 style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={20} />}
                            {loading ? 'Uploading...' : 'Submit Work Proof'}
                        </button>
                    </form>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-2"
                    style={{ padding: '2rem' }}
                >
                    <CheckCircle size={80} color="var(--green)" style={{ margin: '0 auto 1.5rem' }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Great Job!</h3>
                    <p style={{ color: '#666' }}>Your work proof has been uploaded. Redirecting you to dashboard...</p>
                </motion.div>
            )}

            {recentProofs.length > 0 && (
                <div style={{ marginTop: '2.5rem' }}>
                    <h3 style={{ color: 'var(--navy)', marginBottom: '1rem', fontSize: '1.2rem' }}>Recent Uploads</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {recentProofs.map((proof) => (
                            <div key={proof._id} style={{ borderRadius: '12px', overflow: 'hidden', height: '120px', backgroundColor: '#eee', position: 'relative' }}>
                                <img
                                    src={`http://localhost:5000${proof.imageUrl}`}
                                    alt="Work Proof"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '4px 8px', fontSize: '0.7rem' }}>
                                    {new Date(proof.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkProofUpload;
