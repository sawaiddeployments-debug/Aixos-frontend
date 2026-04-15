import React, { useState, useEffect, useRef } from 'react';
import { Bot, Loader2, RefreshCcw, History } from 'lucide-react';
import ChatMessage from './components/aiAgent/ChatMessage';
import ChatInput from './components/aiAgent/ChatInput';
import ChatHistorySidebar from './components/aiAgent/ChatHistorySidebar';
import { aiService } from '../../services/ai.service';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { supabase } from '../../supabaseClient';

const QUICK_ACTIONS = [
  { label: 'Today Summary', query: 'How many inquiries today?' },
  { label: 'Check Earnings', query: 'What are my total earnings?' },
  { label: 'Sticker Status', query: 'Show my sticker usage history.' },
];

const AiAgentPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      loadHistory();
    }
  }, [user?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const loadHistory = async () => {
    setFetchingHistory(true);
    try {
      const data = await aiService.getChatHistory(user.id);
      setHistory(data);
      if (data.length > 0) {
        setMessages(data.slice(-20)); 
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setFetchingHistory(false);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your chat history?')) return;
    try {
      const { error } = await supabase.from('ai_chat_history').delete().eq('partner_id', user.id);
      if (error) throw error;
      setMessages([]);
      setHistory([]);
      toast.success('History cleared');
    } catch (error) {
      toast.error('Failed to clear history');
    }
  };

  const handleSendMessage = async (query) => {
    const userMessage = { role: 'user', message: query, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await aiService.askAI(query, user.id, messages);
      const assistantMessage = { role: 'assistant', message: response, created_at: new Date().toISOString() };
      setMessages(prev => [...prev, assistantMessage]);
      loadHistory();
    } catch (error) {
      toast.error('AI was unable to respond. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (chat) => {
    setSelectedChatId(chat.id);
    const element = document.getElementById(`msg-${chat.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-slate-50 overflow-hidden font-sans">
      <header className="px-4 py-3 md:px-6 md:py-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistory(true)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open history sidebar"
          >
            <History size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex p-2 rounded-lg bg-primary-100 text-primary-700 border border-primary-200">
              <Bot size={20} />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-slate-900 leading-none">
                AI Agent
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Neural link active</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadHistory}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
            title="Refresh History"
          >
            <RefreshCcw size={18} className={fetchingHistory ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      <main className="h-[calc(100%-65px)] flex overflow-hidden">
        {showHistory && (
          <div
            className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
            onClick={() => setShowHistory(false)}
          />
        )}

        <ChatHistorySidebar
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          history={history}
          onSelectChat={handleSelectHistory}
          selectedChatId={selectedChatId}
          onClearHistory={clearHistory}
        />

        <section className="flex-1 min-w-0 flex flex-col bg-white border-l border-slate-200">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-4 border border-primary-200">
                  <Bot size={26} className="text-primary-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Ask anything about your dashboard</h3>
                <p className="text-sm text-slate-500 max-w-sm mb-6">
                  Ask about inquiries, earnings, sticker usage, and other operational data.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleSendMessage(action.query)}
                      className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-primary-300 hover:text-primary-700 transition-colors"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} id={msg.id ? `msg-${msg.id}` : undefined}>
                  <ChatMessage
                    role={msg.role}
                    message={msg.message || msg.content}
                    timestamp={msg.created_at}
                  />
                </div>
              ))
            )}

            {loading && (
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                  <Loader2 size={18} className="animate-spin" />
                </div>
                <div className="bg-slate-100 border border-slate-200 px-4 py-3 rounded-xl">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 border-t border-slate-200 p-3 md:p-4 bg-white">
            <ChatInput
              onSend={handleSendMessage}
              disabled={loading}
              placeholder="Ask about inquiries, earnings..."
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AiAgentPage;
