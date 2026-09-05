import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PressableScale } from '@/shared/components/PressableScale';
import type { Facility } from '@/services/api/types';
import { colors, radius, shadows, spacing, typography } from '@/shared/constants/theme';
import { formatCompactCurrency } from '@/shared/utils/format';

interface FacilityCardProps {
  facility: Facility;
  index?: number;
  onPress?: () => void;
}

export function FacilityCard({ facility, index = 0, onPress }: FacilityCardProps) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 70).springify().damping(16)}>
      <PressableScale style={[styles.card, shadows.card]} onPress={onPress ?? (() => {})} scaleTo={0.975}>
        <View style={styles.imageWrapper}>
          <LinearGradient
            colors={[colors.primarySoft, colors.primaryMuted]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.imageFallback}
          >
            <Ionicons name="tennisball" size={34} color={colors.background} />
          </LinearGradient>
          <Image
            source={{ uri: facility.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={250}
          />
          <LinearGradient
            colors={['transparent', 'rgba(47,48,51,0.4)']}
            locations={[0.55, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color={colors.star} />
            <Text style={styles.ratingValue}>{facility.rating.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({facility.reviewCount})</Text>
          </View>
          <View style={styles.sportsRow}>
            {facility.sports.map((sport) => (
              <View key={sport} style={styles.sportChip}>
                <Text style={styles.sportChipText}>{sport}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.headline}>
            <Text style={styles.name} numberOfLines={1}>
              {facility.name}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={colors.textMuted} />
              <Text style={styles.location} numberOfLines={1}>
                {facility.location} · {facility.distanceKm.toFixed(1)} km
              </Text>
            </View>
          </View>

          <View style={styles.priceBlock}>
            <Text style={styles.priceLabel}>from</Text>
            <Text style={styles.price}>{formatCompactCurrency(facility.startingPrice)}</Text>
          </View>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  imageWrapper: {
    height: 158,
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
  ratingBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xs,
    paddingVertical: 5,
    borderRadius: radius.xs,
  },
  ratingValue: {
    ...typography.tiny,
    color: colors.text,
  },
  ratingCount: {
    ...typography.tiny,
    color: colors.textFaint,
  },
  sportsRow: {
    position: 'absolute',
    left: spacing.sm,
    bottom: spacing.sm,
    flexDirection: 'row',
    gap: spacing.xxs,
  },
  sportChip: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: radius.xs,
  },
  sportChipText: {
    ...typography.tiny,
    color: colors.text,
    textTransform: 'capitalize',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    padding: spacing.md,
  },
  headline: {
    flex: 1,
    gap: 3,
  },
  name: {
    ...typography.subheading,
    color: colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  location: {
    ...typography.caption,
    color: colors.textMuted,
    flex: 1,
  },
  priceBlock: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    ...typography.tiny,
    color: colors.textFaint,
    textTransform: 'uppercase',
  },
  price: {
    ...typography.heading,
    color: colors.primary,
  },
});
