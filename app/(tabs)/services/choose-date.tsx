import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookAServiceCard } from '@/components/booking/BookAServiceCard';
import { BookingFlowHeader } from '@/components/booking/BookingFlowHeader';
import { appTheme } from '@/constants/app-theme';
import { useBarberify } from '@/context/BarberifyContext';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

function buildMonthGrid(year: number, month: number): ({ day: number } | null)[] {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: ({ day: number } | null)[] = [];
  for (let i = 0; i < firstDow; i += 1) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push({ day: d });
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  while (cells.length < 42) {
    cells.push(null);
  }
  return cells;
}

export default function ChooseDateScreen() {
  const insets = useSafeAreaInsets();
  const { booking, setBookingDate } = useBarberify();
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  }, []);

  const initial = booking.date ?? today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  useFocusEffect(
    useCallback(() => {
      if (!booking.selection || !booking.barber) {
        router.back();
      }
    }, [booking.barber, booking.selection]),
  );

  const grid = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  if (!booking.selection || !booking.barber) {
    return null;
  }

  const subtitle = 'Choose your preferred date & time slot';

  const selectDay = (day: number) => {
    const next = new Date(viewYear, viewMonth, day, 12, 0, 0, 0);
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (next < startOfToday) {
      return;
    }
    if (booking.date && sameDay(next, booking.date)) {
      setBookingDate(null);
      return;
    }
    setBookingDate(next);
  };

  const goNext = () => {
    if (!booking.date) {
      return;
    }
    router.push('/(tabs)/services/choose-time');
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const canContinue = Boolean(booking.date);

  return (
    <View
      style={[
        styles.screen,
        { paddingBottom: Math.max(insets.bottom, 12), paddingTop: Math.max(insets.top, 10) },
      ]}>
      <BookAServiceCard style={{ marginBottom: 12 }} />
      <BookingFlowHeader compactTop step={3} title="Select Date & Time" subtitle={subtitle} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 20) + 88 }]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Select Date</Text>
        <View style={styles.calendarCard}>
          <View style={styles.monthRow}>
            <Pressable onPress={prevMonth} hitSlop={10}>
              <Ionicons name="chevron-back" size={22} color={appTheme.colors.textPrimary} />
            </Pressable>
            <Text style={styles.monthTitle}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <Pressable onPress={nextMonth} hitSlop={10}>
              <Ionicons name="chevron-forward" size={22} color={appTheme.colors.textPrimary} />
            </Pressable>
          </View>
          <View style={styles.weekRow}>
            {WEEKDAYS.map((d) => (
              <Text key={d} style={styles.weekday}>
                {d}
              </Text>
            ))}
          </View>
          <View style={styles.daysGrid}>
            {chunk(grid, 7).map((row, ri) => (
              <View key={`row-${ri}`} style={styles.dayRow}>
                {row.map((cell, ci) => {
                  const idx = ri * 7 + ci;
                  if (!cell) {
                    return <View key={`e-${idx}`} style={styles.dayCell} />;
                  }
                  const cellDate = new Date(viewYear, viewMonth, cell.day, 12, 0, 0, 0);
                  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                  const disabled = cellDate < startOfToday;
                  const selected = booking.date ? sameDay(cellDate, booking.date) : false;
                  return (
                    <Pressable
                      key={`d-${idx}`}
                      disabled={disabled}
                      onPress={() => selectDay(cell.day)}
                      style={[
                        styles.dayCell,
                        disabled && styles.dayDisabled,
                        selected && styles.daySelected,
                      ]}>
                      <Text
                        style={[
                          styles.dayText,
                          disabled && styles.dayTextDisabled,
                          selected && styles.dayTextSelected,
                        ]}>
                        {cell.day}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Pressable
        onPress={goNext}
        disabled={!canContinue}
        accessibilityRole="button"
        accessibilityLabel="Continue to select time"
        style={[
          styles.fab,
          { bottom: Math.max(insets.bottom, 12) + 56 },
          !canContinue && styles.fabDisabled,
        ]}>
        <Ionicons name="arrow-forward" size={26} color={canContinue ? '#1a1a1a' : '#888'} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: appTheme.colors.background,
    paddingHorizontal: 16,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 24,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: appTheme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  fabDisabled: {
    opacity: 0.38,
  },
  sectionLabel: {
    color: appTheme.colors.textOnDark,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    fontFamily: appTheme.fontFamily,
  },
  calendarCard: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: appTheme.radius.lg,
    padding: 14,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: appTheme.colors.textPrimary,
    fontFamily: appTheme.fontFamily,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    color: appTheme.colors.textMuted,
    fontFamily: appTheme.fontFamily,
  },
  daysGrid: {
    marginTop: 4,
  },
  dayRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  dayText: {
    fontSize: 14,
    color: appTheme.colors.textPrimary,
    fontFamily: appTheme.fontFamily,
  },
  dayDisabled: {
    opacity: 0.35,
  },
  dayTextDisabled: {
    color: appTheme.colors.textMuted,
  },
  daySelected: {
    backgroundColor: appTheme.colors.textPrimary,
    borderRadius: 999,
  },
  dayTextSelected: {
    color: appTheme.colors.textOnDark,
    fontWeight: '700',
  },
});
