import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CreditCard,
  Clock,
  CheckCircle2,
  TrendingUp,
  X,
  FileText,
  UserCheck,
} from 'lucide-react';
import { AIAdminAssistantMessage } from '../../types/adminAutomation';
import { adminAutomationService } from '../../services/adminAutomationService';

interface AdminAIAssistantChatProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

const QUICK_PROMPTS = [
  "Show me today's important issues.",
  'Which students need attention?',
  'Show pending payments.',
  'Which subscriptions expire this week?',
  'Which curriculum pages failed processing?',
  'Which subjects have the highest weak-topic rate?',
  "Generate this week's system report.",
  "Summarize today's revenue.",
  'Show me high-risk payment alerts.',
];

export const AdminAIAssistantChat: React.FC<AdminAIAssistantChatProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [messages, setMessages] = useState<AIAdminAssistantMessage[]>([
    {
      id: 'init_welcome',
      sender: 'assistant',
      text: `Greetings, Super Admin Nuriye! I am your AI Operations Co-Pilot. I monitor all 34 enrolled students, payment submissions, curriculum RAG indexing, and subscription cycles in real-time.\n\nAsk me anything or select a prompt below to query live platform telemetry.`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AIAdminAssistantMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const resp = await adminAutomationService.askAdminAssistant(textToSend);
      setMessages((prev) => [...prev, resp]);
    } catch (err: any) {
      const errorMsg: AIAdminAssistantMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: `Error contacting assistant engine: ${err?.message || 'Server timeout'}. All data remains safe.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="modal_ai_admin_assistant"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white w-full max-w-2xl h-[640px] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        {/* Chat Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white flex items-center justify-between flex-shrink-0 border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                AI Admin Assistant & Intelligence Hub
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </h3>
              <p className="text-[11px] text-slate-300 font-mono">
                Sole Super Admin Context • Zero Hallucination Policy
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Query Pills */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex-shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="text-[10px] font-bold uppercase text-slate-400 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-600" /> Prompts:
            </span>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 bg-white hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 border border-slate-200 rounded-full text-slate-600 font-medium transition-colors shadow-sm disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 font-bold ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-purple-100 text-purple-800 border border-purple-200'
                }`}
              >
                {msg.sender === 'user' ? 'SA' : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none space-y-2'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[9px] font-mono mt-1 ${
                    msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5 text-slate-400 text-xs italic">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              </div>
              Querying live system telemetry and verifying curriculum records...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex-shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about students, payments, subscriptions, or curriculum..."
              disabled={isLoading}
              className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
