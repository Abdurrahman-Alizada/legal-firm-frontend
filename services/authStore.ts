import { adminRole, LoginCredentials, Role, SignUpCredentials } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert } from "react-native";
import { create } from "zustand";
import { authService } from "./api/authService";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  companyId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: null | 'admin' | 'client';
}

interface AuthActions {
  login: ({ email, password }: LoginCredentials) => Promise<void>;
  register: ({
    email,
    password,
    name,
    roleId,
  }: SignUpCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  loadFromStorage: () => Promise<any>;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: null,

  login: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { user, accessToken } = await authService.login(userData);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("token", accessToken);
      set({
        user,
        token: accessToken,
        isAuthenticated: user.role._id === adminRole._id ? 'admin' : 'client',
        isLoading: false,
        error: null,
      });
      if (user.role._id == adminRole._id) {
        router.dismissTo("/(admin)");
      } else {
        router.dismissTo("/(client)");
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Login failed",
        isLoading: false,
      });
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(userData);
      set({ isLoading: false, error: null });
      Alert.alert("Registered", "Please signin to continue.",[{text:"Ok"}]);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Register failed",
        isLoading: false,
      });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    set({
      user: null,
      token: null,
      isAuthenticated: null,
      error: null,
    });
    router.replace('/(auth)')
  },

  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  loadFromStorage: async () => {
    const userStr = await AsyncStorage.getItem("user");
    const token = await AsyncStorage.getItem("token");
    if (userStr && token) {
      const user = JSON.parse(userStr);
      const isAuthenticated=user?user.role._id === adminRole._id ? 'admin' : 'client':null
      set({
        user,
        token,
        isAuthenticated
      });
      return isAuthenticated
    }
    return null
  },
}));
