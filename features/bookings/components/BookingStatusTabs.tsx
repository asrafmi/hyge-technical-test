import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

import { PressableScale } from '@/shared/components/PressableScale';
import { colors, motion, radius, spacing, typography } from '@/shared/constants/theme';

export type BookingTab = 'UPCOMING' | 'PAST';

const TABS: { value: BookingTab; label: string }[] = [
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'PAST', label: 'Past' },
];

interface BookingStatusTabsProps {
  selected: BookingTab;
  onSelect: (tab: BookingTab) => void;
}

export function BookingStatusTabs({ selected, onSelect }: BookingStatusTabsProps) {
  return (
    <View style={styles.row}>
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          label={tab.label}
          active={tab.value === selected}
          onPress={() => onSelect(tab.value)}
        />
      ))}
    </View>
  );
}

function Tab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const progress = useDerivedValue(
    () => withTiming(active ? 1 : 0, { duration: motion.duration.fast }),
    [active],
  );

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.surfaceAlt, colors.primary]),
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [colors.textMuted, colors.onPrimary]),
  }));

  return (
    <PressableScale onPress={onPress} scaleTo={0.97} style={styles.tabWrapper} haptic="light">
      <Animated.View style={[styles.tab, containerStyle]}>
        <Animated.Text style={[styles.tabLabel, textStyle]}>{label}</Animated.Text>
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  tabWrapper: {
    flex: 1,
  },
  tab: {
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  tabLabel: {
    ...typography.label,
  },
});
