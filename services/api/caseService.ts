import { Case } from "../caseStore";
import { api } from "./apiIntercepters";

export const caseService = {
  async getAllCases() {
    try {
      const response = await api.get(`/cases`);
      if (response.status !== 200) {
        const errorData = response.data;
        throw new Error(errorData.message || 'Failed to get cases');
      }
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async getCaseById(id: string) {
    try {
      const response = await api.get(`/cases/${id}`);
      if (response.status !== 200) {
        const errorData = response.data;
        throw new Error(errorData.message || 'Failed to get case');
      }
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async createCase(caseData: Omit<Case, '_id' | 'createdAt' | 'updatedAt'>) {
    try {
      const response = await api.post(`/cases`, caseData);
      if (response.status !== 201) {
        const errorData = response.data;
        throw new Error(errorData.message || 'Failed to create case');
      }
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async updateCase(id: string, updates: Partial<Case>) {
    try {
      const response = await api.patch(`/cases/${id}`, updates);
      if (response.status !== 200) {
        const errorData = response.data;
        throw new Error(errorData.message || 'Failed to update case');
      }
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async deleteCase(id: string) {
    try {
      const response = await api.delete(`/cases/${id}`);
      if (response.status !== 200) {
        const errorData = response.data;
        throw new Error(errorData.message || 'Failed to delete case');
      }
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async uploadDocument(id: string, documentData: any) {
    try {
      const formData = new FormData();
      for (const key in documentData) {
        formData.append(key, documentData[key]);
      }
      const response = await api.post(`/cases/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status !== 201) {
        const errorData = response.data;
        throw new Error(errorData.message || 'Failed to upload document');
      }
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
