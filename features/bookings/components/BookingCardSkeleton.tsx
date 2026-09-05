import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/shared/components/Skeleton';
import { colors, radius, spacing } from '@/shared/constants/theme';

export function BookingCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width={96} height={110} borderRadius={0} />
      <View style={styles.body}>
        <Skeleton width="70%" height={16} />
        <Skeleton width="50%" height={12} />
        <Skeleton width="80%" height={12} />
        <Skeleton width="40%" height={14} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.xs,
    justifyContent: 'center',
  },
});
