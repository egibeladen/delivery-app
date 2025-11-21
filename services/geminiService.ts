import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

export const initializeGemini = () => {
  try {
    // Initialize the GoogleGenAI client with the API key
    // The API key must be obtained exclusively from the environment variable process.env.API_KEY
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
  }
};

export const startChat = async (): Promise<void> => {
  if (!ai) {
    initializeGemini();
  }
  
  if (!ai) {
    console.error("GoogleGenAI instance is not initialized. Cannot start chat.");
    return;
  }
  
  try {
    // Create a new chat session using the correct SDK method: ai.chats.create
    // We use gemini-2.5-flash for efficiency and tool support
    chatSession = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        // Removed maxOutputTokens as it should be paired with thinkingBudget or avoided
        tools: [
          { googleSearch: {} }
        ]
      }
    });
  } catch (error) {
    console.error("Failed to create chat session:", error);
  }
};

export const sendMessage = async (message: string): Promise<string> => {
  // Ensure session exists
  if (!chatSession) {
    await startChat();
  }

  // Double check if session creation succeeded
  if (!chatSession) {
    // Attempt one retry
    await startChat();
    if (!chatSession) {
      return "I'm currently experiencing connection issues or the API Key is missing. Please check your settings.";
    }
  }

  try {
    // Send the message to the model
    const result = await chatSession.sendMessage({ message });
    // Access the text property directly as per SDK guidelines
    return result.text || "";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "I encountered an unexpected error. Please try asking again.";
  }
};