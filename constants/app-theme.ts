import { Platform } from 'react-native';

export const appTheme = {
  colors: {
    background: '#464646',
    backgroundSoft: '#525252',
    surface: '#f8f8f8',
    mutedSurface: '#eeeeee',
    textPrimary: '#121212',
    textOnDark: '#ffffff',
    textMuted: '#737373',
    accent: '#f6c453',
    border: '#dedede',
    danger: '#d9534f',
    success: '#32c36c',
    shadow: '#000000',
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 18,
  },
  fontFamily: Platform.select({
    ios: 'Inter',
    android: 'sans-serif',
    default: 'System',
  }),
};
