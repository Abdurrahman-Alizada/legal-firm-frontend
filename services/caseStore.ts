import Toast from 'react-native-toast-message';
import { create } from 'zustand';
import { caseService } from './api/caseService';

export interface Case {
  _id: string;
  title: string;
  clientId: string;
  companyId: string;
  clientName: string;
  status: 'active' | 'pending' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  description?: string;
  documents?: any[];
}

interface CaseState {
  cases: Case[];
  selectedCase: any;
  isLoading: boolean;
}

interface CaseActions {
  fetchCases: () => Promise<void>;
  fetchCaseById: (id: string) => Promise<void>;
  createCase: (caseData: Omit<Case, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCase: (id: string, updates: Partial<Case>) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  uploadDocument: (id: string, documentData: any) => Promise<void>;
  selectCase: (case_: Case | null) => void;
}

export const useCaseStore = create<CaseState & CaseActions>((set, get) => ({
  cases: [],
  selectedCase: null,
  isLoading: false,

  fetchCases: async () => {
    set({ isLoading: true });
    try {
      const {data} = await caseService.getAllCases();
      set({ cases: data, isLoading: false });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch cases',
        text2: error instanceof Error ? error.message : 'Unknown error',
      });
      set({ isLoading: false });
    }
  },

  fetchCaseById: async (id: string) => {
    set({ isLoading: true });
    try {
      const {data} = await caseService.getCaseById(id);
      set({ selectedCase: data, isLoading: false });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch case',
        text2: error instanceof Error ? error.message : 'Unknown error',
      });
      set({ isLoading: false });
    }
  },

  createCase: async (caseData) => {
    set({ isLoading: true });
    try {
      const {data}= await caseService.createCase({...caseData,clientId:"6876434d5fa9464f538655f5"});
      set(state => ({
        cases: [data, ...state.cases],
        isLoading: false
      }));
      Toast.show({
        type: 'success',
        text1: 'Case Created',
        text2: 'The new case has been successfully created.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to create case',
        text2: error instanceof Error ? error.message : 'Unknown error',
      });
      set({ isLoading: false });
    }
  },

  updateCase: async (id, updates) => {
    set({ isLoading: true });
    try {
      const {data} = await caseService.updateCase(id, updates);
      set(state => ({
        cases: state.cases.map(case_ =>
          case_._id === id ? { ...case_, ...data } : case_
        ),
        isLoading: false
      }));
      Toast.show({
        type: 'success',
        text1: 'Case Updated',
        text2: 'The case was successfully updated.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to update case',
        text2: error instanceof Error ? error.message : 'Unknown error',
      });
      set({ isLoading: false });
    }
  },

  deleteCase: async (id) => {
    set({ isLoading: true });
    try {
      await caseService.deleteCase(id);
      set(state => ({
        cases: state.cases.filter(case_ => case_._id !== id),
        selectedCase: state.selectedCase?._id === id ? null : state.selectedCase,
        isLoading: false
      }));
      Toast.show({
        type: 'success',
        text1: 'Case Deleted',
        text2: 'The case was successfully deleted.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to delete case',
        text2: error instanceof Error ? error.message : 'Unknown error',
      });
      set({ isLoading: false });
    }
  },

  uploadDocument: async (id, documentData) => {
    set({ isLoading: true });
    try {
      const updatedCase = await caseService.uploadDocument(id, documentData);
      set(state => ({
        cases: state.cases.map(case_ =>
          case_._id === id ? { ...case_, ...updatedCase } : case_
        ),
        isLoading: false
      }));
      Toast.show({
        type: 'success',
        text1: 'Document Uploaded',
        text2: 'Your document has been attached to the case.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to upload document',
        text2: error instanceof Error ? error.message : 'Unknown error',
      });
      set({ isLoading: false });
    }
  },

  selectCase: (case_) => set({ selectedCase: case_ }),
}));
