import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingCard } from '@/features/bookings/components/BookingCard';
import { BookingCardSkeleton } from '@/features/bookings/components/BookingCardSkeleton';
import { BookingStatusTabs, type BookingTab } from '@/features/bookings/components/BookingStatusTabs';
import { useBookingsQuery } from '@/features/bookings/hooks/use-booking-query';
import { PressableScale } from '@/shared/components/PressableScale';
import { colors, radius, spacing, typography } from '@/shared/constants/theme';
import { getErrorMessage } from '@/shared/utils/error';

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<BookingTab>('UPCOMING');

  const { data, isLoading, isError, error, refetch, isRefetching } = useBookingsQuery({ status: tab });
  const bookings = data?.data ?? [];

  return (
    <View style={styles.container}>
      <FlatList
        data={isLoading ? [] : bookings}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isRefetching && !isLoading}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 110 }]}
        renderItem={({ item, index }) => (
          <BookingCard
            booking={item}
            index={index}
            onPress={() => router.push(`/(app)/bookings/${item.id}`)}
          />
        )}
        ListHeaderComponent={
          <Animated.View entering={FadeIn.duration(300)} style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
            <View style={styles.titleBlock}>
              <Text style={styles.title}>My bookings</Text>
              <Text style={styles.subtitle}>Everything you have booked, in one place.</Text>
            </View>
            <BookingStatusTabs selected={tab} onSelect={setTab} />
          </Animated.View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.skeletonList}>
              {[0, 1, 2].map((key) => (
                <BookingCardSkeleton key={key} />
              ))}
            </View>
          ) : (
            <EmptyOrError
              isError={isError}
              isPast={tab === 'PAST'}
              message={isError ? getErrorMessage(error) : undefined}
              onRetry={refetch}
            />
          )
        }
      />
    </View>
  );
}

function getEmptyTitle(isError: boolean, isPast: boolean): string {
  if (isError) return 'Something went wrong';
  return isPast ? 'No past bookings' : 'No bookings yet';
}

function EmptyOrError({
  isError,
  isPast,
  message,
  onRetry,
}: {
  isError: boolean;
  isPast: boolean;
  message?: string;
  onRetry: () => void;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name={isError ? 'cloud-offline-outline' : 'calendar-outline'}
          size={26}
          color={colors.primary}
        />
      </View>
      <Text style={styles.emptyTitle}>{getEmptyTitle(isError, isPast)}</Text>
      <Text style={styles.emptyMessage}>
        {message ??
          (isPast
            ? 'Bookings you have completed will show up here.'
            : 'Once you reserve a court it will show up here with all the details.')}
      </Text>
      {isError ? (
        <PressableScale style={styles.retry} onPress={onRetry}>
          <Text style={styles.retryLabel}>Try again</Text>
        </PressableScale>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  header: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  titleBlock: {
    gap: 2,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  skeletonList: {
    gap: spacing.md,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.xxl,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emptyTitle: {
    ...typography.heading,
    color: colors.text,
  },
  emptyMessage: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 260,
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
});
