import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, motion, radius, shadows, spacing, typography } from '@/shared/constants/theme';

const ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  home: { active: 'compass', inactive: 'compass-outline' },
  bookings: { active: 'calendar', inactive: 'calendar-outline' },
};

interface TabBarRoute {
  key: string;
  name: string;
}

interface FloatingTabBarProps {
  state: { index: number; routes: TabBarRoute[] };
  descriptors: Record<string, { options: { title?: string } }>;
  navigation: {
    emit: (event: { type: 'tabPress'; target: string; canPreventDefault: true }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
}

export function FloatingTabBar({ state, descriptors, navigation }: FloatingTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, spacing.md) }]} pointerEvents="box-none">
      <View style={[styles.bar, shadows.floating]}>
        {state.routes.map((route, index) => {
          const options = descriptors[route.key]?.options;
          const label = options?.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem key={route.key} name={route.name} label={label} focused={isFocused} onPress={onPress} />
          );
        })}
      </View>
    </View>
  );
}

function TabItem({
  name,
  label,
  focused,
  onPress,
}: {
  name: string;
  label: string;
  focused: boolean;
  onPress: () => void;
}) {
  const progress = useDerivedValue(() => withSpring(focused ? 1 : 0, motion.springSoft), [focused]);

  const pillStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], ['rgba(26,104,254,0)', colors.primary]),
    paddingHorizontal: spacing.md + progress.value * spacing.xs,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + progress.value * 0.1 }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: withTiming(focused ? 1 : 0, { duration: motion.duration.fast }),
    maxWidth: withTiming(focused ? 80 : 0, { duration: motion.duration.base }),
    marginLeft: withTiming(focused ? spacing.xs : 0, { duration: motion.duration.base }),
  }));

  const icons = ICONS[name] ?? { active: 'ellipse', inactive: 'ellipse-outline' };

  return (
    <Pressable onPress={onPress} hitSlop={6}>
      <Animated.View style={[styles.pill, pillStyle]}>
        <Animated.View style={iconStyle}>
          <Ionicons
            name={focused ? icons.active : icons.inactive}
            size={22}
            color={focused ? colors.onPrimary : colors.textMuted}
          />
        </Animated.View>
        <Animated.View style={[styles.labelWrapper, labelStyle]}>
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    backgroundColor: colors.background,
    borderRadius: radius.xxl,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: radius.lg,
    justifyContent: 'center',
  },
  labelWrapper: {
    overflow: 'hidden',
  },
  label: {
    ...typography.label,
    color: colors.onPrimary,
  },
});
