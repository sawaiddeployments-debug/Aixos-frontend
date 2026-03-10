import React, { useState, useEffect, useRef } from 'react';
import { X, Phone, Video, Search, MessageCircle, Send } from 'lucide-react';

const MockChatModal = ({ isOpen, onClose, customerName, inquiryNo }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender_type: 'customer',
            content: "Hello, I have a question about my inquiry " + inquiryNo,
            created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
            id: 2,
            sender_type: 'partner',
            content: "Hello " + customerName + ", how can we help you today?",
            created_at: new Date(Date.now() - 1800000).toISOString(),
        }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: Date.now(),
            sender_type: 'partner',
            content: newMessage,
            created_at: new Date().toISOString(),
        };

        setMessages([...messages, msg]);
        setNewMessage('');

        // Mock auto-reply
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender_type: 'customer',
                content: "Thank you for the update! I appreciate the quick response.",
                created_at: new Date().toISOString(),
            }]);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="bg-white w-full max-w-lg h-[600px] max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 font-black text-xl border border-primary-200">
                                {customerName?.charAt(0)}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white bg-green-500" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-lg leading-tight uppercase tracking-tight">
                                {customerName}
                            </h3>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5 font-black uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Active now
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2.5 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all">
                            <Phone size={20} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Sub-header */}
                <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Inquiry:</span>
                        <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-primary-600 tracking-tighter">#{inquiryNo}</span>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 flex items-center gap-1.5 transition-colors">
                        <Search size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Search</span>
                    </button>
                </div>

                {/* Chat Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8FAFC] custom-scrollbar"
                >
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender_type === 'partner' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`max-w-[85%] ${msg.sender_type === 'partner' ? 'flex flex-col items-end' : 'flex flex-col items-start'}`}>
                                <div className={`flex items-center gap-2 mb-1`}>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        {msg.sender_type === 'partner' ? 'You' : customerName}
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-300">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${msg.sender_type === 'partner'
                                        ? 'bg-slate-900 text-white rounded-tr-none'
                                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100 flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-slate-50 border border-slate-100 rounded-[1.25rem] px-5 py-4 text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-[1.25rem] shadow-primary transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
                    >
                        <Send size={24} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MockChatModal;
