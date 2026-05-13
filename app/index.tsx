import { router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AppButton, ScreenShell } from '@/components/ui';
import { appTheme } from '@/constants/app-theme';

export default function SplashScreen() {
  return (
    <ScreenShell>
      <View style={styles.container}>
        <View style={styles.logoClip}>
          <Image
            source={require('@/assets/images/Adobe Express - file.png')}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.brand}>BARBERIFY</Text>
        <Text style={styles.subtitle}>Less Waiting, More Styling</Text>
      </View>

      <AppButton label="Get Started" onPress={() => router.push('/sign-in')} style={styles.button} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  logoClip: {
    width: 176,
    height: 176,
    borderRadius: 88,
    marginBottom: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(231, 231, 231, 0.55)',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  brand: {
    fontSize: 40,
    color: appTheme.colors.textOnDark,
    fontWeight: '800',
    letterSpacing: 0.9,
    fontFamily: appTheme.fontFamily,
  },
  subtitle: {
    color: '#e2e2e2',
    marginTop: 4,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: appTheme.fontFamily,
    textAlign: 'center',
  },
  button: {
    marginTop: 30,
    marginBottom: 34,
    width: '90%',
    alignSelf: 'center',
  },
});
