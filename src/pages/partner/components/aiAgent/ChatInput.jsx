import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({
  onSend,
  placeholder = 'Ask something...',
  disabled = false,
}) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [value]);

  return (
    <div className="flex items-end gap-2 md:gap-3 w-full">
      <label className="sr-only" htmlFor="ai-agent-chat-input">
        Message
      </label>
      <textarea
        ref={textareaRef}
        id="ai-agent-chat-input"
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="input-field flex-1 min-h-[48px] max-h-32 py-3 px-4 rounded-xl text-sm resize-none border border-slate-300 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      />
      <button
        type="button"
        title="Send Message"
        disabled={disabled || !value.trim()}
        onClick={handleSend}
        className="shrink-0 h-12 w-12 md:w-14 rounded-lg bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
        aria-label="Send message"
      >
        <Send size={20} className="md:w-[22px] md:h-[22px]" />
      </button>
    </div>
  );
};

export default ChatInput;
