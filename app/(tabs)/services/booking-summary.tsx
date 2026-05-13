import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookAServiceCard } from '@/components/booking/BookAServiceCard';
import { BookingFlowHeader } from '@/components/booking/BookingFlowHeader';
import { appTheme } from '@/constants/app-theme';
import {
  formatSelectionDuration,
  formatSelectionPrice,
  getSelectionTitle,
  useBarberify,
} from '@/context/BarberifyContext';

function formatLongDate(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export default function BookingSummaryScreen() {
  const insets = useSafeAreaInsets();
  const { booking, resetBooking, confirmBooking } = useBarberify();

  useEffect(() => {
    if (!booking.selection || !booking.barber || !booking.date || !booking.timeSlot) {
      router.back();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only validate on first mount; confirm clears booking after navigation
  }, []);

  if (!booking.selection || !booking.barber || !booking.date || !booking.timeSlot) {
    return null;
  }

  const { selection, barber, date, timeSlot } = booking;
  const serviceTitle = getSelectionTitle(selection);
  const priceLine = `${formatSelectionPrice(selection)} - ${formatSelectionDuration(selection)}`;

  const showConfirmDialog = (title: string, message: string, onYes: () => void) => {
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      if (window.confirm(`${title}\n\n${message}`)) {
        onYes();
      }
      return;
    }

    Alert.alert(title, message, [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: onYes },
    ]);
  };

  const onCancel = () => {
    showConfirmDialog('Cancel Appointment', 'Cancel appointment?', () => {
      resetBooking();
      router.replace('/(tabs)/services');
    });
  };

  const onConfirm = () => {
    showConfirmDialog('Confirm Appointment', 'Confirm appointment?', () => {
      confirmBooking();
      router.replace('/(tabs)/services/appointment-booked');
    });
  };

  const footerPad = Math.max(insets.bottom, 16) + 8;

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 10) }]}>
      <BookAServiceCard style={{ marginBottom: 12 }} />
      <BookingFlowHeader compactTop step={4} title="Booking Summary" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Appointment Details</Text>
          <View style={styles.row}>
            <Ionicons name="cut" size={18} color={appTheme.colors.textPrimary} />
            <View style={styles.rowBody}>
              <Text style={styles.label}>Service</Text>
              <Text style={styles.value}>
                {serviceTitle} ({priceLine})
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <Ionicons name="person" size={18} color={appTheme.colors.textPrimary} />
            <View style={styles.rowBody}>
              <Text style={styles.label}>Barber</Text>
              <Text style={styles.value}>{barber.name}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={18} color={appTheme.colors.textPrimary} />
            <View style={styles.rowBody}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{formatLongDate(date)}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Ionicons name="time-outline" size={18} color={appTheme.colors.textPrimary} />
            <View style={styles.rowBody}>
              <Text style={styles.label}>Time</Text>
              <Text style={styles.value}>{timeSlot}</Text>
            </View>
          </View>
        </View>

        <View style={styles.warning}>
          <Ionicons name="information-circle" size={22} color="#7a5c00" style={{ marginRight: 8 }} />
          <Text style={styles.warningText}>
            If the customer does not arrive within 15 minutes, the appointment will be automatically cancelled.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: footerPad, paddingTop: 12 }]}>
        <View style={styles.actions}>
          <Pressable onPress={onConfirm} style={({ pressed }) => [styles.btnConfirm, pressed && { opacity: 0.92 }]}>
            <Text style={styles.btnConfirmText}>Confirm Booking</Text>
          </Pressable>
          <Pressable onPress={onCancel} style={({ pressed }) => [styles.btnCancel, pressed && { opacity: 0.92 }]}>
            <Text style={styles.btnCancelText}>Cancel Booking</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: appTheme.colors.background,
    paddingHorizontal: 16,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: appTheme.radius.lg,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: appTheme.colors.textPrimary,
    marginBottom: 14,
    fontFamily: appTheme.fontFamily,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  rowBody: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: appTheme.colors.textMuted,
    fontFamily: appTheme.fontFamily,
  },
  value: {
    fontSize: 15,
    color: appTheme.colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
    fontFamily: appTheme.fontFamily,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f6d98f',
    borderRadius: appTheme.radius.lg,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#e1b64c',
  },
  warningText: {
    flex: 1,
    color: '#3d2e00',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
    fontFamily: appTheme.fontFamily,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
    backgroundColor: appTheme.colors.background,
  },
  actions: {
    flexDirection: 'column',
    gap: 12,
  },
  btnConfirm: {
    backgroundColor: appTheme.colors.success,
    borderRadius: appTheme.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnConfirmText: {
    color: appTheme.colors.textOnDark,
    fontWeight: '800',
    fontSize: 15,
    fontFamily: appTheme.fontFamily,
  },
  btnCancel: {
    backgroundColor: '#2e2e2e',
    borderRadius: appTheme.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnCancelText: {
    color: appTheme.colors.textOnDark,
    fontWeight: '700',
    fontSize: 14,
    fontFamily: appTheme.fontFamily,
  },
});
