export interface Job {
  title: string;
  company: string;
  salary: string;
  difficulty: string;
  description?: string;
  requirements: string[];
  distance_est: string;
  rating: string;
  apply_link: string;
  source: string;
  // New fields for "Super-Connector" mode
  contact_info?: string;
  urgency?: string;
  probability?: string;
  strategy?: string;
  template?: string;
  type?: string;
}

export interface JobResponse {
  jobs: Job[];
  summary: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  jobs?: Job[];
  isThinking?: boolean;
  timestamp: number;
}

export type City = 'Rabat' | 'Salé' | 'Temara' | 'Kenitra' | null;

export enum AppState {
  LANDING = 'LANDING',
  CHAT = 'CHAT'
}