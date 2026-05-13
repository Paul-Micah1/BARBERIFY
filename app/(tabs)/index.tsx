import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { appTheme } from '@/constants/app-theme';
import { useBarberify } from '@/context/BarberifyContext';

export default function HomeTabScreen() {
  const insets = useSafeAreaInsets();
  const { currentUser, services, barbers } = useBarberify();

  const goServices = () => {
    router.push('/(tabs)/services');
  };

  const goReviews = () => {
    router.push('/(tabs)/reviews');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: 100, paddingTop: Math.max(insets.top, 12) }]}
    >
      <View style={styles.pageHero}>
        <View style={styles.pageHeroGlow} />
        <View style={styles.pageHeroInner}>
          <View style={styles.pageHeroIconCircle}>
            <Image
              source={require('@/assets/images/Adobe Express - file.png')}
              style={styles.heroLogoImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.pageHeroText}>
            <Text style={styles.heroBrand}>BARBERIFY</Text>
            <Text style={styles.heroWelcome}>Welcome, {currentUser?.fullName?.trim() || 'Guest'}!</Text>
            <Text style={styles.heroSub}>Book cuts, packages, and your favorite barber in a few taps.</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Quick Book</Text>
        <Pressable onPress={goServices}>
          <Text style={[styles.sectionAction, styles.highlightAction]}>See all</Text>
        </Pressable>
      </View>
      <View style={styles.servicesGrid}>
        {services.slice(0, 3).map((service) => (
          <Pressable key={service.id} style={styles.serviceCard} onPress={goServices}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceMeta}>
              P{service.price} • 30 - 60 min
            </Text>
            <Text style={styles.bookNow}>Book Now</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Meet Our Barbers</Text>
        <Pressable onPress={goReviews}>
          <Text style={[styles.sectionAction, styles.highlightAction]}>Rate here</Text>
        </Pressable>
      </View>
      {barbers.map((barber) => (
        <View key={barber.id} style={styles.barberCard}>
          <View style={styles.barberAvatar}>
            <Image source={barber.photo} style={styles.barberAvatarImage} resizeMode="cover" />
          </View>
          <View style={styles.barberInfo}>
            <Text style={styles.barberName}>{barber.name}</Text>
            <Text style={styles.barberMeta}>
              Age {barber.age} • {barber.experienceYears} yrs exp • ⭐ {barber.rating}
            </Text>
            <Text style={styles.barberMeta}>{barber.bio}</Text>
          </View>
        </View>
      ))}
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
  },
  pageHero: {
    marginBottom: 18,
    borderRadius: appTheme.radius.lg,
    overflow: 'hidden',
    backgroundColor: '#3a3a3a',
    borderWidth: 1,
    borderColor: '#555',
  },
  pageHeroGlow: {
    height: 4,
    backgroundColor: appTheme.colors.accent,
  },
  pageHeroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  pageHeroIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  /** Fills the circle; cover crops the asset’s black square corners so only the emblem shows. */
  heroLogoImage: {
    width: '100%',
    height: '100%',
  },
  pageHeroText: {
    flex: 1,
    minWidth: 0,
  },
  heroBrand: {
    color: appTheme.colors.textOnDark,
    fontSize: 22,
    fontWeight: '900',
    fontFamily: appTheme.fontFamily,
  },
  heroWelcome: {
    color: '#ececec',
    fontSize: 15,
    marginTop: 4,
    fontWeight: '600',
    fontFamily: appTheme.fontFamily,
  },
  heroSub: {
    color: '#b8b8b8',
    fontSize: 12,
    marginTop: 6,
    lineHeight: 17,
    fontFamily: appTheme.fontFamily,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    color: appTheme.colors.textOnDark,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: appTheme.fontFamily,
  },
  sectionAction: {
    color: '#d8d8d8',
    fontSize: 12,
    fontFamily: appTheme.fontFamily,
  },
  highlightAction: {
    color: '#e1b64c',
  },
  servicesGrid: {
    flexDirection: 'column',
    gap: 10,
  },
  serviceCard: {
    width: '100%',
    backgroundColor: '#3f3f3f',
    borderRadius: 14,
    padding: 16,
  },
  serviceName: {
    color: appTheme.colors.textOnDark,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: appTheme.fontFamily,
  },
  serviceMeta: {
    color: '#d9d9d9',
    fontSize: 13,
    marginBottom: 10,
    fontFamily: appTheme.fontFamily,
  },
  bookNow: {
    backgroundColor: '#ffffff',
    color: '#121212',
    textAlign: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    overflow: 'hidden',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: appTheme.fontFamily,
  },
  barberCard: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  barberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#e7e7e7',
  },
  barberAvatarImage: {
    width: '100%',
    height: '100%',
  },
  barberInfo: {
    marginLeft: 10,
    flex: 1,
  },
  barberName: {
    color: appTheme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: appTheme.fontFamily,
  },
  barberMeta: {
    color: appTheme.colors.textMuted,
    fontSize: 12,
    fontFamily: appTheme.fontFamily,
  },
});
