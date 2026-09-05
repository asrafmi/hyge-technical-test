export const colors = {
  primary: '#1A68FE',
  primaryDark: '#0F4FCC',
  primarySoft: '#E8F0FF',
  primaryMuted: '#C7DAFF',

  secondary: '#2F3033',
  secondarySoft: '#F4F5F7',

  background: '#FFFFFF',
  surface: '#FAFBFC',
  surfaceAlt: '#F4F5F7',
  border: '#E8EAEE',
  borderStrong: '#D6D9DF',

  text: '#2F3033',
  textMuted: '#797C85',
  textFaint: '#A9ACB4',
  onPrimary: '#FFFFFF',

  success: '#0FA968',
  successSoft: '#E4F7EE',
  danger: '#E5484D',
  dangerSoft: '#FDECEC',
  warning: '#F5A524',
  warningSoft: '#FEF4E4',

  star: '#F5A524',
  overlay: 'rgba(47, 48, 51, 0.45)',
  skeleton: '#EDEFF3',
  skeletonHighlight: '#F7F8FA',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radius = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
  pill: 999,
} as const;

export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

export const typography = {
  display: { fontFamily: fonts.extrabold, fontSize: 32, lineHeight: 40 },
  title: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 32 },
  heading: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24 },
  subheading: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  bodyMedium: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  tiny: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 14 },
} as const;

export const shadows = {
  card: {
    shadowColor: '#2F3033',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  floating: {
    shadowColor: '#2F3033',
    shadowOpacity: 0.14,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  primary: {
    shadowColor: colors.primary,
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
} as const;

export const motion = {
  spring: { damping: 16, stiffness: 180, mass: 0.6 },
  springSoft: { damping: 20, stiffness: 120, mass: 0.8 },
  pressScale: 0.96,
  duration: { fast: 150, base: 250, slow: 400 },
} as const;
