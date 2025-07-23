import { ChatMessage, ChatThread, SCOPE } from '@/types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { chatService } from './api/chatService';

interface ChatState {
  threads: ChatThread[];
  messages: Record<string, ChatMessage[]>; // threadId -> messages
  loading: boolean;
  error: string | null;
  fetchThreads: () => Promise<void>;
  fetchMessages: (threadId: string) => Promise<void>;
  sendMessage: (scope: SCOPE, threadId: string, content: string) => Promise<void>;
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

    fetchMessages: async (threadId) => {
      try {
        set({ loading: true, error: null });
        const messages = await chatService.getMessages(threadId);
        set((state) => {
          state.messages[threadId] = messages;
        });
      } catch (error) {
        set({ error: 'Failed to load messages' });
      } finally {
        set({ loading: false });
      }
    },

    sendMessage: async (scope, threadId, content) => {
      try {
        set({ loading: true });
        const newMessage = await chatService.sendMessage(scope, threadId, content);
        set((state) => {
          if (!state.messages[threadId]) {
            state.messages[threadId] = [];
          }
          state.messages[threadId].push(newMessage);
        });
      } catch (error) {
        set({ error: 'Failed to send message' });
      } finally {
        set({ loading: false });
      }
    },
  }))
);