import { ChatMessage, ChatThread, SCOPE } from '@/types';
import { api } from './apiIntercepters';


export const chatService = {
  async getChatThreads(): Promise<ChatThread[]> {
    try {
      const { data } = await api.get(`/chat-thread`);
      return data.data
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get message');
    }
  },
  async createChatThread(data: {
    scope: SCOPE,
    caseId?: string,
    clientCompanyId?: string,
    lawCompanyId?: string
  }) {
    try {
      const response = await api.post(`/chat-thread`, data);
      return response.data.data
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get message');
    }
  },
  async getChatThreadById(threadId: string) {
    try {
      const response = await api.get(`/chat-thread/${threadId}`);
      return response.data
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get message');
    }
  },
  async sendMessage(scope: SCOPE, threadId: string, content: string): Promise<ChatMessage> {
    try {
      const response = await api.post(`/messages`, { threadId, content });
      return response.data
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message || 'Failed to send message');
    }
  },

  async getMessages(threadId: string): Promise<ChatMessage[]> {
    try {
      const response = await api.get(`/messages/thread/${threadId}`);
      return response.data.data
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get message');
    }
  },
};