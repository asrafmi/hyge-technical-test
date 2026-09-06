import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FacilityDetailSkeleton } from '@/features/facility/components/FacilityDetailSkeleton';
import { useFacilityDetailQuery } from '@/features/facility/hooks/use-facility-query';
import { Button } from '@/shared/components/Button';
import { PressableScale } from '@/shared/components/PressableScale';
import { SportIcon } from '@/shared/components/SportIcon';
import { colors, radius, shadows, spacing, typography } from '@/shared/constants/theme';
import { formatCurrency } from '@/shared/utils/format';
import { getErrorMessage } from '@/shared/utils/error';
import { getAmenityIcon } from '@/shared/utils/facility-icons';
import type { FacilityCourtSummary } from '@/services/api/types';

export default function FacilityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { data: facility, isLoading, isError, error, refetch } = useFacilityDetailQuery(id);
  const [selectedCourtId, setSelectedCourtId] = useState<string>();

  const startingPrice = facility?.courts.length
    ? Math.min(...facility.courts.map((court) => court.basePrice))
    : undefined;
  const selectedCourt = facility?.courts.find((court) => court.id === selectedCourtId);
  const footerPrice = selectedCourt?.basePrice ?? startingPrice;
  const footerPriceLabel = footerPrice !== undefined ? formatCurrency(footerPrice) : '-';

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
        <FacilityDetailSkeleton />
      ) : isError || !facility ? (
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
            contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
          >
            <View style={styles.imageWrapper}>
              <LinearGradient
                colors={[colors.primarySoft, colors.primaryMuted]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.imageFallback}
              >
                <Ionicons name="tennisball" size={48} color={colors.background} />
              </LinearGradient>
              <Image
                source={{ uri: facility.imageUrl }}
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
                <Text style={styles.name}>{facility.name}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.location}>{facility.address}</Text>
                </View>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color={colors.star} />
                  <Text style={styles.ratingValue}>{facility.rating.toFixed(1)}</Text>
                  <Text style={styles.ratingCount}>({facility.reviewCount} reviews)</Text>
                </View>
              </View>

              <View style={styles.chipRow}>
                {facility.sports.map((sport) => (
                  <View key={sport} style={styles.sportChip}>
                    <SportIcon sport={sport} size={14} color={colors.primary} />
                    <Text style={styles.sportChipText}>{sport}</Text>
                  </View>
                ))}
              </View>

              <Section title="About">
                <Text style={styles.description}>{facility.description}</Text>
              </Section>

              <Section title="Amenities">
                <View style={styles.chipRow}>
                  {facility.amenities.map((amenity) => (
                    <View key={amenity} style={styles.amenityChip}>
                      <Ionicons name={getAmenityIcon(amenity)} size={14} color={colors.success} />
                      <Text style={styles.amenityChipText}>{amenity}</Text>
                    </View>
                  ))}
                </View>
              </Section>

              <Section title="Courts">
                <View style={styles.courtsList}>
                  {facility.courts.map((court, index) => (
                    <CourtRow
                      key={court.id}
                      court={court}
                      index={index}
                      selected={court.id === selectedCourtId}
                      onPress={() =>
                        setSelectedCourtId((prev) => (prev === court.id ? undefined : court.id))
                      }
                    />
                  ))}
                </View>
              </Section>
            </Animated.View>
          </ScrollView>

          <Animated.View
            entering={FadeIn.duration(250)}
            style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}
          >
            <View style={styles.footerPrice}>
              <Text style={styles.footerPriceLabel}>{selectedCourt ? selectedCourt.name : 'from'}</Text>
              <Text style={styles.footerPriceValue}>{footerPriceLabel}</Text>
            </View>
            <Button
              label="Book now"
              disabled={!selectedCourt}
              onPress={() =>
                router.push({
                  pathname: '/(app)/facility/[id]/book',
                  params: { id: facility.id, courtId: selectedCourt?.id },
                })
              }
              style={styles.footerButton}
            />
          </Animated.View>
        </>
      )}
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function CourtRow({
  court,
  index,
  selected,
  onPress,
}: {
  court: FacilityCourtSummary;
  index: number;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(300)}>
      <PressableScale
        style={[styles.courtRow, selected && styles.courtRowSelected]}
        onPress={onPress}
        scaleTo={0.98}
      >
        <View style={[styles.courtIcon, selected && styles.courtIconSelected]}>
          <SportIcon sport={court.sport} size={18} color={selected ? colors.onPrimary : colors.primary} />
        </View>
        <View style={styles.courtInfo}>
          <Text style={styles.courtName}>{court.name}</Text>
          <View style={styles.courtMetaRow}>
            <Ionicons
              name={court.indoor ? 'home-outline' : 'sunny-outline'}
              size={12}
              color={colors.textMuted}
            />
            <Text style={styles.courtMeta}>
              {court.sport.charAt(0).toUpperCase() + court.sport.slice(1)} · {court.indoor ? 'Indoor' : 'Outdoor'}
            </Text>
          </View>
        </View>
        <Text style={styles.courtPrice}>{formatCurrency(court.basePrice)}</Text>
        <Ionicons
          name={selected ? 'checkmark-circle' : 'ellipse-outline'}
          size={20}
          color={selected ? colors.primary : colors.borderStrong}
        />
      </PressableScale>
    </Animated.View>
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
  name: {
    ...typography.title,
    color: colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    ...typography.body,
    color: colors.textMuted,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingValue: {
    ...typography.label,
    color: colors.text,
  },
  ratingCount: {
    ...typography.caption,
    color: colors.textFaint,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
  },
  sportChipText: {
    ...typography.label,
    color: colors.primary,
    textTransform: 'capitalize',
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
  },
  amenityChipText: {
    ...typography.label,
    color: colors.text,
  },
  courtsList: {
    gap: spacing.sm,
  },
  courtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  courtRowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  courtIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.xs,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courtIconSelected: {
    backgroundColor: colors.primary,
  },
  courtInfo: {
    flex: 1,
    gap: 2,
  },
  courtName: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  courtMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  courtMeta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  courtPrice: {
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
  footerButton: {
    flex: 1,
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
});
