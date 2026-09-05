import { ScrollView, StyleSheet, Text } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

import { PressableScale } from '@/shared/components/PressableScale';
import { SportIcon } from '@/shared/components/SportIcon';
import { colors, motion, radius, spacing, typography } from '@/shared/constants/theme';

interface FilterChipsProps {
  options: { value: string; label: string }[];
  selected?: string;
  onSelect: (value: string | undefined) => void;
  allLabel?: string;
}

export function FilterChips({ options, selected, onSelect, allLabel = 'All' }: FilterChipsProps) {
  const items = [{ value: '__all__', label: allLabel }, ...options];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      keyboardShouldPersistTaps="handled"
    >
      {items.map((item) => {
        const isAll = item.value === '__all__';
        const active = isAll ? !selected : selected === item.value;

        return (
          <Chip
            key={item.value}
            label={item.label}
            sport={isAll ? undefined : item.value}
            active={active}
            onPress={() => onSelect(isAll || active ? undefined : item.value)}
          />
        );
      })}
    </ScrollView>
  );
}

function Chip({
  label,
  sport,
  active,
  onPress,
}: {
  label: string;
  sport?: string;
  active: boolean;
  onPress: () => void;
}) {
  const progress = useDerivedValue(
    () => withTiming(active ? 1 : 0, { duration: motion.duration.fast }),
    [active],
  );

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.surfaceAlt, colors.primary]),
    borderColor: interpolateColor(progress.value, [0, 1], [colors.border, colors.primary]),
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [colors.textMuted, colors.onPrimary]),
  }));

  return (
    <PressableScale onPress={onPress} scaleTo={0.94}>
      <Animated.View style={[styles.chip, containerStyle]}>
        {sport ? <SportIcon sport={sport} size={14} color={active ? colors.onPrimary : colors.textMuted} /> : null}
        <Animated.Text style={[styles.chipLabel, textStyle]}>{label}</Animated.Text>
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  chipLabel: {
    ...typography.label,
    textTransform: 'capitalize',
  },
});
