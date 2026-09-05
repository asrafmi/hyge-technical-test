import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PressableScale } from '@/shared/components/PressableScale';
import { colors, radius, shadows, spacing, typography } from '@/shared/constants/theme';
import { formatCurrency, formatDateHeading } from '@/shared/utils/format';
import type { BookingStatus, BookingSummary } from '@/services/api/types';

interface BookingCardProps {
  booking: BookingSummary;
  index?: number;
  onPress?: () => void;
}

const STATUS_STYLES: Record<BookingStatus, { label: string; color: string; background: string }> = {
  CONFIRMED: { label: 'Confirmed', color: colors.success, background: colors.successSoft },
  COMPLETED: { label: 'Completed', color: colors.textMuted, background: colors.surfaceAlt },
  CANCELLED: { label: 'Cancelled', color: colors.danger, background: colors.dangerSoft },
};

export function BookingCard({ booking, index = 0, onPress }: BookingCardProps) {
  const status = STATUS_STYLES[booking.status];

  return (
    <Animated.View entering={FadeInDown.delay(index * 70).springify().damping(16)}>
      <PressableScale style={[styles.card, shadows.card]} onPress={onPress ?? (() => {})} scaleTo={0.98}>
        <Image
          source={{ uri: booking.facility.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={250}
        />

        <View style={styles.body}>
          <View style={styles.headerRow}>
            <Text style={styles.facilityName} numberOfLines={1}>
              {booking.facility.name}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: status.background }]}>
              <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="grid-outline" size={13} color={colors.textMuted} />
            <Text style={styles.metaText}>{booking.court.name}</Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
            <Text style={styles.metaText}>
              {formatDateHeading(new Date(`${booking.date}T00:00:00`))} · {booking.startTime} - {booking.endTime}
            </Text>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.reference}>{booking.bookingReference}</Text>
            <Text style={styles.price}>{formatCurrency(booking.totalPrice)}</Text>
          </View>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  image: {
    width: 96,
    backgroundColor: colors.surfaceAlt,
  },
  body: {
    flex: 1,
    padding: spacing.md,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  facilityName: {
    ...typography.subheading,
    color: colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  statusLabel: {
    ...typography.tiny,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    ...typography.caption,
    color: colors.textMuted,
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  reference: {
    ...typography.tiny,
    color: colors.textFaint,
  },
  price: {
    ...typography.label,
    color: colors.primary,
  },
});
