import { responsiveHeight as hp, responsiveWidth as wp } from 'react-native-responsive-dimensions';

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
    secondary: '#F7FAFC',
    dark: '#111827',
    card: '#FFFFFF',
    primaryLight:"#7aa9f5"
  },
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#6B7280'
  }
} as const;

export const fonts = {
  sizes: {
    xs: hp(1.2),
    sm: hp(1.5),
    base: hp(2),
    lg: hp(2.2),
    xl: hp(2.5),
    '2xl': hp(3),
    '3xl': hp(3.5),
    '4xl': hp(4)
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
  xs: wp(1),
  sm: wp(2),
  md: wp(4),
  lg: wp(6),
  xl: wp(8),
  '2xl': wp(10),
  '3xl': wp(12)
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

