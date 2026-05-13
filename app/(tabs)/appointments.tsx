import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { appTheme } from '@/constants/app-theme';
import { AppButton } from '@/components/ui';
import { AppointmentStatus, getSelectionTitle, useBarberify } from '@/context/BarberifyContext';

const filterOptions: { key: AppointmentStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'booked', label: 'Booked' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

function formatLongDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AppointmentsTabScreen() {
  const insets = useSafeAreaInsets();
  const { appointments, cancelAppointment } = useBarberify();
  const [filter, setFilter] = useState<'all' | AppointmentStatus>('all');

  const filteredAppointments =
    filter === 'all' ? appointments : appointments.filter((appointment) => appointment.status === filter);

  const showConfirmDialog = (title: string, message: string, onYes: () => void) => {
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      if (window.confirm(`${title}\n\n${message}`)) {
        onYes();
      }
      return;
    }

    Alert.alert(title, message, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: onYes,
      },
    ]);
  };

  const handleCancel = (appointmentId: string) => {
    showConfirmDialog('Cancel Booking', 'Do you want to cancel this booking?', () => {
      cancelAppointment(appointmentId);
    });
  };

  const getStatusStyle = (status: AppointmentStatus) => {
    if (status === 'booked') {
      return styles.badgeBooked;
    }
    if (status === 'completed') {
      return styles.badgeCompleted;
    }
    if (status === 'cancelled') {
      return styles.badgeCancelled;
    }
    return styles.badgeBooked;
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 24) + 72 }]}
    >
      <View style={[styles.hero, { marginTop: Math.max(insets.top, 12) }]}>
        <View style={styles.heroGlow} />
        <View style={styles.heroInner}>
          <View style={styles.heroIconCircle}>
            <Ionicons name="calendar" size={28} color="#1a1a1a" />
          </View>
          <View style={styles.heroTextBlock}>
            <Text style={styles.header}>My Appointments</Text>
            <Text style={styles.subtitle}>Track your booked, completed, or cancelled visits in one place.</Text>
          </View>
        </View>
      </View>

      <Text style={styles.filterHeading}>Filter by status</Text>
      <View style={styles.filterRow}>
        {filterOptions.map((option) => (
          <Pressable
            key={option.key}
            onPress={() => setFilter(option.key)}
            style={[styles.filterChip, filter === option.key && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter === option.key && styles.filterTextActive]}>{option.label}</Text>
          </Pressable>
        ))}
      </View>

      {filteredAppointments.length === 0 ? (
        <Text style={styles.empty}>No appointments found in this category.</Text>
      ) : (
        filteredAppointments.map((appointment) => (
          <View key={appointment.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{getSelectionTitle(appointment.selection)}</Text>
              <View style={[styles.badge, getStatusStyle(appointment.status)]}>
                <Text style={styles.badgeText}>{appointment.status.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Barber</Text>
              <Text style={styles.detailValue}>{appointment.barber.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatLongDate(appointment.dateIso)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{appointment.timeSlot}</Text>
            </View>
            {appointment.status === 'booked' ? (
              <AppButton
                label="Cancel Booking"
                danger
                onPress={() => handleCancel(appointment.id)}
                style={styles.cancelButton}
              />
            ) : null}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: appTheme.colors.background,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  hero: {
    marginBottom: 20,
    borderRadius: appTheme.radius.lg,
    overflow: 'hidden',
    backgroundColor: '#3a3a3a',
    borderWidth: 1,
    borderColor: '#555',
  },
  heroGlow: {
    height: 4,
    backgroundColor: appTheme.colors.accent,
  },
  heroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 16,
  },
  heroIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: appTheme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextBlock: {
    flex: 1,
  },
  filterHeading: {
    color: '#bdbdbd',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
    fontFamily: appTheme.fontFamily,
  },
  header: {
    color: appTheme.colors.textOnDark,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
    fontFamily: appTheme.fontFamily,
  },
  subtitle: {
    color: '#c8c8c8',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: appTheme.fontFamily,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  filterChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: appTheme.radius.lg,
    backgroundColor: appTheme.colors.surface,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: appTheme.colors.accent,
    borderColor: '#e1b64c',
  },
  filterText: {
    color: appTheme.colors.textPrimary,
    fontFamily: appTheme.fontFamily,
    fontWeight: '700',
  },
  filterTextActive: {
    color: appTheme.colors.textOnDark,
  },
  empty: {
    color: '#d0d0d0',
    fontSize: 15,
    fontFamily: appTheme.fontFamily,
    marginTop: 18,
  },
  card: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: appTheme.radius.lg,
    padding: 18,
    marginBottom: 16,
    shadowColor: appTheme.colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: appTheme.colors.textPrimary,
    fontFamily: appTheme.fontFamily,
    flex: 1,
    marginRight: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    color: appTheme.colors.textMuted,
    fontFamily: appTheme.fontFamily,
  },
  detailValue: {
    color: appTheme.colors.textPrimary,
    fontFamily: appTheme.fontFamily,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    color: appTheme.colors.textOnDark,
    fontWeight: '800',
    fontSize: 11,
    fontFamily: appTheme.fontFamily,
  },
  badgeBooked: {
    backgroundColor: appTheme.colors.accent,
  },
  badgeCompleted: {
    backgroundColor: appTheme.colors.success,
  },
  badgeCancelled: {
    backgroundColor: '#6b6b6b',
  },
  cancelButton: {
    marginTop: 14,
  },
});
