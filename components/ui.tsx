import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { appTheme } from '@/constants/app-theme';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  danger?: boolean;
  /** Gold / accent primary (e.g. booking flow CTAs). */
  accent?: boolean;
  /** White fill, dark label (e.g. proceed on dark screens). */
  light?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
};

export function AppButton({ label, onPress, secondary, danger, accent, light, style, disabled }: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.buttonSecondary,
        danger && styles.buttonDanger,
        accent && styles.buttonAccent,
        light && styles.buttonLight,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      <Text
        style={[
          styles.buttonText,
          secondary && styles.buttonTextSecondary,
          accent && styles.buttonTextAccent,
          light && styles.buttonTextLight,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ScreenShell({ children }: { children: React.ReactNode }) {
  return <View style={styles.screen}>{children}</View>;
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: appTheme.colors.background,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  button: {
    backgroundColor: appTheme.colors.textPrimary,
    borderRadius: appTheme.radius.md,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: appTheme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonSecondary: {
    backgroundColor: appTheme.colors.surface,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
  },
  buttonDanger: {
    backgroundColor: appTheme.colors.danger,
  },
  buttonAccent: {
    backgroundColor: appTheme.colors.accent,
  },
  buttonLight: {
    backgroundColor: '#ffffff',
  },
  buttonText: {
    color: appTheme.colors.textOnDark,
    fontWeight: '600',
    fontSize: 15,
    fontFamily: appTheme.fontFamily,
  },
  buttonTextSecondary: {
    color: appTheme.colors.textPrimary,
  },
  buttonTextAccent: {
    color: '#1a1a1a',
    fontWeight: '800',
  },
  buttonTextLight: {
    color: '#1a1a1a',
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
