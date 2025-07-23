import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface GeneratedDocument {
  name: string;
  description?: string;
  url: string;
  docType: string;
  caseId?: string;
  caseName?: string;
  createdAt: string;
  fields: Record<string, any>;
  isImportant?: boolean;
}

interface DocumentState {
  documents: GeneratedDocument[];
  addDocument: (doc: GeneratedDocument) => void;
  getDocuments: () => GeneratedDocument[];
  toggleImportant: (url: string) => void;
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      documents: [],
      addDocument: (doc) =>
        set((state) => ({
          documents: [doc, ...state.documents],
        })),
      getDocuments: () => get().documents,
      toggleImportant: (url: string) => {
  set(state => ({
    documents: state.documents.map(doc => 
      doc.url === url ? { ...doc, isImportant: !doc.isImportant } : doc
    )
  }))}
    }),
    {
      name: 'document-store', // key in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
