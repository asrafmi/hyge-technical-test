import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/shared/components/Skeleton';
import { colors, radius, spacing } from '@/shared/constants/theme';

export function FacilityCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton height={158} borderRadius={0} />
      <View style={styles.body}>
        <View style={styles.left}>
          <Skeleton width="72%" height={16} />
          <Skeleton width="52%" height={12} />
        </View>
        <Skeleton width={64} height={22} />
      </View>
    </View>
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
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    gap: spacing.sm,
  },
  left: {
    flex: 1,
    gap: spacing.xs,
  },
});
