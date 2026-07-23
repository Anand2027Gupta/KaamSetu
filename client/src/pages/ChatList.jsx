import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, User } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();
    const [user] = useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/chat/my-chats', {
                    headers: { 'x-auth-token': token }
                });
                if (res.data.success) {
                    setChats(res.data.data);
                }
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchChats();
    }, []);

    return (
        <div className="fade-in">
            <header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                <Link to="/dashboard" style={{ color: 'white' }}><ArrowLeft /></Link>
                <h1 className="logo" style={{ fontSize: '1.2rem' }}>{t('messages')} (Messages)</h1>
                <div style={{ width: '24px' }}></div>
            </header>

            <div style={{ padding: '1rem' }}>
                {loading ? <p className="text-center">Loading...</p> : (
                    chats.length === 0 ? (
                        <div className="card text-center" style={{ padding: '3rem' }}>
                            <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                            <p>No messages yet.</p>
                        </div>
                    ) : (
                        chats.map(chat => {
                            const opponent = chat.participants.find(p => p._id !== user.id);
                            const lastMsg = chat.messages[chat.messages.length - 1];
                            return (
                                <Link key={chat._id} to={`/chat/${chat._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="card" style={{ margin: '0 0 0.5rem 0', display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <div style={{ background: '#f0f0f0', borderRadius: '50%', padding: '10px' }}>
                                            <User size={30} color="#888" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <h3 style={{ fontSize: '1rem', margin: 0 }}>{opponent?.name}</h3>
                                                <span style={{ fontSize: '0.7rem', color: '#888' }}>
                                                    {lastMsg ? new Date(lastMsg.timestamp).toLocaleDateString() : ''}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '0.8rem', color: '#666', margin: '4px 0 0' }}>{chat.job?.title}</p>
                                            <p style={{ fontSize: '0.9rem', color: '#444', margin: '4px 0 0', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                {lastMsg ? lastMsg.text : 'Start a conversation'}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )
                )}
            </div>
        </div>
    );
};

export default ChatList;
