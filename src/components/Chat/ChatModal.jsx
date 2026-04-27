import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, AlertCircle, Loader2, MessageCircle } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { getMessages, sendMessage as sendChatMessage } from '../../api/chatApi';
import { useAuth } from '../../context/AuthContext';
import InquiryChatBox from './InquiryChatBox';

const ChatModal = ({ isOpen, onClose, queryId, recipientId, recipientRole }) => {
    const [messages, setMessages] = useState([]);
    const [isLoadingInitial, setIsLoadingInitial] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const [customer, setCustomer] = useState(null);
    const { user } = useAuth();
    const scrollRef = useRef(null);
    const pollingRef = useRef(null);

    const fetchMessages = useCallback(async (isInitial = false) => {
        if (!queryId) return;
        if (isInitial) setIsLoadingInitial(true);
        setError(null);

        try {
            const data = await getMessages(queryId);
            setMessages(data);

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
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            if (isInitial) setError('Could not load chat history. Please try again.');
        } finally {
            if (isInitial) setIsLoadingInitial(false);
        }
    }, [queryId, customer]);

    useEffect(() => {
        if (isOpen && queryId) {
            fetchMessages(true);
            pollingRef.current = setInterval(() => fetchMessages(false), 5000);
        }
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [isOpen, queryId, fetchMessages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (text) => {
        if (!queryId || !text.trim()) return;

        const tempId = Date.now().toString();
        const optimisticMsg = {
            id: tempId,
            extinguisher_id: queryId,
            sender_id: user?.id,
            sender_type: user?.role,
            content: text,
            is_read: false,
            created_at: new Date().toISOString(),
            isOptimistic: true
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setIsSending(true);

        try {
            const realMsg = await sendChatMessage(queryId, text);
            setMessages(prev => prev.map(m => m.id === tempId ? realMsg : m));
        } catch (err) {
            console.error('Failed to send message:', err);
            setMessages(prev => prev.filter(m => m.id !== tempId));
            setError('Failed to send message. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    if (!isOpen) return null;

    const useNewChat = recipientId && recipientRole;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full sm:max-w-md h-[70vh] sm:h-[500px] sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-white"
                onClick={(e) => e.stopPropagation()}
            >
                {useNewChat ? (
                    <InquiryChatBox
                        inquiryId={queryId}
                        recipientId={recipientId}
                        recipientRole={recipientRole}
                        title="Direct Message"
                        onClose={onClose}
                    />
                ) : (
                    <>
                        {/* Header */}
                        <div className="shrink-0 bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 px-4 py-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="relative shrink-0">
                                    <img
                                        src={customer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${customer?.name || queryId}`}
                                        alt={customer?.name}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                                    />
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-800 ${customer?.status === 'online' ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-bold text-white truncate">
                                        {customer?.name || (isLoadingInitial ? 'Connecting...' : 'Chat')}
                                    </h3>
                                    <p className="text-[10px] text-emerald-300/80 font-medium">
                                        {customer?.status === 'online' ? 'Online now' : customer?.lastSeen || 'Offline'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0"
                            >
                                <X size={16} className="text-white" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2"
                            style={{ backgroundColor: '#efeae2' }}
                        >
                            {isLoadingInitial ? (
                                <div className="h-full flex flex-col items-center justify-center gap-2">
                                    <Loader2 className="animate-spin text-slate-400" size={24} />
                                    <p className="text-xs font-medium text-slate-500">Loading conversation...</p>
                                </div>
                            ) : error ? (
                                <div className="h-full flex flex-col items-center justify-center text-red-500 text-center space-y-2">
                                    <AlertCircle size={28} />
                                    <p className="text-xs font-bold">{error}</p>
                                    <button
                                        onClick={() => fetchMessages(true)}
                                        className="text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-14 h-14 bg-white/80 rounded-full flex items-center justify-center mb-3 shadow-sm">
                                        <MessageCircle size={26} className="text-slate-300" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-600">No messages yet</p>
                                    <p className="text-[11px] text-slate-400 mt-1">Start the conversation below</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isFromCurrentUser =
                                        msg.sender_id === user?.id ||
                                        (msg.sender_type && user?.role &&
                                            msg.sender_type.toLowerCase() === user.role.toLowerCase());

                                    return (
                                        <ChatMessage
                                            key={msg.id}
                                            message={msg}
                                            isFromCurrentUser={isFromCurrentUser}
                                        />
                                    );
                                })
                            )}
                        </div>

                        {/* Input */}
                        <ChatInput onSendMessage={handleSendMessage} isLoading={isSending} />
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatModal;
