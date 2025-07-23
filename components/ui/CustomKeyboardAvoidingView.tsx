import { useKeyboard } from '@/hooks/useKeyboard';
import React, { ReactNode } from 'react';
import { Animated, Platform, StyleSheet } from 'react-native';

interface CustomKeyboardAvoidingViewProps {
  children: ReactNode;
  style?: any;
  offset?: number;
}

export const CustomKeyboardAvoidingView: React.FC<CustomKeyboardAvoidingViewProps> = ({
  children,
  style,
  offset = 0,
}) => {
  const { keyboardHeight, isKeyboardVisible } = useKeyboard();

  const translateY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isKeyboardVisible) {
      Animated.timing(translateY, {
        toValue: -(keyboardHeight - offset),
        duration: Platform.OS === 'ios' ? 250 : 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? 250 : 0,
        useNativeDriver: true,
      }).start();
    }
  }, [keyboardHeight, isKeyboardVisible, offset]);

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 