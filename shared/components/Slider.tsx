import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { colors, radius } from '@/shared/constants/theme';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}

const THUMB_SIZE = 24;

export function Slider({ min, max, step = 1, value, onChange }: SliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const startX = useSharedValue(0);
  const translateX = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const usableWidth = Math.max(trackWidth - THUMB_SIZE, 1);

  useEffect(() => {
    if (isDragging.value) return;
    const ratio = max > min ? (value - min) / (max - min) : 0;
    translateX.value = ratio * usableWidth;
  }, [value, min, max, usableWidth, translateX, isDragging]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  }, []);

  const commitValue = useCallback(
    (x: number) => {
      const width = Math.max(trackWidth - THUMB_SIZE, 1);
      const nextRatio = Math.min(Math.max(x / width, 0), 1);
      const rawValue = min + nextRatio * (max - min);
      const stepped = Math.round(rawValue / step) * step;
      onChange(Math.min(Math.max(stepped, min), max));
    },
    [trackWidth, min, max, step, onChange],
  );

  const pan = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      startX.value = translateX.value;
    })
    .onChange((event) => {
      const next = Math.min(Math.max(startX.value + event.translationX, 0), usableWidth);
      translateX.value = next;
    })
    .onEnd(() => {
      isDragging.value = false;
      runOnJS(commitValue)(translateX.value);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: translateX.value + THUMB_SIZE / 2,
  }));

  return (
    <View style={styles.track} onLayout={handleLayout}>
      <View style={styles.trackBackground} />
      <Animated.View style={[styles.trackFill, fillStyle]} />
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: THUMB_SIZE,
    justifyContent: 'center',
  },
  trackBackground: {
    position: 'absolute',
    left: THUMB_SIZE / 2,
    right: THUMB_SIZE / 2,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.secondary,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
