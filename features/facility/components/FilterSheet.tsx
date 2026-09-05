import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Facility } from '@/services/api/types';
import { BottomSheet } from '@/shared/components/BottomSheet';
import { Button } from '@/shared/components/Button';
import { PressableScale } from '@/shared/components/PressableScale';
import { Slider } from '@/shared/components/Slider';
import { SportIcon } from '@/shared/components/SportIcon';
import { colors, radius, spacing, typography } from '@/shared/constants/theme';
import { formatCompactCurrency } from '@/shared/utils/format';

export interface FacilityFilters {
  sport?: string;
  city?: string;
  maxPrice: number;
}

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  sports: { value: string; label: string }[];
  cities: { value: string; label: string }[];
  priceRange: { min: number; max: number; step: number };
  filters: FacilityFilters;
  onApply: (filters: FacilityFilters) => void;
  allFacilities: Facility[];
}

export function FilterSheet({
  visible,
  onClose,
  sports,
  cities,
  priceRange,
  filters,
  onApply,
  allFacilities,
}: FilterSheetProps) {
  const [draft, setDraft] = useState<FacilityFilters>(filters);

  useEffect(() => {
    if (visible) {
      setDraft(filters);
    }
  }, [visible, filters]);

  const resultCount = useMemo(() => {
    return allFacilities.filter((facility) => {
      const matchesSport = !draft.sport || facility.sports.includes(draft.sport);
      const matchesCity = !draft.city || facility.location.includes(draft.city);
      const matchesPrice = facility.startingPrice <= draft.maxPrice;
      return matchesSport && matchesCity && matchesPrice;
    }).length;
  }, [allFacilities, draft]);

  const handleReset = () => {
    setDraft({ sport: undefined, city: undefined, maxPrice: priceRange.max });
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Filters</Text>
        <PressableScale onPress={handleReset} haptic="light">
          <Text style={styles.reset}>Reset</Text>
        </PressableScale>
      </View>

      <Text style={styles.sectionLabel}>Sport</Text>
      <View style={styles.pillGrid}>
        <Pill
          label="All sports"
          active={!draft.sport}
          onPress={() => setDraft((prev) => ({ ...prev, sport: undefined }))}
        />
        {sports.map((sport) => (
          <Pill
            key={sport.value}
            label={sport.label}
            sport={sport.value}
            active={draft.sport === sport.value}
            onPress={() => setDraft((prev) => ({ ...prev, sport: sport.value }))}
          />
        ))}
      </View>

      <Text style={styles.sectionLabel}>City area</Text>
      <View style={styles.pillGrid}>
        <Pill
          label="All cities"
          active={!draft.city}
          onPress={() => setDraft((prev) => ({ ...prev, city: undefined }))}
        />
        {cities.map((city) => (
          <Pill
            key={city.value}
            label={city.label}
            active={draft.city === city.value}
            onPress={() => setDraft((prev) => ({ ...prev, city: city.value }))}
          />
        ))}
      </View>

      <View style={styles.priceHeader}>
        <Text style={styles.sectionLabel}>Max price / hour</Text>
        <Text style={styles.priceValue}>{formatCompactCurrency(draft.maxPrice)}</Text>
      </View>
      <Slider
        min={priceRange.min}
        max={priceRange.max}
        step={priceRange.step}
        value={draft.maxPrice}
        onChange={(value) => setDraft((prev) => ({ ...prev, maxPrice: value }))}
      />

      <View style={styles.actions}>
        <Button label="Cancel" variant="secondary" onPress={onClose} style={styles.actionButton} />
        <Button
          label={`Show ${resultCount} results`}
          onPress={handleApply}
          style={styles.actionButton}
        />
      </View>
    </BottomSheet>
  );
}

function Pill({
  label,
  sport,
  active,
  onPress,
}: {
  label: string;
  sport?: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.94}
      style={[styles.pill, styles.pillContent, active && styles.pillActive]}
    >
      {sport ? (
        <SportIcon sport={sport} size={14} color={active ? colors.onPrimary : colors.textMuted} />
      ) : null}
      <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  reset: {
    ...typography.label,
    color: colors.primary,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillLabel: {
    ...typography.label,
    color: colors.text,
  },
  pillLabelActive: {
    color: colors.onPrimary,
  },
  priceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  priceValue: {
    ...typography.heading,
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  actionButton: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
});
