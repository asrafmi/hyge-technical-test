import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/shared/components/PressableScale';
import { colors, radius, spacing, typography } from '@/shared/constants/theme';
import { formatCompactCurrency } from '@/shared/utils/format';
import type { AvailabilitySlot } from '@/services/api/types';

interface SlotGridProps {
  slots: AvailabilitySlot[];
  selectedStartTime: string | undefined;
  onSelect: (slot: AvailabilitySlot) => void;
}

export function SlotGrid({ slots, selectedStartTime, onSelect }: SlotGridProps) {
  return (
    <View style={styles.grid}>
      {slots.map((slot) => {
        const active = slot.startTime === selectedStartTime;
        const disabled = !slot.available;

        return (
          <PressableScale
            key={slot.startTime}
            disabled={disabled}
            onPress={() => onSelect(slot)}
            scaleTo={0.95}
            style={[
              styles.slot,
              active && styles.slotActive,
              disabled && styles.slotDisabled,
            ]}
          >
            <Text style={[styles.time, active && styles.timeActive, disabled && styles.timeDisabled]}>
              {slot.startTime}
            </Text>
            <Text style={[styles.price, active && styles.priceActive, disabled && styles.timeDisabled]}>
              {disabled ? 'Booked' : formatCompactCurrency(slot.price)}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  slot: {
    width: '31%',
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    gap: 2,
  },
  slotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  slotDisabled: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
  },
  time: {
    ...typography.label,
    color: colors.text,
  },
  timeActive: {
    color: colors.onPrimary,
  },
  timeDisabled: {
    color: colors.textFaint,
  },
  price: {
    ...typography.tiny,
    color: colors.primary,
  },
  priceActive: {
    color: colors.onPrimary,
  },
});
