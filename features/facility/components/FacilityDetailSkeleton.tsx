import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/shared/components/Skeleton';
import { spacing } from '@/shared/constants/theme';

export function FacilityDetailSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton height={280} borderRadius={0} />
      <View style={styles.body}>
        <Skeleton width="70%" height={22} />
        <Skeleton width="45%" height={14} />
        <View style={styles.row}>
          <Skeleton width={70} height={26} />
          <Skeleton width={70} height={26} />
        </View>
        <Skeleton width="100%" height={14} />
        <Skeleton width="90%" height={14} />
        <Skeleton width="60%" height={14} />
        <View style={styles.row}>
          <Skeleton width={90} height={30} />
          <Skeleton width={90} height={30} />
          <Skeleton width={90} height={30} />
        </View>
        <Skeleton width="100%" height={72} />
        <Skeleton width="100%" height={72} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    gap: spacing.sm,
    padding: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
});
