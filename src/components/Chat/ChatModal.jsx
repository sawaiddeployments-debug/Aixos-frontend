import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Phone, Video, Search } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { getMessages, sendMessage as sendChatMessage } from '../../api/chat';
import { useAuth } from '../../context/AuthContext';

const ChatModal = ({ isOpen, onClose, queryId }) => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [customer, setCustomer] = useState(null);
    const { user } = useAuth();
    const scrollRef = useRef(null);
    const pollingRef = useRef(null);

    const fetchMessages = useCallback(async () => {
        if (!queryId) return;
        try {
            const data = await getMessages(queryId);
            setMessages(data);

            // Try to find customer info from messages if not set
            if (!customer && data.length > 0) {
                const customerMsg = data.find(m => m.sender_type === 'customer');
                if (customerMsg) {
                    setCustomer({
                        name: `Customer #${customerMsg.sender_id}`,
                        status: 'online',
                        lastSeen: 'Active now'
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    }, [queryId, customer]);

    // Initial fetch and polling setup
    useEffect(() => {
        if (isOpen && queryId) {
            fetchMessages();

            // Set up polling every 5 seconds
            pollingRef.current = setInterval(fetchMessages, 5000);
        }

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
            }
        };
    }, [isOpen, queryId, fetchMessages]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (text) => {
        if (!queryId) return;
        setIsLoading(true);
        try {
            const newMsg = await sendChatMessage(queryId, text);
            setMessages(prev => [...prev, newMsg]);
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
            <div
                className="bg-white w-full max-w-lg h-[600px] max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 sm:p-6 bg-white border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src={customer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${customer?.name || queryId}`}
                                alt={customer?.name}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl object-cover border border-slate-100"
                            />
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${customer?.status === 'online' ? 'bg-green-500' : 'bg-slate-300'
                                }`} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">{customer?.name || `Loading Chat...`}</h3>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${customer?.status === 'online' ? 'bg-green-500' : 'bg-slate-300'}`} />
                                {customer?.status === 'online' ? 'Active now' : customer?.lastSeen || 'Offline'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all hidden sm:flex">
                            <Phone size={20} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all hidden sm:flex">
                            <Video size={20} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all ml-1"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Search / Context Bar (Sub-header) */}
                <div className="px-6 py-2 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Extinguisher ID: #{queryId}</span>
                    <button className="text-slate-400 hover:text-slate-600 flex items-center gap-1">
                        <Search size={14} />
                        <span className="text-[10px] font-bold">Search</span>
                    </button>
                </div>

                {/* Chat Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-2 bg-[#F8FAFC] custom-scrollbar"
                >
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                            <p className="text-sm">No messages yet</p>
                            <p className="text-xs">Start the conversation below</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))
                    )}
                </div>

                {/* Input Area */}
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default ChatModal;
