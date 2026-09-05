import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/shared/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import { useFacility } from '@/features/facility/hooks/use-facility';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const insets = useSafeAreaInsets();
  const { facilities, isLoadingFacilities, isErrorFacilities } = useFacility()

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Text style={styles.title}>Welcome{user ? `, ${user.name}` : ''}</Text>
      <Text style={styles.subtitle}>Facility browsing and booking land here next.</Text>
      <View>
        {facilities?.length === 0 && isLoadingFacilities && (
          <Text>
            Loading...
          </Text>
        )}
        {!isLoadingFacilities && facilities?.map((facilty, index) => (
          <Text key={index}>
            {facilty.name}
          </Text>
        ))}
        {!isLoadingFacilities && facilities?.length === 0 && (
          <Text>
            Data Kosong
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
