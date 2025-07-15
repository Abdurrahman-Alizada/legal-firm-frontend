// src/services/api/aiChatService.ts
import { api } from './apiIntercepters';


export const aiChatService = {
  createSession: async () => {
    const response = await api.post(`/ai-chat/session`);
    return response.data;
  },

  getSessions: async () => {
    const response = await api.get(`/ai-chat/sessions`);
    return response.data;
  },

  getSession: async (sessionId: string) => {
    const response = await api.get(`/ai-chat/session/${sessionId}`);
    return response.data;
  },

  sendMessage: async (message: string, sessionId: string) => {
    const response = await api.post(`/ai-chat`, {
      message,
      sessionId
    });
    return response.data;
  }
};