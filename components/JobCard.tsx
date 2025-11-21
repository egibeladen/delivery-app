import React, { useState } from 'react';
import { Job } from '../types';
import { MapPin, DollarSign, BarChart, Star, ExternalLink, CheckCircle, Phone, Zap, MessageCircle, Copy, Send, AlertCircle } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all duration-200 flex flex-col gap-3 relative overflow-hidden">
      {/* Urgency Badge */}
      {job.urgency && (
        <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 
          ${job.urgency.toLowerCase().includes('immediate') || job.urgency.toLowerCase().includes('high') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-blue-50 text-blue-700'}`}>
          <Zap className="w-3 h-3" />
          {job.urgency}
        </div>
      )}

      <div className="flex justify-between items-start pr-16">
        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">{job.title}</h3>
          <p className="text-slate-600 font-medium flex items-center gap-1">
            {job.company}
            {job.rating && (
              <span className="text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-amber-100">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                {job.rating}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Description */}
      {job.description && (
        <div className="text-sm text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
          {job.description}
        </div>
      )}

      {/* Contact Box - High Priority */}
      {job.contact_info && (
        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg animate-pulse-slow">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase mb-1">
            <Phone className="w-3.5 h-3.5" /> Direct Contact
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-mono text-emerald-900 font-bold select-all">{job.contact_info}</p>
            <button 
              onClick={() => handleCopy(job.contact_info || '')}
              className="text-xs text-emerald-600 hover:text-emerald-800 font-medium"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-sm mt-1">
        <div className="flex items-center gap-2 text-slate-700">
          <DollarSign className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-medium truncate" title={job.salary}>{job.salary}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="truncate" title={job.distance_est}>{job.distance_est}</span>
        </div>
        {job.probability && (
            <div className="flex items-center gap-2 text-slate-700 col-span-2">
              <BarChart className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="font-medium text-purple-700">Hiring Chance: {job.probability}</span>
            </div>
        )}
      </div>

      {/* Strategy Tip */}
      {job.strategy && (
        <div className="flex items-start gap-2 text-xs text-slate-600 bg-blue-50/50 p-2 rounded">
            <AlertCircle className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
            <span><strong className="text-blue-700">Strategy:</strong> {job.strategy}</span>
        </div>
      )}

      {/* Message Template */}
      {job.template && (
        <div className="mt-1">
           <div className="flex justify-between items-center mb-1">
             <p className="text-[10px] font-bold text-slate-400 uppercase">Message Template</p>
             <button 
                onClick={() => handleCopy(job.template || '')}
                className="flex items-center gap-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded transition-colors"
             >
                <Copy className="w-3 h-3" /> {copied ? 'Copied' : 'Copy'}
             </button>
           </div>
           <div className="bg-slate-50 p-2 rounded text-xs text-slate-500 italic border border-slate-100 border-l-2 border-l-emerald-400">
              "{job.template}"
           </div>
        </div>
      )}

      <div className="mt-2 pt-3 border-t border-slate-100 flex justify-between items-center">
        <span className="text-xs text-slate-400 truncate max-w-[120px]">Via {job.source}</span>
        <a 
          href={job.apply_link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
        >
          Apply / Contact
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};