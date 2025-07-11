import { colors, fonts, spacing } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import {
  responsiveFontSize as rf,
  responsiveHeight as rh,
  responsiveWidth as rw,
} from "react-native-responsive-dimensions";

interface TalioButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  gradient?: boolean;
  gradientColors?: string[];
}

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  gradient = false,
  gradientColors = [colors.primary, '#0a5a7a'],
}: TalioButtonProps) => {
  // Determine button styles based on variant
  const getButtonStyle = (): StyleProp<ViewStyle> => {
    const baseStyle: StyleProp<ViewStyle>[] = [styles.button, styles[`button_${variant}` as const],style];
    if (disabled) baseStyle.push(styles.disabled);
    if (fullWidth) baseStyle.push(styles.fullWidth);
    if (variant === 'icon') baseStyle.push(styles.iconButton);
    return baseStyle;
  };

  // Determine text styles based on variant and size
  const getTextStyle = (): StyleProp<TextStyle> => {
    const baseStyle: StyleProp<TextStyle>[] = [styles.text];
    if (variant !== 'icon' && styles[`text_${variant}` as const]) baseStyle.push(styles[`text_${variant}` as const]);
    if (styles[`text_${size}` as const]) baseStyle.push(styles[`text_${size}` as const]);
    return baseStyle;
  };

  // Determine button content
  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          size={ 'small'} 
          color={variant === 'primary' || variant === 'secondary' ? colors.text.white : colors.primary} 
        />
      );
    }

    if (variant === 'icon') {
      return (
        <Ionicons 
          name={icon || 'heart'} 
          size={getIconSize()} 
          color={getIconColor()} 
        />
      );
    }

    return (
      <View style={styles.content}>
        {icon && iconPosition === 'left' && (
          <Ionicons 
            name={icon} 
            size={getIconSize()} 
            color={getIconColor()} 
            style={styles.iconLeft} 
          />
        )}
        <Text style={[getTextStyle(), textStyle]}>
          {title}
        </Text>
        {icon && iconPosition === 'right' && (
          <Ionicons 
            name={icon} 
            size={getIconSize()} 
            color={getIconColor()} 
            style={styles.iconRight} 
          />
        )}
      </View>
    );
  };

  const getIconSize = () => {
    if (size === 'sm') return rf(2);
    if (size === 'lg') return rf(2.8);
    return rf(2.4);
  };

  const getIconColor = () => {
    if (variant === 'primary' || variant === 'secondary') return colors.text.white;
    if (variant === 'outline') return colors.primary;
    return colors.text.primary;
  };

  const ButtonContainer:any = gradient ? LinearGradient : View;
  const gradientProps = gradient ? {
    colors: gradientColors,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  } : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled }
      activeOpacity={0.8}
      style={getButtonStyle() as StyleProp<ViewStyle>}
    >
      <ButtonContainer 
        {...gradientProps}
        style={styles.gradientContainer}
      >
        {renderContent()}
      </ButtonContainer>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height:rh(5),
    borderRadius: rw(2),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  gradientContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Button variants
  button_primary: {
    backgroundColor: colors.primary,
  },
  button_secondary: {
    backgroundColor: colors.secondary,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  button_text: {
    backgroundColor: 'transparent',
  },
  button_icon: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Button sizes
  button_sm: {
    paddingVertical: rh(0.8),
    paddingHorizontal: rw(4),
    minHeight: rh(4),
  },
  button_md: {
    paddingVertical: rh(1.2),
    paddingHorizontal: rw(6),
    minHeight: rh(5),
  },
  button_lg: {
    paddingVertical: rh(1.8),
    paddingHorizontal: rw(8),
    minHeight: rh(6.5),
  },
  // Text styles
  text: {
    fontFamily: fonts.family.semibold,
    textAlign: 'center',
  },
  text_primary: {
    color: colors.text.white,
  },
  text_secondary: {
    color: colors.text.secondary,
  },
  text_outline: {
    color: colors.primary,
  },
  text_text: {
    color: colors.primary,
  },
  text_sm: {
    fontSize: fonts.sizes.sm,
  },
  text_md: {
    fontSize: fonts.sizes.base,
  },
  text_lg: {
    fontSize: fonts.sizes.lg,
  },
  // Content
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  iconButton: {
    width: rh(6),
    height: rh(6),
    borderRadius: rh(3),
  },
  // States
  disabled: {
    opacity: 0.6,
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button;