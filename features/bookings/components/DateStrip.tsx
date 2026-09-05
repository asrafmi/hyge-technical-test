import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/shared/components/PressableScale';
import { colors, radius, spacing, typography } from '@/shared/constants/theme';
import { formatDateParam, formatDayLabel } from '@/shared/utils/format';

interface DateStripProps {
  selected: string;
  onSelect: (date: string) => void;
  days?: number;
}

export function DateStrip({ selected, onSelect, days = 14 }: DateStripProps) {
  const today = new Date();
  const dates = Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return date;
  });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {dates.map((date) => {
        const value = formatDateParam(date);
        const active = value === selected;

        return (
          <PressableScale key={value} onPress={() => onSelect(value)} scaleTo={0.94}>
            <View style={[styles.item, active && styles.itemActive]}>
              <Text style={[styles.day, active && styles.dayActive]}>{formatDayLabel(date)}</Text>
              <Text style={[styles.date, active && styles.dateActive]}>{date.getDate()}</Text>
            </View>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
  },
  item: {
    width: 52,
    height: 64,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  itemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  day: {
    ...typography.tiny,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  dayActive: {
    color: colors.onPrimary,
  },
  date: {
    ...typography.subheading,
    color: colors.text,
  },
  dateActive: {
    color: colors.onPrimary,
  },
});
