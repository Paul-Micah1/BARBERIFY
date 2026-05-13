import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppButton, ScreenShell } from '@/components/ui';
import { appTheme } from '@/constants/app-theme';
import { useBarberify } from '@/context/BarberifyContext';

const ALLOWED_EMAIL_SUFFIXES = [
  '@gmail.com',
  '@yahoo.com',
  '@outlook.com',
  '@hotmail.com',
  '@email.com',
  '@icloud.com',
  '@live.com',
  '@protonmail.com',
] as const;

function isAllowedSignupEmail(raw: string): boolean {
  const t = raw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) {
    return false;
  }
  return ALLOWED_EMAIL_SUFFIXES.some((suffix) => t.endsWith(suffix));
}

function isSignupPhone(raw: string): boolean {
  return /^\d{11}$/.test(raw.trim());
}

function isValidSignupContact(raw: string): boolean {
  return isAllowedSignupEmail(raw) || isSignupPhone(raw);
}

export default function SignUpScreen() {
  const { signUp } = useBarberify();
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [genderMenuOpen, setGenderMenuOpen] = useState(false);
  const [errorPopup, setErrorPopup] = useState<{ title: string; message: string } | null>(null);

  const showPopup = (title: string, message: string) => {
    setErrorPopup({ title, message });
  };

  const handleSignUp = async () => {
    if (!fullName.trim()) {
      showPopup('Missing name', 'Please enter your full name.');
      return;
    }

    const contact = emailOrPhone.trim();
    if (!isValidSignupContact(emailOrPhone)) {
      if (contact.includes('@')) {
        showPopup(
          'Invalid email',
          'Use an email ending with an allowed domain (e.g. @gmail.com, @yahoo.com, @outlook.com, @email.com).',
        );
      } else if (/^\d+$/.test(contact)) {
        showPopup('Invalid phone number', 'Phone number must be exactly 11 digits.');
      } else {
        showPopup('Invalid email or phone', 'Enter a valid email or an 11-digit phone number.');
      }
      return;
    }

    if (!age.trim()) {
      showPopup('Missing age', 'Please enter your age.');
      return;
    }
    if (Number(age) <= 0 || Number.isNaN(Number(age))) {
      showPopup('Invalid age', 'Please enter a valid age.');
      return;
    }
    if (!gender) {
      showPopup('Missing gender', 'Please select your gender.');
      return;
    }
    if (password.length < 8) {
      showPopup('Invalid password', 'Password must be 8 characters or more.');
      return;
    }

    const result = signUp({
      fullName: fullName.trim(),
      emailOrPhone: contact,
      password,
      age: Number(age),
      gender,
    });
    if (!result.ok) {
      showPopup('Sign up failed', result.message ?? 'Unable to create account.');
      return;
    }
    router.replace('/(tabs)');
  };

  return (
    <>
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.hint}>Sign up to get started</Text>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor={appTheme.colors.textMuted}
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />
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
          <TextInput
            placeholder="Age"
            placeholderTextColor={appTheme.colors.textMuted}
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
          <View style={styles.dropdownWrapper}>
            <Text style={styles.dropdownLabel}>Gender</Text>
            <Pressable onPress={() => setGenderMenuOpen((prev) => !prev)} style={styles.dropdownValue}>
              <Text style={styles.dropdownValueText}>{gender || 'Select Gender'}</Text>
            </Pressable>
            {genderMenuOpen ? (
              <View style={styles.dropdownList}>
                {['Male', 'Female'].map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => {
                      setGender(option);
                      setGenderMenuOpen(false);
                    }}
                    style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>{option}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
          <AppButton label="Sign Up" onPress={handleSignUp} style={styles.button} />
        </View>

        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Link href="/sign-in" style={styles.link}>
            Sign In
          </Link>
        </Text>
      </View>
    </ScreenShell>

      <Modal
        visible={errorPopup !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setErrorPopup(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setErrorPopup(null)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>{errorPopup?.title}</Text>
            <Text style={styles.modalMessage}>{errorPopup?.message}</Text>
            <Pressable style={styles.modalOk} onPress={() => setErrorPopup(null)}>
              <Text style={styles.modalOkText}>OK</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
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
    marginTop: 10,
  },
  dropdownWrapper: {
    marginBottom: 12,
  },
  dropdownLabel: {
    color: appTheme.colors.textMuted,
    marginBottom: 6,
    fontSize: 12,
    fontFamily: appTheme.fontFamily,
  },
  dropdownValue: {
    backgroundColor: appTheme.colors.mutedSurface,
    borderRadius: appTheme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownValueText: {
    color: appTheme.colors.textPrimary,
    fontFamily: appTheme.fontFamily,
  },
  dropdownList: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: appTheme.radius.md,
    marginTop: 6,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownItemText: {
    color: appTheme.colors.textPrimary,
    fontFamily: appTheme.fontFamily,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  modalCard: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: appTheme.radius.lg,
    padding: 22,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: appTheme.colors.textPrimary,
    marginBottom: 10,
    fontFamily: appTheme.fontFamily,
  },
  modalMessage: {
    fontSize: 15,
    color: appTheme.colors.textMuted,
    lineHeight: 22,
    marginBottom: 18,
    fontFamily: appTheme.fontFamily,
  },
  modalOk: {
    alignSelf: 'flex-end',
    backgroundColor: appTheme.colors.textPrimary,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: appTheme.radius.md,
  },
  modalOkText: {
    color: appTheme.colors.textOnDark,
    fontWeight: '700',
    fontSize: 15,
    fontFamily: appTheme.fontFamily,
  },
});
