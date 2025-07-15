// src/services/chatService.ts
import { ChatMessage, ChatThread } from '@/types';
import { api } from './apiIntercepters';

// Mock implementation - replace with actual API calls
export const chatService = {
  async sendMessage(caseId: string, content: string): Promise<ChatMessage> {
    try {
      const response =await api.post(`/chat/send`,{caseId,content});
      return response.data.data      
    } catch (error:any) {
      console.log(error)
      throw new Error(error.message||'Failed to send message'); 
    }
  },

  async getMessages(caseId: string): Promise<ChatMessage[]> {
    try {
      const response =await api.get(`/chat/case/${caseId}`);
      return response.data.data    
    } catch (error:any) {
      throw new Error(error.message||'Failed to get message'); 
    }
  },
 
  async getChatThreads(): Promise<ChatThread[]> {
    try {
      const {data} =await api.get(`/chat-thread`);
      return data.data.map((item: any) => ({
      _id: item._id,
      caseId: item.caseId,
      caseTitle: item.caseTitle || 'Untitled Case',
      lastMessage: item.lastMessage,
      lastMessageAt: item.lastMessageAt,
      participants: item.participants || [],
      unreadCount: item.unreadCount || 0
    }));   
    } catch (error:any) {
      throw new Error(error.message||'Failed to get message'); 
    }
  }
    

};