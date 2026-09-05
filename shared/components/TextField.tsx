import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, motion, radius, spacing, typography } from '@/shared/constants/theme';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export function TextField({ label, error, icon, isPassword, style, ...inputProps }: TextFieldProps) {
  const [hidden, setHidden] = useState(Boolean(isPassword));
  const focus = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => ({
    borderColor: error
      ? colors.danger
      : interpolateColor(focus.value, [0, 1], [colors.border, colors.primary]),
    backgroundColor: interpolateColor(focus.value, [0, 1], [colors.surface, colors.background]),
  }));

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={[styles.field, containerStyle]}>
        {icon ? <Ionicons name={icon} size={19} color={colors.textMuted} /> : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textFaint}
          autoCapitalize="none"
          secureTextEntry={hidden}
          onFocus={() => {
            focus.value = withTiming(1, { duration: motion.duration.fast });
          }}
          onBlur={() => {
            focus.value = withTiming(0, { duration: motion.duration.fast });
          }}
          {...inputProps}
        />
        {isPassword ? (
          <Pressable onPress={() => setHidden((prev) => !prev)} hitSlop={10}>
            <Ionicons
              name={hidden ? 'eye-off-outline' : 'eye-outline'}
              size={19}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
      </Animated.View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    ...typography.label,
    color: colors.text,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 56,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
  },
});
