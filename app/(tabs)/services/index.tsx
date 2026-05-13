import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookAServiceCard } from '@/components/booking/BookAServiceCard';
import { BookingFlowHeader } from '@/components/booking/BookingFlowHeader';
import { appTheme } from '@/constants/app-theme';
import { useBarberify, type Package, type Service } from '@/context/BarberifyContext';

export default function ServicesStepScreen() {
  const insets = useSafeAreaInsets();
  const { booking, services, packages, setBookingSelection } = useBarberify();

  const selection = booking.selection;
  const subtitle = 'Select a service for your Haircut';

  const isServiceSelected = (s: Service) =>
    selection?.kind === 'service' && selection.service.id === s.id;
  const isPackageSelected = (p: Package) =>
    selection?.kind === 'package' && selection.pkg.id === p.id;

  const pickService = (service: Service) => {
    const alreadySelected = isServiceSelected(service);
    setBookingSelection(alreadySelected ? null : { kind: 'service', service });
  };

  const pickPackage = (pkg: Package) => {
    const alreadySelected = isPackageSelected(pkg);
    setBookingSelection(alreadySelected ? null : { kind: 'package', pkg });
  };

  const goNext = () => {
    if (!selection) {
      return;
    }
    router.push('/(tabs)/services/choose-barber');
  };

  const canContinue = Boolean(selection);

  return (
    <View
      style={[
        styles.screen,
        { paddingBottom: Math.max(insets.bottom, 12), paddingTop: Math.max(insets.top, 10) },
      ]}>
      <BookAServiceCard style={{ marginBottom: 12 }} />
      <BookingFlowHeader compactTop step={1} title="Services" subtitle={subtitle} hideBack />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 20) + 88 }]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Individual Services</Text>
        {services.map((service) => (
          <Pressable
            key={service.id}
            onPress={() => pickService(service)}
            style={[styles.card, isServiceSelected(service) && styles.cardSelected]}>
            <View style={styles.cardRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="cut" size={22} color="#c62828" />
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, isServiceSelected(service) && styles.cardTitleOnLight]}>
                  {service.name}
                </Text>
                <Text style={[styles.cardDesc, isServiceSelected(service) && styles.cardDescOnLight]}>
                  {service.description}
                </Text>
                <Text style={[styles.serviceMeta, isServiceSelected(service) && styles.cardDescOnLight]}>
                  Est. 30 - 60 mins
                </Text>
              </View>
              <Text style={[styles.price, isServiceSelected(service) && styles.priceOnLight]}>
                P{service.price}
              </Text>
            </View>
          </Pressable>
        ))}

        <Text style={[styles.sectionLabel, styles.sectionPackages]}>Packages</Text>
        {packages.map((pkg) => (
          <Pressable
            key={pkg.id}
            onPress={() => pickPackage(pkg)}
            style={[styles.packageCard, isPackageSelected(pkg) && styles.cardSelected]}>
            <View style={styles.packageTop}>
              <View style={styles.packageTitleRow}>
                <Text style={[styles.packageTitle, isPackageSelected(pkg) && styles.cardTitleOnLight]}>
                  {pkg.name}
                </Text>
                {pkg.badge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{pkg.badge}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={[styles.packagePrice, isPackageSelected(pkg) && styles.priceOnLight]}>
                ₱{pkg.price}
              </Text>
            </View>
            <View style={styles.packageIncludesRow}>
              <Ionicons name="briefcase-outline" size={16} color={isPackageSelected(pkg) ? '#555' : '#9a9a9a'} />
              <Text style={[styles.packageIncludes, isPackageSelected(pkg) && styles.packageIncludesOnLight]}>
                {pkg.includes}
              </Text>
            </View>
            <Text style={[styles.packageEst, isPackageSelected(pkg) && styles.packageEstOnLight]}>
              Est. 30 - 60 mins
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        onPress={goNext}
        disabled={!canContinue}
        accessibilityRole="button"
        accessibilityLabel="Continue to choose barber"
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
    paddingTop: 0,
    position: 'relative',
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
  scrollView: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 24,
  },
  sectionLabel: {
    color: appTheme.colors.textOnDark,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    fontFamily: appTheme.fontFamily,
  },
  sectionPackages: {
    marginTop: 20,
  },
  card: {
    backgroundColor: '#3a3a3a',
    borderRadius: appTheme.radius.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  packageCard: {
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
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    color: appTheme.colors.textOnDark,
    fontSize: 17,
    fontWeight: '700',
    fontFamily: appTheme.fontFamily,
  },
  cardDesc: {
    color: '#c4c4c4',
    fontSize: 13,
    marginTop: 4,
    fontFamily: appTheme.fontFamily,
  },
  serviceMeta: {
    color: '#d0d0d0',
    fontSize: 12,
    marginTop: 6,
    fontFamily: appTheme.fontFamily,
  },
  price: {
    color: appTheme.colors.textOnDark,
    fontWeight: '800',
    fontSize: 16,
    fontFamily: appTheme.fontFamily,
  },
  cardTitleOnLight: {
    color: appTheme.colors.textPrimary,
  },
  cardDescOnLight: {
    color: '#4a4a4a',
  },
  priceOnLight: {
    color: appTheme.colors.textPrimary,
  },
  packageIncludesOnLight: {
    color: '#444',
  },
  packageEstOnLight: {
    color: '#666',
  },
  packageTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  packageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  packageTitle: {
    color: appTheme.colors.textOnDark,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: appTheme.fontFamily,
  },
  badge: {
    backgroundColor: appTheme.colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: '#1a1a1a',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: appTheme.fontFamily,
  },
  packagePrice: {
    color: appTheme.colors.textOnDark,
    fontWeight: '800',
    fontSize: 16,
    fontFamily: appTheme.fontFamily,
  },
  packageIncludesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  packageIncludes: {
    color: '#b0b0b0',
    fontSize: 13,
    flex: 1,
    fontFamily: appTheme.fontFamily,
  },
  packageEst: {
    color: '#8f8f8f',
    fontSize: 12,
    fontFamily: appTheme.fontFamily,
  },
});
