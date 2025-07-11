import { ChatMessage, ChatThread } from '@/types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { chatService } from './api/chatService';

interface ChatState {
  threads: ChatThread[];
  messages: Record<string, ChatMessage[]>; // caseId -> messages
  loading: boolean;
  error: string | null;
  fetchThreads: () => Promise<void>;
  fetchMessages: (caseId: string) => Promise<void>;
  sendMessage: (caseId: string, content: string) => Promise<void>;
  markAsRead: (caseId: string) => void;
}

export const useChatStore = create<ChatState>()(
  immer((set, get) => ({
    threads: [],
    messages: {},
    loading: false,
    error: null,

    fetchThreads: async () => {
      try {
        set({ loading: true, error: null });
        const threads = await chatService.getChatThreads();
        set({ threads });
      } catch (error) {
        set({ error: 'Failed to load chats' });
      } finally {
        set({ loading: false });
      }
    },

    fetchMessages: async (caseId) => {
      try {
        set({ loading: true, error: null });
        const messages = await chatService.getMessages(caseId);
        set((state) => {
          state.messages[caseId] = messages;
        });
        get().markAsRead(caseId);
      } catch (error) {
        set({ error: 'Failed to load messages' });
      } finally {
        set({ loading: false });
      }
    },

    sendMessage: async (caseId, content) => {
      try {
        set({ loading: true });
        const newMessage = await chatService.sendMessage(caseId, content);
        
        // Update messages
        set((state) => {
          if (!state.messages[caseId]) {
            state.messages[caseId] = [];
          }
          state.messages[caseId].push(newMessage);
        });
        
        // Update thread with last message
        set((state) => {
          const thread = state.threads.find((t:any) => t.caseId === caseId);
          if (thread) {
            thread.lastMessage = content;
            thread.lastMessageAt = newMessage.createdAt;
            thread.unreadCount = 0;
          }
        });
      } catch (error) {
        set({ error: 'Failed to send message' });
      } finally {
        set({ loading: false });
      }
    },

    markAsRead: (caseId) => {
      set((state) => {
        const thread = state.threads.find((t :any)=> t.caseId === caseId);
        if (thread) {
          thread.unreadCount = 0;
        }
      });
    },
  }))
);