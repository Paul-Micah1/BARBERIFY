import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { appTheme } from '@/constants/app-theme';

type BookingFlowHeaderProps = {
  step: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  /** When true, the back chevron is hidden (e.g. first step of flow). */
  hideBack?: boolean;
  /** When a top promo card already applied safe-area padding, use a smaller top inset here. */
  compactTop?: boolean;
};

export function BookingFlowHeader({
  step,
  totalSteps = 4,
  title,
  subtitle,
  onBack,
  onNext,
  nextDisabled,
  hideBack,
  compactTop,
}: BookingFlowHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const canGoNext = Boolean(onNext) && !nextDisabled;

  const topPad = compactTop ? 6 : Math.max(insets.top, 10);

  return (
    <View style={[styles.wrap, { paddingTop: topPad }]}>
      <View style={styles.navRow}>
        {hideBack ? (
          <View style={styles.navSpacer} />
        ) : (
          <Pressable onPress={handleBack} hitSlop={14} style={styles.iconBtn} accessibilityRole="button">
            <Ionicons name="chevron-back" size={28} color={appTheme.colors.textOnDark} />
          </Pressable>
        )}
        {onNext ? (
          <Pressable
            onPress={onNext}
            disabled={!canGoNext}
            hitSlop={14}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canGoNext }}>
            <Ionicons
              name="chevron-forward"
              size={28}
              color={canGoNext ? appTheme.colors.textOnDark : '#6a6a6a'}
            />
          </Pressable>
        ) : (
          <View style={styles.navSpacer} />
        )}
      </View>
      <Text style={styles.stepText}>
        Step {step} of {totalSteps}
      </Text>
      <View style={styles.progressRow}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <View
            key={String(i)}
            style={[styles.progressSeg, i < step ? styles.progressFill : styles.progressTrack]}
          />
        ))}
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  navSpacer: {
    width: 36,
    height: 36,
  },
  stepText: {
    color: '#d0d0d0',
    fontSize: 13,
    fontFamily: appTheme.fontFamily,
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  progressSeg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressFill: {
    backgroundColor: appTheme.colors.accent,
  },
  progressTrack: {
    backgroundColor: '#3a3a3a',
  },
  title: {
    color: appTheme.colors.textOnDark,
    fontSize: 26,
    fontWeight: '800',
    fontFamily: appTheme.fontFamily,
  },
  subtitle: {
    color: '#c8c8c8',
    fontSize: 14,
    marginTop: 6,
    fontFamily: appTheme.fontFamily,
  },
});
