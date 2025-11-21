import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { ChatInterface } from './components/ChatInterface';
import { City, AppState } from './types';
import { initializeGemini } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [selectedCity, setSelectedCity] = useState<City>(null);

  useEffect(() => {
    initializeGemini();
  }, []);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setAppState(AppState.CHAT);
  };

  const handleBack = () => {
    setAppState(AppState.LANDING);
    setSelectedCity(null);
  };

  return (
    <>
      {appState === AppState.LANDING && (
        <LandingPage onCitySelect={handleCitySelect} />
      )}
      {appState === AppState.CHAT && selectedCity && (
        <ChatInterface city={selectedCity} onBack={handleBack} />
      )}
    </>
  );
};

export default App;