import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert anime and manga otaku assistant named "AniBot".
You have deep knowledge of anime history, genres, studios, and obscure facts.
Your tone is enthusiastic, helpful, and slightly informal (using terms like "nakama", "sugoi" occasionally but not cringy).
You can provide recommendations, explain plots (avoiding major spoilers unless asked), and discuss character depth.
Format your responses with clean markdown.
If asked about specific anime, try to highlight what makes them unique.
`;

export const getAIResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct the chat history for the Gemini SDK
    // Note: The SDK manages history via the chat object usually, but for a stateless request style
    // or reconstructing state, we can use generateContent with system instructions + history context,
    // OR use the chat API. Let's use the chat API for better context handling.
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "Sorry, I couldn't think of a response! (Try again)";
  } catch (error) {
    console.error("AI Error:", error);
    return "Gomenne! I ran into an error connecting to the anime network. Please check your connection or API key.";
  }
};