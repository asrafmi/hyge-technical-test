import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRegister } from '@/features/auth/hooks/use-register';
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas/auth-schemas';
import { Button } from '@/shared/components/Button';
import { PressableScale } from '@/shared/components/PressableScale';
import { TextField } from '@/shared/components/TextField';
import { colors, radius, spacing, typography } from '@/shared/constants/theme';
import { getErrorMessage } from '@/shared/utils/error';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { mutate, isPending, error } = useRegister();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = (values: RegisterFormValues) => {
    mutate(values, {
      onSuccess: () => router.replace('/(app)/(tabs)/home'),
    });
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.md }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(300)}>
          <PressableScale style={styles.backButton} onPress={() => router.back()} scaleTo={0.9}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </PressableScale>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(350)} style={styles.heading}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Book courts in a few taps.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(350)} style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextField
                label="Full name"
                icon="person-outline"
                placeholder="Jane Doe"
                autoComplete="name"
                autoCapitalize="words"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextField
                label="Email"
                icon="mail-outline"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoComplete="email"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <TextField
                label="Password"
                icon="lock-closed-outline"
                placeholder="At least 8 characters"
                isPassword
                autoComplete="password-new"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.password?.message}
              />
            )}
          />

          {error ? (
            <Animated.View entering={FadeIn.duration(200)} style={styles.errorBox}>
              <Ionicons name="alert-circle" size={17} color={colors.danger} />
              <Text style={styles.errorText}>{getErrorMessage(error)}</Text>
            </Animated.View>
          ) : null}

          <Button label="Create account" onPress={handleSubmit(onSubmit)} loading={isPending} style={styles.submit} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).duration(350)} style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href="/(auth)/login" style={styles.link}>
            Sign in
          </Link>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    gap: spacing.xxs,
  },
  title: {
    ...typography.display,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  form: {
    gap: spacing.md,
  },
  submit: {
    marginTop: spacing.xs,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.dangerSoft,
  },
  errorText: {
    flex: 1,
    ...typography.caption,
    color: colors.danger,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xxs,
    marginTop: 'auto',
  },
  footerText: {
    ...typography.body,
    color: colors.textMuted,
  },
  link: {
    ...typography.label,
    color: colors.primary,
  },
});
