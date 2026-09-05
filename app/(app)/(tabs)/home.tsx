import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FacilityCard } from '@/features/facility/components/FacilityCard';
import { FacilityCardSkeleton } from '@/features/facility/components/FacilityCardSkeleton';
import { FilterChips } from '@/features/facility/components/FilterChips';
import { FilterSheet, type FacilityFilters } from '@/features/facility/components/FilterSheet';
import {
  useAllFacilitiesQuery,
  useCitiesQuery,
  useFacilitiesQuery,
  useSportsQuery,
} from '@/features/facility/hooks/use-facility-query';
import { PressableScale } from '@/shared/components/PressableScale';
import { colors, radius, shadows, spacing, typography } from '@/shared/constants/theme';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { getErrorMessage } from '@/shared/utils/error';
import { useAuthStore } from '@/store/auth-store';

const PRICE_RANGE = { min: 0, max: 200_000, step: 10_000 };

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FacilityFilters>({
    sport: undefined,
    city: undefined,
    maxPrice: PRICE_RANGE.max,
  });
  const [sheetVisible, setSheetVisible] = useState(false);
  const debouncedSearch = useDebouncedValue(search);

  const { data: sportsData } = useSportsQuery();
  const { data: citiesData } = useCitiesQuery();
  const { data: allFacilitiesData } = useAllFacilitiesQuery();
  const { data, isLoading, isError, error, refetch, isRefetching } = useFacilitiesQuery({
    search: debouncedSearch || undefined,
    sport: filters.sport,
    city: filters.city,
  });

  const allFacilities = data?.data ?? [];
  const facilities = useMemo(
    () => allFacilities.filter((item) => item.startingPrice <= filters.maxPrice),
    [allFacilities, filters.maxPrice],
  );
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const sportOptions = (sportsData?.data ?? []).map((item) => ({ value: item.slug, label: item.name }));
  const cityOptions = (citiesData?.data ?? []).map((item) => ({ value: item, label: item }));
  const isFilterActive = Boolean(filters.sport) || Boolean(filters.city) || filters.maxPrice < PRICE_RANGE.max;

  return (
    <View style={styles.container}>
      <FlatList
        data={isLoading ? [] : facilities}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isRefetching && !isLoading}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 110 }]}
        renderItem={({ item, index }) => <FacilityCard facility={item} index={index} />}
        ListHeaderComponent={
          <Animated.View entering={FadeIn.duration(300)} style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
            <View style={styles.greetingRow}>
              <View style={styles.greeting}>
                <Text style={styles.greetingLabel}>Hello, {firstName}</Text>
                <Text style={styles.greetingTitle}>Find your court</Text>
              </View>

              <PressableScale onPress={() => router.push('/(app)/profile')} scaleTo={0.9}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
                </View>
              </PressableScale>
            </View>

            <View style={styles.searchRow}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={19} color={colors.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search facilities or areas"
                  placeholderTextColor={colors.textFaint}
                  value={search}
                  onChangeText={setSearch}
                  returnKeyType="search"
                />
                {search.length > 0 ? (
                  <PressableScale onPress={() => setSearch('')} scaleTo={0.85} haptic="none">
                    <Ionicons name="close-circle" size={19} color={colors.textFaint} />
                  </PressableScale>
                ) : null}
              </View>

              <PressableScale
                style={[styles.filterButton, shadows.primary]}
                onPress={() => setSheetVisible(true)}
                haptic="medium"
              >
                <Ionicons name="options-outline" size={20} color={colors.onPrimary} />
                {isFilterActive ? <View style={styles.filterDot} /> : null}
              </PressableScale>
            </View>

            <FilterChips
              options={sportOptions}
              selected={filters.sport}
              onSelect={(sport) => setFilters((prev) => ({ ...prev, sport }))}
              allLabel="All sports"
            />
          </Animated.View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.skeletonList}>
              {[0, 1, 2].map((key) => (
                <FacilityCardSkeleton key={key} />
              ))}
            </View>
          ) : (
            <EmptyOrError
              isError={isError}
              message={isError ? getErrorMessage(error) : undefined}
              onRetry={refetch}
            />
          )
        }
      />

      <FilterSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        sports={sportOptions}
        cities={cityOptions}
        priceRange={PRICE_RANGE}
        filters={filters}
        onApply={setFilters}
        allFacilities={allFacilitiesData?.data ?? []}
      />
    </View>
  );
}

function EmptyOrError({
  isError,
  message,
  onRetry,
}: {
  isError: boolean;
  message?: string;
  onRetry: () => void;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name={isError ? 'cloud-offline-outline' : 'search-outline'}
          size={26}
          color={colors.primary}
        />
      </View>
      <Text style={styles.emptyTitle}>{isError ? 'Something went wrong' : 'No venues found'}</Text>
      <Text style={styles.emptyMessage}>
        {message ?? 'Try a different search or clear your filters.'}
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
    paddingBottom: spacing.xs,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    gap: 2,
  },
  greetingLabel: {
    ...typography.bodyMedium,
    color: colors.textMuted,
  },
  greetingTitle: {
    ...typography.title,
    color: colors.text,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.subheading,
    color: colors.primary,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 52,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
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
