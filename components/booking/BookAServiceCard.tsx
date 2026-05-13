import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { appTheme } from '@/constants/app-theme';

type BookAServiceCardProps = {
  style?: ViewStyle;
};

export function BookAServiceCard({ style }: BookAServiceCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.accentBar} />
      <View style={styles.inner}>
        <View style={styles.iconCircle}>
          <Ionicons name="cut" size={26} color="#1a1a1a" />
        </View>
        <View style={styles.textCol}>
          <Text style={styles.title}>Book a service</Text>
          <Text style={styles.sub}>
            Choose a treatment or package, then continue through barber, date, and time.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: appTheme.radius.lg,
    overflow: 'hidden',
    backgroundColor: '#3a3a3a',
    borderWidth: 1,
    borderColor: '#555',
  },
  accentBar: {
    height: 4,
    backgroundColor: appTheme.colors.accent,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: appTheme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: appTheme.colors.textOnDark,
    fontSize: 20,
    fontWeight: '800',
    fontFamily: appTheme.fontFamily,
  },
  sub: {
    color: '#c8c8c8',
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
    fontFamily: appTheme.fontFamily,
  },
});
