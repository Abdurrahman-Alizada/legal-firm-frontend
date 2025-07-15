import { Case } from "../caseStore";
import { api } from "./apiIntercepters";

export const caseService = {
  async getAllCases() {
    try {
      const response = await api.get(`/case`);
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
      const response = await api.get(`/case/${id}`);
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async createCase(caseData: Omit<Case, '_id' | 'createdAt' | 'updatedAt'>) {
    try {
      const response = await api.post(`/case`, caseData);
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async updateCase(id: string, updates: Partial<Case>) {
    try {
      const response = await api.patch(`/case/${id}`, updates);
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
      const response = await api.delete(`/case/${id}`);
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

  async uploadDocument(id: string, formData: any) {
    try {
      const response = await api.post(`/case/${id}/documents`,formData , {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  },
};
