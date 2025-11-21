import React from 'react';
import { City } from '../types';
import { CITIES } from '../constants';
import { MapPin, Bike, Package, Navigation } from 'lucide-react';

interface LandingPageProps {
  onCitySelect: (city: City) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onCitySelect }) => {
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 left-1/3 w-64 h-64 bg-red-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-2xl mb-4 border border-emerald-500/20">
                <Bike className="w-8 h-8 text-emerald-400" />
            </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Morocco Moto Jobs</h1>
          <p className="text-slate-400 text-lg">Find local motorcycle delivery jobs instantly.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-400" />
            Select your city
          </h2>
          
          <div className="grid grid-cols-1 gap-3">
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => onCitySelect(city as City)}
                className="group flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <MapPin className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
                  </div>
                  <span className="text-white font-medium">{city}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                    <Package className="w-4 h-4 text-emerald-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-500">
          <p>Powered by Google Gemini AI & Real-time Search</p>
        </div>
      </div>
    </div>
  );
};