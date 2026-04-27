import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, MessageCircle, Send } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import {
    getComplaintMessages,
    markThreadMessagesAsRead,
    sendAdminComplaintReply,
    sendUserComplaint
} from '../../api/complaintsApi';

const ComplaintChat = ({ userId, userRole, isAdminView = false }) => {
    const threadUserId = userId == null ? '' : String(userId).trim();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [draft, setDraft] = useState('');
    const endRef = useRef(null);

    const loadMessages = async () => {
        if (!threadUserId) return;
        const data = await getComplaintMessages(threadUserId);
        setMessages(data);
    };

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            if (!threadUserId) return;
            setLoading(true);
            try {
                await loadMessages();
                await markThreadMessagesAsRead({
                    userId: threadUserId,
                    readAdminMessages: !isAdminView
                });
            } catch (err) {
                console.error('Failed to load complaint messages', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        init();
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threadUserId, isAdminView]);

    useEffect(() => {
        if (!threadUserId) return undefined;
        const channel = supabase
            .channel(`complaints_${threadUserId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'complaints',
                    filter: `user_id=eq.${threadUserId}`
                },
                (payload) => {
                    setMessages((prev) => {
                        if (prev.some((m) => m.id === payload.new.id)) return prev;
                        return [...prev, payload.new];
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [threadUserId]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    const handleSend = async (e) => {
        e.preventDefault();
        const message = draft.trim();
        if (!message || !threadUserId || sending) return;

        setSending(true);
        setDraft('');
        try {
            if (isAdminView) {
                await sendAdminComplaintReply({ userId: threadUserId, userRole, message });
            } else {
                await sendUserComplaint({ userId: threadUserId, userRole, message });
            }
            // Re-fetch immediately so sender sees message even if realtime event lags.
            await loadMessages();
        } catch (err) {
            console.error('Failed to send complaint message', err);
            setDraft(message);
        } finally {
            setSending(false);
        }
    };

    const grouped = useMemo(() => {
        const rows = [];
        let lastLabel = '';
        messages.forEach((msg) => {
            const date = new Date(msg.created_at);
            const label = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
            if (label !== lastLabel) {
                rows.push({ type: 'date', label });
                lastLabel = label;
            }
            rows.push({ type: 'message', ...msg });
        });
        return rows;
    }, [messages]);

    const getSenderLabel = (item) => {
        const fromAdmin = item.is_admin === true;
        const fromBot = item.is_bot === true;

        if (fromAdmin && fromBot) return 'Support Bot';
        if (isAdminView) return fromAdmin ? 'You' : (userRole || 'User').toString();
        return fromAdmin ? 'Admin' : 'You';
    };

    const formatTime = (value) => {
        const d = new Date(value);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex h-[70vh] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                <h2 className="text-sm font-bold text-slate-900">Complaint Chat</h2>
                <p className="text-xs text-slate-500 capitalize">
                    {isAdminView ? `Thread for ${userRole}` : 'Talk to admin support team'}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-4">
                {loading ? (
                    <div className="flex h-full items-center justify-center gap-2 text-slate-500">
                        <Loader2 size={18} className="animate-spin" />
                        <span className="text-sm">Loading chat...</span>
                    </div>
                ) : grouped.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                        <MessageCircle size={26} className="mb-2 text-slate-300" />
                        <p className="text-sm font-semibold text-slate-600">Start your complaint...</p>
                        {!threadUserId && (
                            <p className="mt-2 text-xs text-red-500">Missing user id. Please re-login.</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {grouped.map((item, idx) => {
                            if (item.type === 'date') {
                                return (
                                    <div key={`date-${idx}`} className="py-2 text-center">
                                        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-slate-500">
                                            {item.label}
                                        </span>
                                    </div>
                                );
                            }

                            const isAdminBubble = item.is_admin === true;
                            const isOwnMessage = isAdminView ? isAdminBubble : !isAdminBubble;
                            const senderLabel = getSenderLabel(item);
                            return (
                                <div key={item.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                                            isAdminBubble
                                                ? 'bg-primary-500 text-white'
                                                : 'bg-white text-slate-800'
                                        }`}
                                    >
                                        <p
                                            className={`mb-1 text-[10px] font-bold uppercase tracking-wide ${
                                                isAdminBubble ? 'text-white/80' : 'text-slate-500'
                                            }`}
                                        >
                                            {senderLabel}
                                        </p>
                                        <p className="whitespace-pre-wrap break-words">{item.message}</p>
                                        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
                                            <span>{formatTime(item.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={endRef} />
                    </div>
                )}
            </div>

            <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-100 bg-white p-3">
                <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type your complaint message..."
                    className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-primary-400"
                    disabled={sending || !threadUserId}
                />
                <button
                    type="submit"
                    disabled={sending || !draft.trim() || !threadUserId}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-white disabled:bg-slate-300"
                >
                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
            </form>
        </div>
    );
};

export default ComplaintChat;

