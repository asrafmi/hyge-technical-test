import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/shared/components/BottomSheet';
import { Button } from '@/shared/components/Button';
import { colors, radius, spacing, typography } from '@/shared/constants/theme';
import { formatCurrency, formatDateHeading } from '@/shared/utils/format';

interface BookingConfirmSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submitting: boolean;
  errorMessage?: string;
  facilityName: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
}

export function BookingConfirmSheet({
  visible,
  onClose,
  onConfirm,
  submitting,
  errorMessage,
  facilityName,
  courtName,
  date,
  startTime,
  endTime,
  price,
}: BookingConfirmSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.title}>Confirm booking</Text>

      <View style={styles.summary}>
        <SummaryRow icon="business-outline" label={facilityName} />
        <SummaryRow icon="grid-outline" label={courtName} />
        <SummaryRow icon="calendar-outline" label={formatDateHeading(new Date(`${date}T00:00:00`))} />
        <SummaryRow icon="time-outline" label={`${startTime} - ${endTime}`} />
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Total</Text>
        <Text style={styles.priceValue}>{formatCurrency(price)}</Text>
      </View>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <Button
        label="Confirm booking"
        onPress={onConfirm}
        loading={submitting}
        style={styles.confirmButton}
      />
    </BottomSheet>
  );
}

function SummaryRow({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.summaryRow}>
      <Ionicons name={icon} size={16} color={colors.textMuted} />
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  summary: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  summaryLabel: {
    ...typography.bodyMedium,
    color: colors.text,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  priceLabel: {
    ...typography.subheading,
    color: colors.textMuted,
  },
  priceValue: {
    ...typography.title,
    color: colors.primary,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  confirmButton: {
    marginTop: spacing.sm,
  },
});
