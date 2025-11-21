
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MapPin, ArrowLeft, Zap, Clock, DollarSign, Briefcase, AlertTriangle } from 'lucide-react';
import { Message, City, JobResponse } from '../types';
import { sendMessage } from '../services/geminiService';
import { MessageBubble } from './MessageBubble';

interface ChatInterfaceProps {
  city: City;
  onBack: () => void;
}

const SUGGESTIONS = [
  { text: "🚀 START NOW (Urgent)", prompt: "I need to make money TODAY. Find me same-day delivery jobs, urgent errands, or restaurants hiring immediately. Give me phone numbers and addresses." },
  { text: "💰 Highest Paying", prompt: "Find the absolute highest paying delivery gigs in my area. Include dropshipping partners and private courier roles." },
  { text: "🌙 Night Shift", prompt: "Who is hiring for night delivery? Check pharmacies, fast food, and 24/7 stores." },
  { text: "📱 WhatsApp Contacts", prompt: "Give me a list of direct WhatsApp numbers for recruiters or restaurant managers looking for drivers." }
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ city, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial greeting
  useEffect(() => {
    if (!isInitialized && city) {
      setIsInitialized(true);
      const initialMsg: Message = {
        id: 'init',
        role: 'model',
        text: `**Rabat-Salé-Kénitra Moto Job Center** active. \n\nI am scanning **${city}** for every possible delivery opportunity: \n- Restaurants & Snacks \n- Apps (Glovo, Yassir, etc.) \n- Logistics Companies \n- Private Errands. \n\nStand by for a list of contacts and urgent openings.`,
        timestamp: Date.now()
      };
      setMessages([initialMsg]);
      
      // Auto-trigger first search
      handleAutoSearch(city);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  const parseResponse = (text: string): { cleanText: string; jobs: any[] } => {
    try {
      // 1. Try to find a standard JSON block
      let jsonBlockRegex = /```json\s*([\s\S]*?)```/;
      let match = text.match(jsonBlockRegex);

      // 2. If not found, try to find a JSON block that might be truncated
      if (!match) {
        jsonBlockRegex = /```json\s*([\s\S]*)/;
        match = text.match(jsonBlockRegex);
      }

      if (match && match[1]) {
        const jsonStr = match[1].trim();
        try {
          const parsed: JobResponse = JSON.parse(jsonStr);
          // Remove the JSON block from text to avoid duplication
          const cleanText = text.replace(match[0], '').trim() || parsed.summary || "Here are the opportunities I found:";
          return { cleanText, jobs: parsed.jobs || [] };
        } catch (e) {
          console.warn("JSON parse failed:", e);
          return { cleanText: text, jobs: [] };
        }
      }
    } catch (e) {
      console.error("Unexpected error in parseResponse:", e);
    }
    
    return { cleanText: text, jobs: [] };
  };

  const handleAutoSearch = async (searchCity: string) => {
    setIsLoading(true);
    try {
      // THE "SUPER-CONNECTOR" PROMPT
      const prompt = `Your task is to find every possible way for a motorcycle owner in ${searchCity} to start making money immediately.
      Analyze and list ALL potential job opportunities including: Restaurants, Cafés, Supermarkets, Pharmacies, Print shops, Dropshipping suppliers, Facebook Groups, and Delivery apps.
      
      For each opportunity, you MUST provide:
      - Name and Type
      - EXACT CONTACT OPTIONS (Phone, WhatsApp, Address) if found.
      - Urgency Level
      - Probability of hiring within 24h
      - Best way to approach them
      - A message template
      
      Also generate strategic advice sections: SAME_DAY_JOBS, HIGH_EARNING_JOBS, STRATEGY_24H.
      Return listings in the specified JSON format.`;
      
      const responseText = await sendMessage(prompt);
      const { cleanText, jobs } = parseResponse(responseText);

      const botMsg: Message = {
        id: Date.now().toString(),
        role: 'model',
        text: cleanText,
        jobs: jobs,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Error in auto search", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I encountered an error while scanning for jobs. Please try asking manually.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const processMessage = async (textToSend: string, displayInput: string = "") => {
     const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: displayInput || textToSend,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
        let promptToSend = textToSend;
        const lcInput = textToSend.toLowerCase();
        // Enforce format for lists
        if (lcInput.includes('job') || lcInput.includes('list') || lcInput.includes('find') || lcInput.includes('contacts')) {
            promptToSend += " (Provide output in JSON format for listings, including direct phone numbers/WhatsApp if available, followed by strategic text advice)";
        }

      const responseText = await sendMessage(promptToSend);
      const { cleanText, jobs } = parseResponse(responseText);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: cleanText,
        jobs: jobs,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, something went wrong. Please try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSend = () => {
    if (!input.trim()) return;
    processMessage(input);
  };

  const handleSuggestionClick = (suggestion: { text: string, prompt: string }) => {
    processMessage(suggestion.prompt, suggestion.text);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">Morocco Moto Jobs</h1>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <MapPin className="w-3 h-3" />
              {city}
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-4">
               <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <span className="text-sm text-slate-500">Contacting restaurants, apps, and scanning ads...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0">
        <div className="max-w-3xl mx-auto relative">
          {/* Suggestion Chips */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-1 scrollbar-hide mask-linear-fade">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(s)}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-emerald-50 border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-200 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap"
              >
                {idx === 0 && <Zap className="w-3 h-3 text-red-500" />}
                {idx === 1 && <DollarSign className="w-3 h-3 text-emerald-500" />}
                {idx === 2 && <Clock className="w-3 h-3 text-blue-500" />}
                {idx === 3 && <Briefcase className="w-3 h-3 text-purple-500" />}
                {s.text}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask for urgent jobs, WhatsApp numbers, or strategies..."
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-full py-3 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 bottom-2 p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2">
            AI can make mistakes. Verify contact details before sending personal info.
        </p>
      </div>
    </div>
  );
};
