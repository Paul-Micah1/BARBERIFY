import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppButton, ScreenShell } from '@/components/ui';
import { appTheme } from '@/constants/app-theme';
import { useBarberify } from '@/context/BarberifyContext';

function isValidSignInIdentifier(value: string) {
  const normalized = value.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
  const isPhone = /^\d{11}$/.test(normalized);
  return isEmail || isPhone;
}

export default function SignInScreen() {
  const { signIn } = useBarberify();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!isValidSignInIdentifier(emailOrPhone)) {
      Alert.alert('Invalid email', 'Invalid email.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Invalid password', 'Invalid password.');
      return;
    }
    const result = signIn(emailOrPhone.trim(), password);
    if (!result.ok) {
      if (result.credentialError === 'password') {
        Alert.alert('Invalid password', 'Invalid password.');
      } else {
        Alert.alert('Invalid email', 'Invalid email.');
      }
      return;
    }
    router.replace('/(tabs)');
  };

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
        <Text style={styles.tagline}>Less Waiting, More Styling</Text>

        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.hint}>Sign in to your account</Text>
          <TextInput
            placeholder="Email or Phone Number"
            placeholderTextColor={appTheme.colors.textMuted}
            style={styles.input}
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={appTheme.colors.textMuted}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <AppButton label="Sign In" onPress={handleSignIn} style={styles.button} />
        </View>

        <Text style={styles.footerText}>
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" style={styles.link}>
            Sign Up
          </Link>
        </Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logoClip: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: 'center',
    marginBottom: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  brand: {
    color: appTheme.colors.textOnDark,
    fontSize: 42,
    fontWeight: '800',
    fontFamily: appTheme.fontFamily,
    textAlign: 'center',
  },
  tagline: {
    color: '#e2e2e2',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 15,
    fontFamily: appTheme.fontFamily,
  },
  card: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: appTheme.radius.lg,
    padding: 16,
  },
  title: {
    color: appTheme.colors.textPrimary,
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 2,
    fontFamily: appTheme.fontFamily,
  },
  hint: {
    color: appTheme.colors.textMuted,
    marginBottom: 12,
    fontSize: 14,
    fontFamily: appTheme.fontFamily,
  },
  input: {
    backgroundColor: appTheme.colors.mutedSurface,
    borderRadius: appTheme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontFamily: appTheme.fontFamily,
  },
  button: {
    marginTop: 8,
  },
  footerText: {
    color: appTheme.colors.textOnDark,
    textAlign: 'center',
    marginTop: 18,
    fontFamily: appTheme.fontFamily,
  },
  link: {
    color: appTheme.colors.accent,
    fontWeight: '700',
  },
});
