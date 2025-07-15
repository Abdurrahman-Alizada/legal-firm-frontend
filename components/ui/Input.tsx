import { colors, fonts, layout, spacing } from '@/constants';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextToggle?: boolean; // if it's a password field
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  secureTextToggle,
  secureTextEntry,
  ...rest
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          error && { borderColor: 'red' },
        ]}
      >
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}

        <TextInput
          {...rest}
          style={[styles.input, inputStyle]}
          secureTextEntry={secureTextToggle ? isSecure : false}
          placeholderTextColor="#999"
        />

        {secureTextToggle && (
          <TouchableOpacity style={{alignSelf:'center'}} onPress={() => setIsSecure(!isSecure)}>
            <MaterialIcons
              name={isSecure ? 'visibility-off' : 'visibility'}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
        )}

        {!secureTextToggle && rightIcon && (
          <View style={styles.icon}>{rightIcon}</View>
        )}
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
  },
  inputContainer: {
    borderWidth: 1,
    height:40,
    flexDirection:'row',
    borderColor: colors.border.medium,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: spacing.sm,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
  },
  input: {
    flex: 1,
    fontSize: fonts.sizes.sm,
    color: '#000',
  },
  icon: {
    marginHorizontal: 4,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: 'red',
  },
});
