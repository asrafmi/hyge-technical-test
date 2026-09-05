import type { Ionicons } from '@expo/vector-icons';

type IoniconName = keyof typeof Ionicons.glyphMap;

export type SportIcon = { kind: 'ionicon'; name: IoniconName } | { kind: 'badminton' };

const SPORT_ICONS: Record<string, SportIcon> = {
  padel: { kind: 'ionicon', name: 'tennisball' },
  tennis: { kind: 'ionicon', name: 'tennisball' },
  badminton: { kind: 'badminton' },
  basketball: { kind: 'ionicon', name: 'basketball' },
  futsal: { kind: 'ionicon', name: 'football' },
  football: { kind: 'ionicon', name: 'football' },
  soccer: { kind: 'ionicon', name: 'football' },
  volleyball: { kind: 'ionicon', name: 'basketball-outline' },
  swimming: { kind: 'ionicon', name: 'water' },
};

export function getSportIcon(sport: string): SportIcon {
  return SPORT_ICONS[sport.toLowerCase()] ?? { kind: 'ionicon', name: 'american-football-outline' };
}

const AMENITY_ICONS: Record<string, IoniconName> = {
  parking: 'car-outline',
  showers: 'water-outline',
  shower: 'water-outline',
  cafe: 'cafe-outline',
  'equipment rental': 'briefcase-outline',
  wifi: 'wifi-outline',
  locker: 'lock-closed-outline',
  lockers: 'lock-closed-outline',
  'changing room': 'shirt-outline',
  'changing rooms': 'shirt-outline',
  toilet: 'water-outline',
  toilets: 'water-outline',
  ac: 'snow-outline',
  'air conditioning': 'snow-outline',
  lighting: 'bulb-outline',
  'prayer room': 'moon-outline',
  musholla: 'moon-outline',
  'first aid': 'medkit-outline',
};

export function getAmenityIcon(amenity: string): IoniconName {
  return AMENITY_ICONS[amenity.toLowerCase()] ?? 'checkmark-circle';
}
