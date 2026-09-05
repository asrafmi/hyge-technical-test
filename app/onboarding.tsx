import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  Extrapolation,
  FadeIn,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/shared/components/PressableScale';
import { colors, radius, shadows, spacing, typography } from '@/shared/constants/theme';
import { useOnboardingStore } from '@/store/onboarding-store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Slide {
  key: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
}

const SLIDES: Slide[] = [
  {
    key: 'discover',
    title: 'Find courts',
    highlight: 'near you',
    description: 'Browse padel, tennis, badminton and basketball venues around the city in seconds.',
    image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=900&q=80',
  },
  {
    key: 'book',
    title: 'Book a slot',
    highlight: 'in two taps',
    description: 'See live availability by the hour and lock in the time that fits your schedule.',
    image: 'https://images.unsplash.com/photo-1530915365347-e35b749a0381?w=900&q=80',
  },
  {
    key: 'play',
    title: 'Just show up',
    highlight: 'and play',
    description: 'Every booking lives in one place, with instant confirmation and easy cancellation.',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&q=80',
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const complete = useOnboardingStore((state) => state.complete);
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const finish = async () => {
    await complete();
    router.replace('/(auth)/login');
  };

  const handleNext = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      finish();
    }
  };

  const onMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH));
  };

  const isLast = index === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        onMomentumScrollEnd={onMomentumEnd}
        scrollEventThrottle={16}
        renderItem={({ item, index: slideIndex }) => (
          <SlideItem slide={item} index={slideIndex} scrollX={scrollX} />
        )}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.dots}>
          {SLIDES.map((slide, dotIndex) => (
            <Dot key={slide.key} index={dotIndex} scrollX={scrollX} />
          ))}
        </View>

        <View style={styles.actions}>
          {!isLast ? (
            <PressableScale style={styles.skip} onPress={finish} haptic="light">
              <Text style={styles.skipLabel}>Skip</Text>
            </PressableScale>
          ) : (
            <View style={styles.skip} />
          )}

          <PressableScale style={[styles.next, shadows.primary]} onPress={handleNext} haptic="medium">
            <Animated.Text key={isLast ? 'start' : 'next'} entering={FadeIn.duration(200)} style={styles.nextLabel}>
              {isLast ? 'Get started' : 'Next'}
            </Animated.Text>
            <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
          </PressableScale>
        </View>
      </View>

      <View style={[styles.topBar, { top: insets.top + spacing.md }]}>
        <View style={styles.brand}>
          <Image
            source={require('@/assets/courtly-logo.jpeg')}
            style={styles.brandMark}
            contentFit="contain"
          />
          <Text style={styles.brandName}>Courtly</Text>
        </View>
      </View>
    </View>
  );
}

function SlideItem({
  slide,
  index,
  scrollX,
}: {
  slide: Slide;
  index: number;
  scrollX: SharedValue<number>;
}) {
  const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(scrollX.value, inputRange, [-60, 0, 60], Extrapolation.CLAMP) },
      { scale: interpolate(scrollX.value, inputRange, [1.15, 1, 1.15], Extrapolation.CLAMP) },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(scrollX.value, inputRange, [40, 0, 40], Extrapolation.CLAMP) },
    ],
  }));

  return (
    <View style={styles.slide}>
      <View style={styles.imageWrapper}>
        <Animated.View style={[StyleSheet.absoluteFill, imageStyle]}>
          <Image source={{ uri: slide.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
        </Animated.View>
        <LinearGradient
          colors={['transparent', 'rgba(47,48,51,0.15)', colors.background]}
          locations={[0, 0.55, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <Animated.View style={[styles.copy, textStyle]}>
        <Text style={styles.title}>
          {slide.title} <Text style={styles.titleHighlight}>{slide.highlight}</Text>
        </Text>
        <Text style={styles.description}>{slide.description}</Text>
      </Animated.View>
    </View>
  );
}

function Dot({ index, scrollX }: { index: number; scrollX: SharedValue<number> }) {
  const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];

  const style = useAnimatedStyle(() => ({
    width: interpolate(scrollX.value, inputRange, [8, 28, 8], Extrapolation.CLAMP),
    opacity: interpolate(scrollX.value, inputRange, [0.25, 1, 0.25], Extrapolation.CLAMP),
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  brandMark: {
    width: 30,
    height: 30,
    borderRadius: radius.xs,
    backgroundColor: colors.background,
  },
  brandName: {
    ...typography.subheading,
    color: colors.background,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  imageWrapper: {
    height: '66%',
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  copy: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    gap: spacing.sm,
  },
  title: {
    ...typography.display,
    color: colors.text,
  },
  titleHighlight: {
    color: colors.primary,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    maxWidth: 320,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.xxs,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skip: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    minWidth: 72,
  },
  skipLabel: {
    ...typography.subheading,
    color: colors.textMuted,
  },
  next: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  nextLabel: {
    ...typography.subheading,
    color: colors.onPrimary,
  },
});
