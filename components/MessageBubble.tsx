import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Job } from '../types';
import { JobCard } from './JobCard';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in`}>
      <div className={`flex max-w-[95%] md:max-w-[85%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-slate-200' : 'bg-emerald-600'}`}>
          {isUser ? <User className="w-5 h-5 text-slate-600" /> : <Bot className="w-5 h-5 text-white" />}
        </div>

        <div className="flex flex-col gap-2 w-full">
          {/* Text Content */}
          <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
            isUser 
              ? 'bg-slate-900 text-white rounded-tr-none' 
              : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
          }`}>
            <ReactMarkdown 
                className="prose prose-sm max-w-none prose-a:text-emerald-600 prose-strong:text-emerald-700"
                components={{
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />
                }}
            >
              {message.text}
            </ReactMarkdown>
          </div>

          {/* Job Cards Grid */}
          {message.jobs && message.jobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {message.jobs.map((job, index) => (
                <JobCard key={`${message.id}-job-${index}`} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};