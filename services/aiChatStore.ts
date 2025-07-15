// src/services/chatStore.ts
import { create } from 'zustand';
import { api } from './api/apiIntercepters';

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  _id: string;
  sessionId: string;
  content: string;
  role: MessageRole;
  createdAt: string;
}

export interface ChatSession {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

interface ChatState {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  loading: boolean;
  error: string | null;
  
  createSession: () => Promise<void>;
  fetchSessions: () => Promise<void>;
  fetchSession: (sessionId: string) => Promise<void>;
  sendMessage: (message: string, sessionId?: string) => Promise<void>;
  clearCurrentSession: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  currentSession: null,
  loading: false,
  error: null,

  createSession: async () => {
    set({ loading: true, error: null });
    try {
      // API call to create new session
      const response = await api.post('/ai-chat/session');
      const newSession: ChatSession = await response.data.data;
      
      set(state => ({
        sessions: [newSession, ...state.sessions],
        currentSession: newSession
      }));
    } catch (error) {
      set({ error: 'Failed to create session' });
    } finally {
      set({ loading: false });
    }
  },

  fetchSessions: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/ai-chat/sessions');
      const sessions: ChatSession[] = await response.data.data;
      set({ sessions });
    } catch (error) {
      set({ error: 'Failed to load sessions' });
    } finally {
      set({ loading: false });
    }
  },

  fetchSession: async (sessionId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/ai-chat/session/${sessionId}`);
      const session: ChatSession = await response.data.data;
      
      set(state => ({
        currentSession: session,
        sessions: state.sessions.map(s => 
          s._id === sessionId ? session : s
        )
      }));
    } catch (error) {
      set({ error: 'Failed to load session' });
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (message: string, sessionId?: string) => {
    set({ loading: true, error: null });
    try {
      const { currentSession } = get();
      const targetSessionId = sessionId || currentSession?._id;
      
      if (!targetSessionId) {
        await get().createSession();
        return get().sendMessage(message);
      }

      // Add user message to UI immediately
      const userMessage: ChatMessage = {
        _id: `temp-${Date.now()}`,
        sessionId: targetSessionId,
        content: message,
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      set(state => ({
        currentSession: state.currentSession ? {
          ...state.currentSession,
          messages: [...state.currentSession.messages, userMessage]
        } : null,
        sessions: state.sessions.map(session => 
          session._id === targetSessionId ? {
            ...session,
            messages: [...session.messages, userMessage]
          } : session
        )
      }));

      // Send to backend
      const response = await api.post('/ai-chat', {message,sessionId: targetSessionId });

      const assistantMessage: ChatMessage = await response.data.data;

      // Replace temporary message with server response
      set(state => ({
        currentSession: state.currentSession ? {
          ...state.currentSession,
          messages: state.currentSession.messages
            .filter(msg => msg._id !== userMessage._id)
            .concat(assistantMessage)
        } : null,
        sessions: state.sessions.map(session => 
          session._id === targetSessionId ? {
            ...session,
            messages: session.messages
              .filter(msg => msg._id !== userMessage._id)
              .concat(assistantMessage)
          } : session
        )
      }));
    } catch (error) {
      set({ error: 'Failed to send message' });
    } finally {
      set({ loading: false });
    }
  },

  clearCurrentSession: () => set({ currentSession: null })
}));