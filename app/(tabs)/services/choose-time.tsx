import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookAServiceCard } from '@/components/booking/BookAServiceCard';
import { BookingFlowHeader } from '@/components/booking/BookingFlowHeader';
import { AppButton } from '@/components/ui';
import { appTheme } from '@/constants/app-theme';
import { useBarberify } from '@/context/BarberifyContext';

const TIME_SLOTS = [
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
  '6:00 PM - 7:00 PM',
  '7:00 PM - 8:00 PM',
];

export default function ChooseTimeScreen() {
  const insets = useSafeAreaInsets();
  const { booking, setBookingTimeSlot } = useBarberify();

  useFocusEffect(
    useCallback(() => {
      if (!booking.selection || !booking.barber || !booking.date) {
        router.back();
      }
    }, [booking.barber, booking.date, booking.selection]),
  );

  if (!booking.selection || !booking.barber || !booking.date) {
    return null;
  }

  const subtitle = 'Choose your preferred date & time slot';

  const goSummary = () => {
    if (!booking.timeSlot) {
      return;
    }
    router.push('/(tabs)/services/booking-summary');
  };

  const footerPad = Math.max(insets.bottom, 16) + 8;

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: Math.max(insets.top, 10), paddingBottom: Math.max(insets.bottom, 12) },
      ]}>
      <BookAServiceCard style={{ marginBottom: 12 }} />
      <BookingFlowHeader compactTop step={3} title="Select Date & Time" subtitle={subtitle} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 16 }]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Select Time Slot</Text>
        <View style={styles.grid}>
          {TIME_SLOTS.map((slot) => {
            const selected = booking.timeSlot === slot;
            return (
              <Pressable
                key={slot}
                onPress={() => setBookingTimeSlot(selected ? null : slot)}
                style={[styles.slotBtn, selected && styles.slotBtnSelected]}>
                <Text style={[styles.slotText, selected && styles.slotTextSelected]}>{slot}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: footerPad, paddingTop: 12 }]}>
        <AppButton
          label="Proceed to Summary  →"
          onPress={goSummary}
          disabled={!booking.timeSlot}
          light
          style={styles.proceed}
        />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  sectionLabel: {
    color: appTheme.colors.textOnDark,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: appTheme.fontFamily,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotBtn: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: '#4a4a4a',
    borderRadius: appTheme.radius.md,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  slotBtnSelected: {
    backgroundColor: '#6a6a6a',
    borderColor: appTheme.colors.textOnDark,
  },
  slotText: {
    color: appTheme.colors.textOnDark,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: appTheme.fontFamily,
  },
  slotTextSelected: {
    fontWeight: '800',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
    backgroundColor: appTheme.colors.background,
  },
  proceed: {
    marginBottom: 0,
  },
});
