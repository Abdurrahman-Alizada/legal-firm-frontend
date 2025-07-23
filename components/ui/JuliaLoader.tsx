import { colors } from '@/constants';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export const JuliaLoader = () => {
  const rotate = useSharedValue(0);
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    rotate.value = withRepeat(
      withTiming(360, {
        duration: 2500,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    pulse.value = withRepeat(
      withTiming(1.5, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const rotatingStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const pulsingStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: pulse.value },
    ],
    opacity: pulse.value < 1.2 ? 0.8 : 1,
  }));

  return (
    <View style={styles.container}>
        <Animated.View style={[styles.innerCircle, pulsingStyle]} />
    </View>
  );
};

const SIZE = 30;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingBottom:10
  },
  outerCircle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 3,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  innerCircle: {
    width: SIZE / 2,
    height: SIZE / 2,
    borderRadius: SIZE / 4,
    backgroundColor: colors.primary,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -4,
    marginTop: -4,
  },
});