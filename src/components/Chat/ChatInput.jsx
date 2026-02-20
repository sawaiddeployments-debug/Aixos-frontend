import React, { useState } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';

const ChatInput = ({ onSendMessage, isLoading }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-4 bg-white border-t border-slate-100 flex items-center gap-3"
        >
            <button
                type="button"
                className="text-slate-400 hover:text-slate-600 p-1 transition-colors"
                title="Add Emoji"
                disabled={isLoading}
            >
                <Smile size={20} />
            </button>

            <button
                type="button"
                className="text-slate-400 hover:text-slate-600 p-1 transition-colors"
                title="Attach File"
                disabled={isLoading}
            >
                <Paperclip size={20} />
            </button>

            <div className="flex-1 relative">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isLoading ? "Sending..." : "Type a message..."}
                    className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-primary-500/20 rounded-full py-2.5 px-5 text-sm outline-none transition-all placeholder:text-slate-400"
                    disabled={isLoading}
                />
            </div>

            <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className={`p-2.5 rounded-full transition-all flex items-center justify-center ${message.trim() && !isLoading
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-600 active:scale-90'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
            >
                {isLoading ? (
                    <div className="w-4.5 h-4.5 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
                ) : (
                    <Send size={18} />
                )}
            </button>
        </form>
    );
};

export default ChatInput;
