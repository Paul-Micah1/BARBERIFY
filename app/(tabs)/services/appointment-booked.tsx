import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui';
import { appTheme } from '@/constants/app-theme';
import {
  formatSelectionDuration,
  formatSelectionPrice,
  getSelectionTitle,
  useBarberify,
} from '@/context/BarberifyContext';

function formatLongDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export default function AppointmentBookedScreen() {
  const insets = useSafeAreaInsets();
  const { appointments, resetBooking } = useBarberify();
  const latest = appointments[0];

  useEffect(() => {
    resetBooking();
  }, []);

  const goHome = () => {
    resetBooking();
    router.replace('/(tabs)');
  };

  const goAppointments = () => {
    resetBooking();
    router.replace('/(tabs)/appointments');
  };

  const footerPad = Math.max(insets.bottom, 16) + 8;

  if (!latest) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.fallback}>No appointment found.</Text>
        </ScrollView>
        <View style={[styles.footer, { paddingBottom: footerPad, paddingTop: 12 }]}>
          <AppButton label="Home" onPress={goHome} />
        </View>
      </View>
    );
  }

  const serviceTitle = getSelectionTitle(latest.selection);
  const priceLine = `${formatSelectionPrice(latest.selection)} - ${formatSelectionDuration(latest.selection)}`;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.hero}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={48} color={appTheme.colors.textOnDark} />
            </View>
            <Text style={styles.title}>Appointment Booked!</Text>
            <Text style={styles.sub}>Your appointment has been confirmed.</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.badgeRow}>
              <Text style={styles.cardTitle}>Appointment Details</Text>
              <View style={styles.confirmedBadge}>
                <Text style={styles.confirmedText}>CONFIRMED</Text>
              </View>
            </View>
            <Text style={styles.line}>
              <Text style={styles.lineLabel}>Service: </Text>
              {serviceTitle} ({priceLine})
            </Text>
            <Text style={styles.line}>
              <Text style={styles.lineLabel}>Barber: </Text>
              {latest.barber.name}
            </Text>
            <Text style={styles.line}>
              <Text style={styles.lineLabel}>Date: </Text>
              {formatLongDate(latest.dateIso)}
            </Text>
            <Text style={styles.line}>
              <Text style={styles.lineLabel}>Time: </Text>
              {latest.timeSlot}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: footerPad, paddingTop: 12 }]}>
        <View style={styles.rowBtns}>
          <AppButton label="Home Page" onPress={goHome} secondary style={styles.half} />
          <AppButton label="Appointments" onPress={goAppointments} style={styles.half} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: appTheme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  inner: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  fallback: {
    color: appTheme.colors.textOnDark,
    marginBottom: 16,
    fontFamily: appTheme.fontFamily,
    textAlign: 'center',
    paddingTop: 24,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 20,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: appTheme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    color: appTheme.colors.textOnDark,
    fontSize: 26,
    fontWeight: '800',
    fontFamily: appTheme.fontFamily,
    textAlign: 'center',
  },
  sub: {
    color: '#e0e0e0',
    marginTop: 6,
    textAlign: 'center',
    fontFamily: appTheme.fontFamily,
  },
  card: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: appTheme.radius.lg,
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: appTheme.colors.textPrimary,
    fontFamily: appTheme.fontFamily,
  },
  confirmedBadge: {
    backgroundColor: appTheme.colors.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  confirmedText: {
    color: appTheme.colors.textOnDark,
    fontSize: 10,
    fontWeight: '900',
    fontFamily: appTheme.fontFamily,
  },
  line: {
    fontSize: 14,
    color: appTheme.colors.textPrimary,
    marginBottom: 8,
    fontFamily: appTheme.fontFamily,
  },
  lineLabel: {
    fontWeight: '800',
  },
  footer: {
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
    backgroundColor: appTheme.colors.background,
  },
  rowBtns: {
    flexDirection: 'row',
    gap: 10,
  },
  half: {
    flex: 1,
  },
});
