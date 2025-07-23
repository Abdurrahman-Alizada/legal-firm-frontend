// src/services/chatStore.ts
import { AIChatMessage, AIChatSession } from '@/types';
import { create } from 'zustand';
import { api } from './api/apiIntercepters';

export type MessageRole = 'user' | 'assistant';

interface ChatState {
    sessions: AIChatSession[];
    currentSessionId: string | null;
    currentSessionMessages: AIChatMessage[];
    loading: boolean;
    error: string | null;

    createSession: () => Promise<void>;
    fetchSessions: () => Promise<void>;
    fetchSessionMessages: (sessionId: string) => Promise<void>;
    setCurrentSession: (sessionId: string) => Promise<void>;
    sendMessage: (message: string, sessionId?: string) => Promise<void>;
    clearCurrentSession: () => void;
}

export const useAIChatStore = create<ChatState>((set, get) => ({
    sessions: [],
    currentSessionId: null,
    currentSessionMessages: [],
    loading: false,
    error: null,

    createSession: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/ai-chat/session');
            const newSession: AIChatSession = response.data.data;
            set(state => ({
                sessions: [newSession, ...state.sessions],
            }));
            // Optionally, set as current session
            await get().setCurrentSession(newSession._id);
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
            const sessions: AIChatSession[] = response.data.data;
            set({ sessions });
        } catch (error) {
            set({ error: 'Failed to load sessions' });
        } finally {
            set({ loading: false });
        }
    },

    fetchSessionMessages: async (sessionId: string) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/ai-chat/session/${sessionId}`);
            const messages: AIChatMessage[] = response.data.data;
            set({ currentSessionMessages: messages });
        } catch (error) {
            set({ error: 'Failed to load messages' });
        } finally {
            set({ loading: false });
        }
    },

    setCurrentSession: async (sessionId: string) => {
        set({ currentSessionId: sessionId });
        await get().fetchSessionMessages(sessionId);
    },

    sendMessage: async (message: string, sessionId?: string) => {
        set({ loading: true, error: null });
        try {
            const targetSessionId = sessionId || get().currentSessionId;
            if (!targetSessionId) {
                await get().createSession();
                return get().sendMessage(message);
            }
            
            // Create temporary message object with user message
            const tempMessage: AIChatMessage = {
                _id: `temp-${Date.now()}`,
                userId: '', // Will be set by backend
                roleId: '', // Will be set by backend
                message: message,
                response: '', // Will be filled after API response
                sessionId: targetSessionId,
                createdAt: new Date().toISOString(),
                flaggedForReview: false
            };
            
            // Add the temporary message to UI immediately
            set(state => ({ 
                currentSessionMessages: [...state.currentSessionMessages, tempMessage] 
            }));
            
            // Send to backend
            const response = await api.post('/ai-chat', { 
                message, 
                sessionId: targetSessionId 
            });
            
            // The response contains just the AI response string
            const aiResponse = response.data;
            
            // Update the temporary message with the AI response
            set(state => ({
                currentSessionMessages: state.currentSessionMessages.map(msg => 
                    msg._id === tempMessage._id 
                        ? { ...msg, response: aiResponse }
                        : msg
                )
            }));
        } catch (error) {
            set({ error: 'Failed to send message' });
        } finally {
            set({ loading: false });
        }
    },

    clearCurrentSession: () => set({ currentSessionId: null, currentSessionMessages: [] })
}));