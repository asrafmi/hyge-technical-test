import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCancelBookingMutation } from '@/features/bookings/hooks/use-booking-mutation';
import { useBookingDetailQuery } from '@/features/bookings/hooks/use-booking-query';
import { BottomSheet } from '@/shared/components/BottomSheet';
import { Button } from '@/shared/components/Button';
import { PressableScale } from '@/shared/components/PressableScale';
import { Skeleton } from '@/shared/components/Skeleton';
import { colors, radius, shadows, spacing, typography } from '@/shared/constants/theme';
import { getErrorMessage } from '@/shared/utils/error';
import { formatCurrency, formatDateHeading } from '@/shared/utils/format';
import type { BookingStatus } from '@/services/api/types';

const STATUS_STYLES: Record<BookingStatus, { label: string; color: string; background: string }> = {
  CONFIRMED: { label: 'Confirmed', color: colors.success, background: colors.successSoft },
  COMPLETED: { label: 'Completed', color: colors.textMuted, background: colors.surfaceAlt },
  CANCELLED: { label: 'Cancelled', color: colors.danger, background: colors.dangerSoft },
};

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [cancelSheetVisible, setCancelSheetVisible] = useState(false);

  const { data: booking, isLoading, isError, error, refetch } = useBookingDetailQuery(id);
  const cancelBooking = useCancelBookingMutation();

  const handleCancel = () => {
    cancelBooking.mutate(id, {
      onSuccess: () => setCancelSheetVisible(false),
    });
  };

  return (
    <View style={styles.container}>
      <PressableScale
        style={[styles.backButton, { top: insets.top + spacing.sm }, shadows.card]}
        onPress={() => router.back()}
        scaleTo={0.9}
      >
        <Ionicons name="chevron-back" size={22} color={colors.text} />
      </PressableScale>

      {isLoading ? (
        <BookingDetailSkeleton />
      ) : isError || !booking ? (
        <View style={styles.errorState}>
          <View style={styles.errorIcon}>
            <Ionicons name="cloud-offline-outline" size={26} color={colors.primary} />
          </View>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{getErrorMessage(error)}</Text>
          <PressableScale style={styles.retry} onPress={() => refetch()}>
            <Text style={styles.retryLabel}>Try again</Text>
          </PressableScale>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: insets.bottom + (booking.status === 'CONFIRMED' ? 120 : spacing.xl),
            }}
          >
            <View style={styles.imageWrapper}>
              <LinearGradient
                colors={[colors.primarySoft, colors.primaryMuted]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.imageFallback}
              >
                <Ionicons name="calendar" size={48} color={colors.background} />
              </LinearGradient>
              <Image
                source={{ uri: booking.facility.imageUrl }}
                style={styles.image}
                contentFit="cover"
                transition={250}
              />
              <LinearGradient
                colors={['transparent', 'rgba(47,48,51,0.45)']}
                locations={[0.6, 1]}
                style={StyleSheet.absoluteFill}
              />
            </View>

            <Animated.View entering={FadeInDown.duration(300)} style={styles.body}>
              <View style={styles.headline}>
                <View style={styles.headlineRow}>
                  <Text style={styles.name}>{booking.facility.name}</Text>
                  <StatusBadge status={booking.status} />
                </View>
                <Text style={styles.reference}>{booking.bookingReference}</Text>
              </View>

              <View style={styles.infoCard}>
                <InfoRow icon="grid-outline" label="Court" value={booking.court.name} />
                <InfoRow
                  icon="calendar-outline"
                  label="Date"
                  value={formatDateHeading(new Date(`${booking.date}T00:00:00`))}
                />
                <InfoRow icon="time-outline" label="Time" value={`${booking.startTime} - ${booking.endTime}`} />
              </View>

              <View style={styles.priceCard}>
                <PriceRow label="Court price" value={booking.price} />
                <PriceRow label="Service fee" value={booking.serviceFee} />
                <View style={styles.priceDivider} />
                <PriceRow label="Total" value={booking.totalPrice} emphasized />
              </View>
            </Animated.View>
          </ScrollView>

          {booking.status === 'CONFIRMED' ? (
            <Animated.View
              entering={FadeIn.duration(250)}
              style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}
            >
              <Button
                label="Cancel booking"
                variant="danger"
                onPress={() => setCancelSheetVisible(true)}
                style={styles.cancelButton}
              />
            </Animated.View>
          ) : null}

          <BottomSheet visible={cancelSheetVisible} onClose={() => setCancelSheetVisible(false)}>
            <Text style={styles.sheetTitle}>Cancel this booking?</Text>
            <Text style={styles.sheetMessage}>
              {booking.facility.name} · {formatDateHeading(new Date(`${booking.date}T00:00:00`))} ·{' '}
              {booking.startTime} - {booking.endTime}. This cannot be undone.
            </Text>
            {cancelBooking.isError ? (
              <Text style={styles.sheetError}>{getErrorMessage(cancelBooking.error)}</Text>
            ) : null}
            <View style={styles.sheetActions}>
              <Button
                label="Keep booking"
                variant="secondary"
                onPress={() => setCancelSheetVisible(false)}
                style={styles.sheetActionButton}
              />
              <Button
                label="Cancel booking"
                variant="danger"
                onPress={handleCancel}
                loading={cancelBooking.isPending}
                style={styles.sheetActionButton}
              />
            </View>
          </BottomSheet>
        </>
      )}
    </View>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <View style={[styles.statusBadge, { backgroundColor: style.background }]}>
      <Text style={[styles.statusLabel, { color: style.color }]}>{style.label}</Text>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.infoTextBlock}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function PriceRow({ label, value, emphasized }: { label: string; value: number; emphasized?: boolean }) {
  return (
    <View style={styles.priceRow}>
      <Text style={[styles.priceLabel, emphasized && styles.priceLabelEmphasized]}>{label}</Text>
      <Text style={[styles.priceValue, emphasized && styles.priceValueEmphasized]}>
        {formatCurrency(value)}
      </Text>
    </View>
  );
}

function BookingDetailSkeleton() {
  return (
    <View style={{ flex: 1 }}>
      <Skeleton height={280} borderRadius={0} />
      <View style={styles.skeletonBody}>
        <Skeleton width="70%" height={22} />
        <Skeleton width="45%" height={14} />
        <Skeleton width="100%" height={110} />
        <Skeleton width="100%" height={110} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    position: 'absolute',
    left: spacing.xl,
    zIndex: 10,
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    height: 280,
    backgroundColor: colors.surfaceAlt,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  headline: {
    gap: spacing.xxs,
  },
  headlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    ...typography.title,
    color: colors.text,
    flex: 1,
  },
  reference: {
    ...typography.caption,
    color: colors.textFaint,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.xs,
  },
  statusLabel: {
    ...typography.label,
  },
  infoCard: {
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.xs,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextBlock: {
    gap: 1,
  },
  infoLabel: {
    ...typography.tiny,
    color: colors.textFaint,
    textTransform: 'uppercase',
  },
  infoValue: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  priceCard: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    ...typography.body,
    color: colors.textMuted,
  },
  priceLabelEmphasized: {
    ...typography.subheading,
    color: colors.text,
  },
  priceValue: {
    ...typography.body,
    color: colors.text,
  },
  priceValueEmphasized: {
    ...typography.title,
    color: colors.primary,
  },
  priceDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xxs,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    width: '100%',
  },
  sheetTitle: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sheetMessage: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  sheetError: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sheetActionButton: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
  },
  errorIcon: {
    width: 60,
    height: 60,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  errorTitle: {
    ...typography.heading,
    color: colors.text,
  },
  errorMessage: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  retry: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },
  retryLabel: {
    ...typography.label,
    color: colors.primary,
  },
  skeletonBody: {
    gap: spacing.md,
    padding: spacing.xl,
  },
});
