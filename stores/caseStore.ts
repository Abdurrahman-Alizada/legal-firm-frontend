import { create } from 'zustand';

export interface Case {
  id: string;
  title: string;
  clientName: string;
  status: 'active' | 'pending' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  description?: string;
  documents?: number;
}

interface CaseState {
  cases: Case[];
  selectedCase: Case | null;
  isLoading: boolean;
  error: string | null;
}

interface CaseActions {
  fetchCases: () => Promise<void>;
  createCase: (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCase: (id: string, updates: Partial<Case>) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  selectCase: (case_: Case | null) => void;
  clearError: () => void;
}

export const useCaseStore = create<CaseState & CaseActions>((set, get) => ({
  cases: [],
  selectedCase: null,
  isLoading: false,
  error: null,

  fetchCases: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCases: Case[] = [
        {
          id: '1',
          title: 'Contract Dispute - TechCorp',
          clientName: 'TechCorp Inc.',
          status: 'active',
          priority: 'high',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-20T14:30:00Z',
          description: 'Breach of contract case involving software licensing agreement',
          documents: 15
        },
        {
          id: '2',
          title: 'Employment Law Case',
          clientName: 'Sarah Johnson',
          status: 'pending',
          priority: 'medium',
          createdAt: '2024-01-18T09:15:00Z',
          updatedAt: '2024-01-18T09:15:00Z',
          description: 'Wrongful termination claim',
          documents: 8
        },
        {
          id: '3',
          title: 'Real Estate Transaction',
          clientName: 'Property Developers LLC',
          status: 'active',
          priority: 'low',
          createdAt: '2024-01-10T16:45:00Z',
          updatedAt: '2024-01-19T11:20:00Z',
          description: 'Commercial property acquisition due diligence',
          documents: 22
        }
      ];
      
      set({ cases: mockCases, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch cases',
        isLoading: false
      });
    }
  },

  createCase: async (caseData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newCase: Case = {
        ...caseData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documents: 0
      };
      
      set(state => ({
        cases: [newCase, ...state.cases],
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create case',
        isLoading: false
      });
    }
  },

  updateCase: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        cases: state.cases.map(case_ =>
          case_.id === id
            ? { ...case_, ...updates, updatedAt: new Date().toISOString() }
            : case_
        ),
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update case',
        isLoading: false
      });
    }
  },

  deleteCase: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set(state => ({
        cases: state.cases.filter(case_ => case_.id !== id),
        selectedCase: state.selectedCase?.id === id ? null : state.selectedCase,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete case',
        isLoading: false
      });
    }
  },

  selectCase: (case_) => set({ selectedCase: case_ }),
  clearError: () => set({ error: null })
}));