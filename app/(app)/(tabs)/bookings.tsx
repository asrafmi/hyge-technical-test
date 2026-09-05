import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing, typography } from '@/shared/constants/theme';

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <Text style={styles.title}>My bookings</Text>
        <Text style={styles.subtitle}>Everything you have booked, in one place.</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(350)} style={styles.empty}>
        <View style={styles.emptyIcon}>
          <Ionicons name="calendar-outline" size={26} color={colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>No bookings yet</Text>
        <Text style={styles.emptyMessage}>
          Once you reserve a court it will show up here with all the details.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  header: {
    gap: 2,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingBottom: 80,
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
});
