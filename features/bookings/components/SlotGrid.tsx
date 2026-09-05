import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/shared/components/PressableScale';
import { colors, radius, spacing, typography } from '@/shared/constants/theme';
import { formatCompactCurrency } from '@/shared/utils/format';
import type { AvailabilitySlot } from '@/services/api/types';

interface SlotGridProps {
  slots: AvailabilitySlot[];
  selectedSlots: AvailabilitySlot[];
  onToggle: (slot: AvailabilitySlot) => void;
}

export function SlotGrid({ slots, selectedSlots, onToggle }: SlotGridProps) {
  return (
    <View style={styles.grid}>
      {slots.map((slot) => {
        const active = selectedSlots.some((item) => item.startTime === slot.startTime);
        const disabled = !slot.available;

        return (
          <PressableScale
            key={slot.startTime}
            disabled={disabled}
            onPress={() => onToggle(slot)}
            scaleTo={0.95}
            style={[
              styles.slot,
              active && styles.slotActive,
              disabled && styles.slotDisabled,
            ]}
          >
            <View style={styles.checkbox}>
              {active ? <Ionicons name="checkmark" size={12} color={colors.onPrimary} /> : null}
            </View>
            <Text style={[styles.time, active && styles.timeActive, disabled && styles.timeDisabled]}>
              {slot.startTime}
            </Text>
            <Text style={[styles.price, active && styles.priceActive, disabled && styles.timeDisabled]}>
              {!slot.available ? 'Booked' : formatCompactCurrency(slot.price)}
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
  checkbox: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
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
