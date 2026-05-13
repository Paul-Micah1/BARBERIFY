import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookAServiceCard } from '@/components/booking/BookAServiceCard';
import { BookingFlowHeader } from '@/components/booking/BookingFlowHeader';
import { appTheme } from '@/constants/app-theme';
import { getSelectionTitle, useBarberify, type Barber } from '@/context/BarberifyContext';

export default function ChooseBarberScreen() {
  const insets = useSafeAreaInsets();
  const { booking, barbers, setBookingBarber } = useBarberify();
  const [missingSelection, setMissingSelection] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!booking.selection) {
        setMissingSelection(true);
        router.back();
      } else {
        setMissingSelection(false);
      }
    }, [booking.selection]),
  );

  if (!booking.selection || missingSelection) {
    return null;
  }

  const title = getSelectionTitle(booking.selection);
  const subtitle = `Select a barber for your ${title}`;

  const isSelected = (b: Barber) => booking.barber?.id === b.id;

  const goNext = () => {
    if (!booking.barber) {
      return;
    }
    router.push('/(tabs)/services/choose-date');
  };

  const canContinue = Boolean(booking.barber);

  return (
    <View
      style={[
        styles.screen,
        { paddingBottom: Math.max(insets.bottom, 12), paddingTop: Math.max(insets.top, 10) },
      ]}>
      <BookAServiceCard style={{ marginBottom: 12 }} />
      <BookingFlowHeader compactTop step={2} title="Choose Your Barber" subtitle={subtitle} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 20) + 88 }]}
        showsVerticalScrollIndicator={false}>
        {barbers.map((barber) => (
          <Pressable
            key={barber.id}
            onPress={() => setBookingBarber(isSelected(barber) ? null : barber)}
            style={[styles.card, isSelected(barber) && styles.cardSelected]}>
            <View style={styles.avatar}>
              <Image source={barber.photo} style={styles.avatarImage} resizeMode="cover" />
            </View>
            <View style={styles.body}>
              <Text style={[styles.name, isSelected(barber) && styles.textOnLight]}>{barber.name}</Text>
              <Text style={[styles.meta, isSelected(barber) && styles.metaOnLight]}>
                Age: {barber.age} | {barber.experienceYears} years experience
              </Text>
              <Text style={[styles.rating, isSelected(barber) && styles.metaOnLight]}>
                ⭐ {barber.rating.toFixed(1)}
              </Text>
              <Text style={[styles.bio, isSelected(barber) && styles.bioOnLight]} numberOfLines={2}>
                {barber.bio}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        onPress={goNext}
        disabled={!canContinue}
        accessibilityRole="button"
        accessibilityLabel="Continue to choose date"
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
  card: {
    flexDirection: 'row',
    backgroundColor: '#3a3a3a',
    borderRadius: appTheme.radius.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    backgroundColor: '#d4d4d4',
    borderColor: appTheme.colors.accent,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#e8e8e8',
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  body: {
    flex: 1,
  },
  name: {
    color: appTheme.colors.textOnDark,
    fontSize: 17,
    fontWeight: '700',
    fontFamily: appTheme.fontFamily,
  },
  meta: {
    color: '#bdbdbd',
    fontSize: 13,
    marginTop: 4,
    fontFamily: appTheme.fontFamily,
  },
  rating: {
    color: appTheme.colors.accent,
    fontSize: 13,
    marginTop: 4,
    fontWeight: '700',
    fontFamily: appTheme.fontFamily,
  },
  bio: {
    color: '#c4c4c4',
    fontSize: 13,
    marginTop: 6,
    fontFamily: appTheme.fontFamily,
  },
  textOnLight: {
    color: appTheme.colors.textPrimary,
  },
  metaOnLight: {
    color: '#555',
  },
  bioOnLight: {
    color: '#444',
  },
});
