import { Ionicons } from '@expo/vector-icons';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui';
import { appTheme } from '@/constants/app-theme';
import { useBarberify } from '@/context/BarberifyContext';

export default function ProfileTabScreen() {
  const insets = useSafeAreaInsets();
  const { currentUser, signOut } = useBarberify();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 20) + 72, paddingTop: Math.max(insets.top, 12) }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageHero}>
        <View style={styles.pageHeroGlow} />
        <View style={styles.pageHeroInner}>
          <View style={styles.pageHeroIconCircle}>
            <Ionicons name="person" size={28} color="#1a1a1a" />
          </View>
          <View style={styles.pageHeroText}>
            <Text style={styles.heroTitle}>Profile</Text>
            <Text style={styles.heroSub}>Manage your details and sign out securely.</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={44} color="#5c5c5c" />
        </View>
        <Text style={styles.name}>{currentUser?.fullName ?? 'Guest'}</Text>
        <Text style={styles.subtitle}>Your personal account information</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoValue}>{currentUser?.fullName ?? 'Guest'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Contact</Text>
          <Text style={styles.infoValue}>{currentUser?.emailOrPhone ?? 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Age</Text>
          <Text style={styles.infoValue}>{currentUser?.age != null ? currentUser.age : 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Gender</Text>
          <Text style={styles.infoValue}>{currentUser?.gender ?? 'N/A'}</Text>
        </View>
      </View>

      <AppButton
        label="Edit Profile"
        secondary
        onPress={() => router.push('/(tabs)/profile/edit-profile')}
        style={styles.buttonSpacing}
      />
      <AppButton
        label="Sign Out"
        danger
        onPress={() => {
          const doSignOut = () => {
            signOut();
            router.replace('/sign-in');
          };
          if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
            if (window.confirm('Logout\n\nSign out?')) {
              doSignOut();
            }
            return;
          }
          Alert.alert('Logout', 'Sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: doSignOut },
          ]);
        }}
        style={styles.buttonSpacing}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: appTheme.colors.background,
  },
  content: {
    paddingHorizontal: 20,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: appTheme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageHeroText: {
    flex: 1,
  },
  heroTitle: {
    color: appTheme.colors.textOnDark,
    fontSize: 22,
    fontWeight: '800',
    fontFamily: appTheme.fontFamily,
  },
  heroSub: {
    color: '#c8c8c8',
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
    fontFamily: appTheme.fontFamily,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 48,
    backgroundColor: '#c4c4c4',
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  name: {
    textAlign: 'center',
    color: appTheme.colors.textOnDark,
    fontSize: 24,
    fontWeight: '900',
    fontFamily: appTheme.fontFamily,
  },
  subtitle: {
    color: '#d0d0d0',
    marginTop: 6,
    textAlign: 'center',
    fontFamily: appTheme.fontFamily,
  },
  infoCard: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: appTheme.radius.lg,
    padding: 18,
    marginBottom: 20,
  },
  infoRow: {
    marginBottom: 14,
  },
  infoLabel: {
    color: appTheme.colors.textMuted,
    fontSize: 12,
    fontFamily: appTheme.fontFamily,
    marginBottom: 4,
  },
  infoValue: {
    color: appTheme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: appTheme.fontFamily,
  },
  buttonSpacing: {
    marginBottom: 10,
  },
});
