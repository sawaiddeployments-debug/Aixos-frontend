import React from 'react';
import { MessageSquare, Calendar, Trash2, X } from 'lucide-react';

const ChatHistorySidebar = ({ history, onSelectChat, selectedChatId, onClearHistory, isOpen, onClose }) => {
  const groupedHistory = history.reduce((acc, msg) => {
    const date = new Date(msg.created_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <aside
      className={`
        fixed lg:static top-0 left-0 z-50 h-full w-[280px] shrink-0
        bg-white border-r border-slate-200 flex flex-col overflow-hidden
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <MessageSquare size={18} className="text-primary-600" />
          History
        </h2>
        <div className="flex items-center gap-1">
          <button 
            onClick={onClearHistory}
            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
            title="Clear History"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 hover:bg-slate-200 text-slate-400 rounded-lg transition-colors"
            title="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {Object.keys(groupedHistory).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <MessageSquare size={32} className="opacity-20 mb-2" />
            <p className="text-xs font-medium">No chat history yet</p>
          </div>
        ) : (
          Object.entries(groupedHistory).map(([date, messages]) => (
            <div key={date} className="space-y-1">
              <div className="px-3 py-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <Calendar size={10} />
                {date}
              </div>
              {messages.filter(m => m.role === 'user').map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    onSelectChat(chat);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors cursor-pointer ${
                    selectedChatId === chat.id 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <p className="text-sm font-medium truncate pr-4 leading-tight">
                    {chat.content}
                  </p>
                  <span className="text-[10px] opacity-60 mt-1 block font-medium">
                    {new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default ChatHistorySidebar;
