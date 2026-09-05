import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { getSportIcon } from '@/shared/utils/facility-icons';

interface SportIconProps {
  sport: string;
  size?: number;
  color: string;
}

export function SportIcon({ sport, size = 18, color }: SportIconProps) {
  const icon = getSportIcon(sport);

  if (icon.kind === 'badminton') {
    return (
      <Image
        source={require('@/assets/badminton-icon.png')}
        style={{ width: size, height: size, tintColor: color }}
        contentFit="contain"
      />
    );
  }

  return <Ionicons name={icon.name} size={size} color={color} />;
}
