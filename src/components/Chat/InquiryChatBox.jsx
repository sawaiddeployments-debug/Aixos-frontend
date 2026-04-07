import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, MoreVertical, Loader2 } from 'lucide-react';
import { getDirectMessagesHistory, sendDirectMessage, updateDirectMessageStatus, markMessagesAsRead } from '../../api/chatApi';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';

/**
 * Reusable Chat Box for Inquiry Discussions
 * @param {string} inquiryId - The ID of the inquiry this chat belongs to
 * @param {string} recipientId - The ID of the person you are chatting with
 * @param {string} recipientRole - The role of the person you are chatting with (e.g., 'customer', 'partner')
 * @param {string} title - The title for the chat box
 */
const InquiryChatBox = ({ inquiryId, recipientId, recipientRole = 'customer', title = 'Discussion' }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const chatEndRef = useRef(null);
    const lastMessageCount = useRef(0);

    // DEBUG: Component Mount
    useEffect(() => {
        console.group('🏗️ CHAT COMPONENT MOUNTED');
        console.log('Inquiry ID:', inquiryId);
        console.log('Recipient ID:', recipientId);
        console.log('Recipient Role:', recipientRole);
        console.log('Current User ID:', user?.id);
        console.groupEnd();
    }, [inquiryId, recipientId, recipientRole, user?.id]);

    const scrollToBottom = (behavior = 'smooth') => {
        chatEndRef.current?.scrollIntoView({ behavior });
    };

    const fetchMessages = async (isInitial = false) => {
        if (!user?.id || !recipientId) {
            console.warn('⚠️ FETCH BLOCKED: Missing user or recipient ID');
            return;
        }
        
        try {
            const data = await getDirectMessagesHistory(user.id, recipientId, inquiryId);
            
            // Log status of incoming messages
            if (isInitial) {
                console.log('📥 INITIAL MESSAGES LOADED:', data);
            }

            setMessages(data);
            
            // Mark unread messages as read if they are for me (recipient = me)
            const unreadIds = data
                .filter(m => String(m.receiver_id) === String(user.id) && m.status !== 'read')
                .map(m => m.id);
            
            if (unreadIds.length > 0) {
                console.log('📖 MARKING AS READ:', unreadIds.length, 'messages');
                await markMessagesAsRead(unreadIds);
                // After marking as read, optionally update status locally
                setMessages(prev => prev.map(m => unreadIds.includes(m.id) ? { ...m, status: 'read' } : m));
            }

            // Mark 'sent' messages from others as 'delivered' for them if I am fetching them
            const sentIdsFromOther = data
                .filter(m => String(m.receiver_id) === String(user.id) && m.status === 'sent')
                .map(m => m.id);
            
            if (sentIdsFromOther.length > 0) {
                console.log('🚚 MARKING AS DELIVERED:', sentIdsFromOther.length, 'messages');
                const deliverPromises = sentIdsFromOther.map(id => updateDirectMessageStatus(id, 'delivered'));
                await Promise.all(deliverPromises);
            }

            if (isInitial || data.length > lastMessageCount.current) {
                lastMessageCount.current = data.length;
                setTimeout(() => scrollToBottom(isInitial ? 'auto' : 'smooth'), 100);
            }
        } catch (e) {
            console.error('❌ FETCH MESSAGES FAILED:', e);
        } finally {
            if (isInitial) setLoading(false);
        }
    };

    useEffect(() => {
        if (!user?.id || !recipientId || !inquiryId) return;

        fetchMessages(true);

        // REAL-TIME: Subscribe to new messages for this inquiry
        console.log('📡 SETTING UP REAL-TIME FOR INQUIRY:', inquiryId);
        const channel = supabase
            .channel(`inquiry_messages_${inquiryId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    table: 'messages',
                    filter: `inquiry_id=eq.${inquiryId}`
                },
                (payload) => {
                    console.log('🔥 NEW MESSAGE VIA REAL-TIME:', payload.new);
                    setMessages((prev) => {
                        if (prev.some(m => m.id === payload.new.id)) return prev;
                        return [...prev, payload.new];
                    });
                }
            )
            .subscribe((status) => {
                console.log(`🔌 REAL-TIME STATUS [inquiry_${inquiryId}]:`, status);
            });

        return () => {
            console.log('🔌 DISCONNECTING REAL-TIME FOR INQUIRY:', inquiryId);
            supabase.removeChannel(channel);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, recipientId, inquiryId]);

    useEffect(() => {
        if (messages.length > lastMessageCount.current) {
            scrollToBottom('smooth');
            lastMessageCount.current = messages.length;
        }
    }, [messages.length]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user?.id || !recipientId || sending) return;

        setSending(true);
        const msgContent = newMessage;
        setNewMessage('');

        // Optimistic update
        const optimisticMsg = {
            id: 'temp-' + Date.now(),
            sender_id: user.id,
            content: msgContent,
            created_at: new Date().toISOString(),
            status: 'sending'
        };
        setMessages((prev) => [...prev, optimisticMsg]);

        try {
            const currentRole = user.role || 'user';
            
            // Try to find a valid extinguisher_id for this inquiry to satisfy legacy constraints
            // (Even though we made it nullable, it's better to keep the link if we can)
            let extinguisherId = null;
            if (messages && messages.length > 0) {
                const existing = messages.find(m => m.extinguisher_id);
                if (existing) extinguisherId = existing.extinguisher_id;
            }

            const result = await sendDirectMessage(user.id, recipientId, inquiryId, msgContent, currentRole, extinguisherId);
            
            if (result) {
                console.log('🚀 MESSAGE SENT SUCCESSFULLY, REFRESHING...');
                fetchMessages(false);
            }
        } catch (e) {
            console.error('❌ SEND FAILED:', e);
            // Remove optimistic message on failure
            setMessages((prev) => prev.filter(m => m.id !== optimisticMsg.id));
            setNewMessage(msgContent); // Restore input
        } finally {
            setSending(false);
            scrollToBottom('smooth');
        }
    };

    const getStatusIcon = (status) => {
        if (status === 'read') return <span className="text-[10px] text-primary-500 font-bold ml-1" title="Read">✓✓</span>;
        if (status === 'delivered') return <span className="text-[10px] text-slate-400 font-bold ml-1" title="Delivered">✓✓</span>;
        if (status === 'sent') return <span className="text-[10px] text-slate-400 font-bold ml-1" title="Sent">✓</span>;
        if (status === 'sending') return <Loader2 size={10} className="animate-spin inline ml-1 text-slate-300" />;
        return null;
    };

    return (
        <div className="bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden flex flex-col h-[450px] shadow-inner-sm">
            {/* Header */}
            <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center">
                        <MessageCircle size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-slate-900">{title}</h4>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {loading && messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center opacity-40">
                        <Loader2 className="animate-spin text-primary-500 mr-2" size={20} />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading history...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 mt-[-20px]">
                        <MessageCircle size={48} className="text-slate-300 mb-2" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No messages yet</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase">Start the conversation below</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === user?.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[85%] ${isMe ? 'order-2' : ''}`}>
                                    <div className={`flex items-center gap-2 mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {isMe ? 'You' : recipientRole}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-300">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm transition-all ${isMe 
                                        ? 'bg-slate-900 text-white rounded-tr-none' 
                                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                                        {msg.content || msg.message}
                                        {isMe && <div className="text-right mt-1 -mr-1">{getStatusIcon(msg.status)}</div>}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                    placeholder="Write a message..."
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 text-white p-3 rounded-xl shadow-primary transition-all flex items-center justify-center active:scale-95"
                >
                    {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
            </form>
        </div>
    );
};

export default InquiryChatBox;
