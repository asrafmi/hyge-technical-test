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
import { useCreateBookingMutation } from '@/features/bookings/hooks/use-booking-mutation';
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
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState(() => formatDateParam(new Date()));
  const [selectedCourtId, setSelectedCourtId] = useState<string>();
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot>();
  const [sheetVisible, setSheetVisible] = useState(false);

  const { data: facility } = useFacilityDetailQuery(id);
  const {
    data: availability,
    isLoading,
    isError,
    error,
    refetch,
  } = useFacilityAvailabilityQuery(id, selectedDate);

  const createBooking = useCreateBookingMutation();

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

  const handleSelectCourt = (courtId: string) => {
    setSelectedCourtId(courtId);
    setSelectedSlot(undefined);
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(undefined);
  };

  const handleSelectSlot = (slot: AvailabilitySlot) => {
    setSelectedSlot(slot);
  };

  const handleConfirm = () => {
    if (!activeCourt || !selectedSlot) return;

    createBooking.mutate(
      {
        courtId: activeCourt.id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      },
      {
        onSuccess: () => {
          setSheetVisible(false);
          router.replace('/(app)/(tabs)/bookings');
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
                <Text style={styles.sectionTitle}>Select time</Text>
                <SlotGrid
                  slots={activeCourt.slots}
                  selectedStartTime={selectedSlot?.startTime}
                  onSelect={handleSelectSlot}
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
          <Text style={styles.footerPriceLabel}>{selectedSlot ? selectedSlot.startTime : 'price'}</Text>
          <Text style={styles.footerPriceValue}>
            {selectedSlot ? formatCompactCurrency(selectedSlot.price) : '-'}
          </Text>
        </View>
        <PressableScale
          style={[
            styles.bookButton,
            (!selectedSlot || createBooking.isPending) && styles.bookButtonDisabled,
          ]}
          disabled={!selectedSlot || createBooking.isPending}
          haptic="medium"
          onPress={() => setSheetVisible(true)}
        >
          <Text style={styles.bookButtonLabel}>Book now</Text>
        </PressableScale>
      </Animated.View>

      {activeCourt && selectedSlot && facility ? (
        <BookingConfirmSheet
          visible={sheetVisible}
          onClose={() => setSheetVisible(false)}
          onConfirm={handleConfirm}
          submitting={createBooking.isPending}
          errorMessage={createBooking.isError ? getErrorMessage(createBooking.error) : undefined}
          facilityName={facility.name}
          courtName={activeCourt.name}
          date={selectedDate}
          startTime={selectedSlot.startTime}
          endTime={selectedSlot.endTime}
          price={selectedSlot.price}
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
