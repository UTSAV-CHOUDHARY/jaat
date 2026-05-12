import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const aiService = {
  async getTaskSuggestions(currentTasks: Task[]) {
    const safeTasks = currentTasks || [];
    const taskContext = safeTasks.length > 0 
      ? safeTasks.map(t => t.title).join(", ") 
      : "No tasks yet. Start with common goal-oriented tasks.";
      
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `System: You are an expert productivity consultant.
User: Based on my current tasks: [${taskContext}], suggest 3 next logical, specific, and actionable tasks to help me stay productive. 
Format your response as a JSON array of objects with keys: title, description, category, and priority (low, medium, high).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              priority: { type: Type.STRING, enum: ["low", "medium", "high"] }
            },
            required: ["title", "description", "category", "priority"]
          }
        }
      }
    });

    try {
       const text = response.text;
       return JSON.parse(text || "[]");
    } catch (e) {
      console.error("AI Error:", e);
      return [];
    }
  },

  async getDailyPlanner(tasks: Task[]) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a professional daily plan based on these tasks: ${JSON.stringify(tasks)}. Prioritize appropriately and group them into morning, afternoon, and evening slots.`,
      config: {
        systemInstruction: "You are a professional productivity coach."
      }
    });
    return response.text;
  },

  async getProductivityTips(stats: any) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Given these user productivity stats: ${JSON.stringify(stats)}, provide 3 concise, highly actionable productivity tips.`,
      config: {
         systemInstruction: "You are an AI life coach specializing in deep work and focus."
      }
    });
    return response.text;
  },

  async getMotivationalPopup() {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate one short, extremely powerful motivational quote or message for a productivity app user.",
      config: {
        systemInstruction: "You are a blend of Marcus Aurelius and James Clear."
      }
    });
    return response.text;
  }
};
