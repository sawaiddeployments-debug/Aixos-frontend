import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ChatMessage = ({ message }) => {
    const { content, created_at, sender_id, sender_type } = message;
    const { user } = useAuth();

    // Determine if the message was sent by the current user
    const isMe = user && sender_id === user.id;

    // Format timestamp
    const timestamp = new Date(created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    const senderName = sender_type === 'customer' ? `Customer #${sender_id}` : `Staff (${sender_type})`;
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender_id}`;

    return (
        <div className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                {/* Avatar */}
                <div className="flex-shrink-0 mb-1">
                    <img
                        src={avatar}
                        alt={senderName}
                        className="w-8 h-8 rounded-full border border-slate-200 bg-white"
                    />
                </div>

                {/* Message Bubble Column */}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {!isMe && (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1">
                            {senderName}
                        </span>
                    )}

                    <div
                        className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${isMe
                            ? 'bg-primary-500 text-white rounded-br-none'
                            : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                            }`}
                    >
                        {content}
                    </div>

                    <span className="text-[10px] text-slate-400 font-medium mt-1 mx-1">
                        {timestamp}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
