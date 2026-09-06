import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingConfirmSheet } from '@/features/bookings/components/BookingConfirmSheet';
import { CourtSelector } from '@/features/bookings/components/CourtSelector';
import { DateStrip } from '@/features/bookings/components/DateStrip';
import { SlotGrid } from '@/features/bookings/components/SlotGrid';
import { useCreateBookingsBatchMutation } from '@/features/bookings/hooks/use-booking-mutation';
import {
  useFacilityAvailabilityQuery,
  useFacilityDetailQuery,
} from '@/features/facility/hooks/use-facility-query';
import { PressableScale } from '@/shared/components/PressableScale';
import { Skeleton } from '@/shared/components/Skeleton';
import { colors, radius, shadows, spacing, typography } from '@/shared/constants/theme';
import { getErrorMessage } from '@/shared/utils/error';
import { formatCompactCurrency, formatDateParam } from '@/shared/utils/format';
import type { AvailabilitySlot } from '@/services/api/types';

export default function BookFacilityScreen() {
  const { id, courtId } = useLocalSearchParams<{ id: string; courtId?: string }>();
  const insets = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState(() => formatDateParam(new Date()));
  const [selectedCourtId, setSelectedCourtId] = useState<string | undefined>(courtId);
  const [selectedSlots, setSelectedSlots] = useState<AvailabilitySlot[]>([]);
  const [sheetVisible, setSheetVisible] = useState(false);

  const { data: facility } = useFacilityDetailQuery(id);
  const {
    data: availability,
    isLoading,
    isError,
    error,
    refetch,
  } = useFacilityAvailabilityQuery(id, selectedDate);

  const [submitError, setSubmitError] = useState<string>();
  const createBookings = useCreateBookingsBatchMutation();

  const sportByCourtId = useMemo(() => {
    const map: Record<string, string> = {};
    facility?.courts.forEach((court) => {
      map[court.id] = court.sport;
    });
    return map;
  }, [facility]);

  const courts = availability?.courts ?? [];
  const activeCourtId = selectedCourtId ?? courts[0]?.id;
  const activeCourt = courts.find((court) => court.id === activeCourtId);

  const orderedSelectedSlots = useMemo(
    () => [...selectedSlots].sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [selectedSlots],
  );
  const totalPrice = orderedSelectedSlots.reduce((sum, slot) => sum + slot.price, 0);

  const handleSelectCourt = (courtId: string) => {
    setSelectedCourtId(courtId);
    setSelectedSlots([]);
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedSlots([]);
  };

  const handleToggleSlot = (slot: AvailabilitySlot) => {
    setSelectedSlots((prev) => {
      const exists = prev.some((item) => item.startTime === slot.startTime);
      if (exists) {
        return prev.filter((item) => item.startTime !== slot.startTime);
      }
      return [...prev, slot];
    });
  };

  const handleConfirm = () => {
    if (!activeCourt || orderedSelectedSlots.length === 0) return;
    setSubmitError(undefined);

    createBookings.mutate(
      {
        facilityId: id,
        payloads: orderedSelectedSlots.map((slot) => ({
          courtId: activeCourt.id,
          date: selectedDate,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
      },
      {
        onSuccess: (result) => {
          if (result.failed.length === 0) {
            setSheetVisible(false);
            router.replace('/(app)/(tabs)/bookings');
            return;
          }

          const bookedTimes = result.succeeded.map((slot) => slot.startTime).join(', ');
          const failedTimes = result.failed.map((item) => item.slot.startTime).join(', ');
          setSubmitError(
            result.succeeded.length > 0
              ? `Booked ${bookedTimes}. Failed to book ${failedTimes}: ${result.failed[0].message}`
              : `Failed to book ${failedTimes}: ${result.failed[0].message}`,
          );
          setSelectedSlots((prev) =>
            prev.filter((slot) => result.failed.some((item) => item.slot.startTime === slot.startTime)),
          );
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <PressableScale style={styles.backButton} onPress={() => router.back()} scaleTo={0.9}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </PressableScale>
        <Text style={styles.topTitle} numberOfLines={1}>
          {facility?.name ?? 'Book a court'}
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
      >
        <Animated.View entering={FadeIn.duration(250)} style={styles.section}>
          <Text style={styles.sectionTitle}>Select date</Text>
          <DateStrip selected={selectedDate} onSelect={handleSelectDate} />
        </Animated.View>

        {isLoading ? (
          <View style={styles.body}>
            <Skeleton width="100%" height={44} />
            <View style={styles.skeletonGrid}>
              {Array.from({ length: 9 }).map((_, index) => (
                <Skeleton key={index} width="31%" height={52} />
              ))}
            </View>
          </View>
        ) : isError ? (
          <View style={styles.errorState}>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorMessage}>{getErrorMessage(error)}</Text>
            <PressableScale style={styles.retry} onPress={() => refetch()}>
              <Text style={styles.retryLabel}>Try again</Text>
            </PressableScale>
          </View>
        ) : courts.length === 0 ? (
          <View style={styles.errorState}>
            <Text style={styles.errorTitle}>No courts available</Text>
            <Text style={styles.errorMessage}>Try a different date.</Text>
          </View>
        ) : (
          <>
            <Animated.View entering={FadeInDown.delay(60).duration(300)} style={styles.section}>
              <Text style={styles.sectionTitle}>Select court</Text>
              <CourtSelector
                courts={courts}
                sportByCourtId={sportByCourtId}
                selectedCourtId={activeCourtId}
                onSelect={handleSelectCourt}
              />
            </Animated.View>

            {activeCourt ? (
              <Animated.View
                key={activeCourt.id}
                entering={FadeInDown.delay(100).duration(300)}
                style={[styles.section, styles.body]}
              >
                <View style={styles.sectionTitleRow}>
                  <Text style={[styles.sectionTitle, styles.sectionTitleNoPadding]}>Select time</Text>
                  <Text style={styles.sectionHint}>
                    {selectedSlots.length > 0
                      ? `${selectedSlots.length} hour${selectedSlots.length > 1 ? 's' : ''} selected`
                      : 'Tap to select one or more hours'}
                  </Text>
                </View>
                <SlotGrid
                  slots={activeCourt.slots}
                  selectedSlots={selectedSlots}
                  onToggle={handleToggleSlot}
                />
              </Animated.View>
            ) : null}
          </>
        )}
      </ScrollView>

      <Animated.View
        entering={FadeIn.duration(250)}
        style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}
      >
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceLabel}>
            {selectedSlots.length > 0
              ? `${selectedSlots.length} hour${selectedSlots.length > 1 ? 's' : ''}`
              : 'price'}
          </Text>
          <Text style={styles.footerPriceValue}>
            {selectedSlots.length > 0 ? formatCompactCurrency(totalPrice) : '-'}
          </Text>
        </View>
        <PressableScale
          style={[
            styles.bookButton,
            (selectedSlots.length === 0 || createBookings.isPending) && styles.bookButtonDisabled,
          ]}
          disabled={selectedSlots.length === 0 || createBookings.isPending}
          haptic="medium"
          onPress={() => setSheetVisible(true)}
        >
          <Text style={styles.bookButtonLabel}>Book now</Text>
        </PressableScale>
      </Animated.View>

      {activeCourt && orderedSelectedSlots.length > 0 && facility ? (
        <BookingConfirmSheet
          visible={sheetVisible}
          onClose={() => setSheetVisible(false)}
          onConfirm={handleConfirm}
          submitting={createBookings.isPending}
          errorMessage={submitError}
          facilityName={facility.name}
          courtName={activeCourt.name}
          date={selectedDate}
          slots={orderedSelectedSlots}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    ...typography.subheading,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  section: {
    gap: spacing.sm,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
    paddingHorizontal: spacing.xl,
  },
  sectionTitleNoPadding: {
    paddingHorizontal: 0,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  sectionHint: {
    ...typography.tiny,
    color: colors.textFaint,
  },
  body: {
    paddingHorizontal: spacing.xl,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
  },
  errorState: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
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
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerPrice: {
    gap: 1,
  },
  footerPriceLabel: {
    ...typography.tiny,
    color: colors.textFaint,
    textTransform: 'uppercase',
  },
  footerPriceValue: {
    ...typography.heading,
    color: colors.text,
  },
  bookButton: {
    flex: 1,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primary,
  },
  bookButtonDisabled: {
    opacity: 0.45,
  },
  bookButtonLabel: {
    ...typography.subheading,
    color: colors.onPrimary,
  },
});
