import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/shared/components/Button';
import { PressableScale } from '@/shared/components/PressableScale';
import { colors, radius, shadows, spacing, typography } from '@/shared/constants/theme';
import { useAuthStore } from '@/store/auth-store';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <Animated.View entering={FadeIn.duration(250)} style={styles.topBar}>
        <PressableScale style={styles.backButton} onPress={() => router.back()} scaleTo={0.9}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </PressableScale>
        <Text style={styles.topTitle}>Profile</Text>
        <View style={styles.backButton} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(350)} style={[styles.card, shadows.card]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() ?? '?'}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(160).duration(350)} style={styles.menu}>
        <MenuRow icon="person-outline" label="Account details" />
        <MenuRow icon="notifications-outline" label="Notifications" />
        <MenuRow icon="help-circle-outline" label="Help & support" />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(240).duration(350)} style={styles.footer}>
        <Button label="Sign out" variant="secondary" onPress={signOut} />
      </Animated.View>
    </View>
  );
}

function MenuRow({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <PressableScale style={styles.menuRow} scaleTo={0.985} onPress={() => {}}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={19} color={colors.primary} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  card: {
    alignItems: 'center',
    gap: 2,
    paddingVertical: spacing.xxl,
    borderRadius: radius.xl,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    ...typography.display,
    color: colors.onPrimary,
  },
  name: {
    ...typography.heading,
    color: colors.text,
  },
  email: {
    ...typography.body,
    color: colors.textMuted,
  },
  menu: {
    gap: spacing.xs,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.xs,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.text,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing.xl,
  },
});
