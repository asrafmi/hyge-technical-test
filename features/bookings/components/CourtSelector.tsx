import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/shared/components/PressableScale';
import { SportIcon } from '@/shared/components/SportIcon';
import { colors, radius, spacing, typography } from '@/shared/constants/theme';
import type { AvailabilityCourt } from '@/services/api/types';

interface CourtSelectorProps {
  courts: AvailabilityCourt[];
  sportByCourtId: Record<string, string>;
  selectedCourtId: string | undefined;
  onSelect: (courtId: string) => void;
}

export function CourtSelector({ courts, sportByCourtId, selectedCourtId, onSelect }: CourtSelectorProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {courts.map((court) => {
        const active = court.id === selectedCourtId;
        const sport = sportByCourtId[court.id];

        return (
          <PressableScale key={court.id} onPress={() => onSelect(court.id)} scaleTo={0.96}>
            <View style={[styles.card, active && styles.cardActive]}>
              {sport ? (
                <SportIcon sport={sport} size={16} color={active ? colors.onPrimary : colors.primary} />
              ) : null}
              <Text style={[styles.name, active && styles.nameActive]} numberOfLines={1}>
                {court.name}
              </Text>
              <Ionicons
                name={court.indoor ? 'home-outline' : 'sunny-outline'}
                size={12}
                color={active ? colors.onPrimary : colors.textFaint}
              />
            </View>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  cardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  name: {
    ...typography.label,
    color: colors.text,
  },
  nameActive: {
    color: colors.onPrimary,
  },
});
