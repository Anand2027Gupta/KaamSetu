import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, User } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const socket = io('http://localhost:5000');

const Chat = () => {
    const { chatId } = useParams();
    const location = useLocation();
    const { t } = useLanguage();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatInfo, setChatInfo] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/chat/my-chats`, {
                    headers: { 'x-auth-token': token }
                });
                if (res.data.success) {
                    const currentChat = res.data.data.find(c => c._id === chatId);
                    if (currentChat) {
                        setChatInfo(currentChat);
                        setMessages(currentChat.messages);
                        socket.emit('join_chat', chatId);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchChat();

        socket.on('receive_message', (data) => {
            if (data.chatId === chatId) {
                setMessages(prev => [...prev, data]);
            }
        });

        return () => {
            socket.off('receive_message');
        };
    }, [chatId]);

    useEffect(scrollToBottom, [messages]);

    const onSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            chatId,
            sender: user.id,
            text: newMessage,
            timestamp: new Date()
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/chat/message', {
                chatId,
                text: newMessage
            }, {
                headers: { 'x-auth-token': token }
            });

            socket.emit('send_message', messageData);
            setNewMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    const otherParticipant = chatInfo?.participants.find(p => p._id !== user.id);

    return (
        <div className="fade-in" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header className="header" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1rem' }}>
                <Link to="/dashboard" style={{ color: 'white' }}><ArrowLeft /></Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'white', borderRadius: '50%', padding: '5px' }}>
                        <User size={20} color="var(--navy)" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1rem', margin: 0 }}>{otherParticipant?.name || 'Chat'}</h1>
                        <p style={{ fontSize: '0.7rem', margin: 0, opacity: 0.8 }}>{chatInfo?.job?.title}</p>
                    </div>
                </div>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: '#e5ddd5' }}>
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: 'flex',
                            justifyContent: msg.sender === user.id || msg.sender?._id === user.id ? 'flex-end' : 'flex-start',
                            marginBottom: '10px'
                        }}
                    >
                        <div style={{
                            maxWidth: '70%',
                            padding: '10px',
                            borderRadius: '10px',
                            background: msg.sender === user.id || msg.sender?._id === user.id ? '#dcf8c6' : 'white',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            position: 'relative'
                        }}>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>{msg.text}</p>
                            <span style={{ fontSize: '0.6rem', color: '#888', display: 'block', textAlign: 'right', marginTop: '4px' }}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={onSend} style={{ padding: '1rem', background: '#f0f0f0', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('type_message')}
                    style={{ flex: 1, padding: '0.8rem', border: 'none', borderRadius: '25px', outline: 'none' }}
                />
                <button type="submit" style={{ background: 'var(--green)', color: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default Chat;
