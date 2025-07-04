export const colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',
  secondary: '#06B6D4',
  accent: '#F59E0B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    light: '#9CA3AF',
    white: '#FFFFFF'
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    dark: '#111827',
    card: '#FFFFFF'
  },
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#6B7280'
  }
} as const;

export const fonts = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const
  },
  family:{
    regular:'Inter-Regular',
        medium:'Inter-Medium',
        semibold:'Inter-SemiBold',
        bold:'Inter-Bold',
  }
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48
} as const;

export const layout = {
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999
  },
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
      elevation: 5
    }
  }
} as const;

export const API_ENDPOINTS = {
  BASE_URL: 'https://api.firmlink.ai',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh'
  },
  CASES: {
    LIST: '/cases',
    CREATE: '/cases',
    DETAIL: (id: string) => `/cases/${id}`
  },
  CLIENTS: {
    LIST: '/clients',
    CREATE: '/clients',
    DETAIL: (id: string) => `/clients/${id}`
  }
} as const;

export const SCREEN_NAMES = {
  TABS: '(tabs)',
  HOME: 'index',
  CASES: 'cases',
  CLIENTS: 'clients',
  DOCUMENTS: 'documents',
  PROFILE: 'profile'
} as const;

export const ERROR_MESSAGES = {
  NETWORK: 'Network connection failed. Please check your internet connection.',
  AUTH: 'Authentication failed. Please log in again.',
  GENERIC: 'Something went wrong. Please try again.',
  VALIDATION: 'Please check your input and try again.'
} as const;