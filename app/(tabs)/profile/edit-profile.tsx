import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui';
import { appTheme } from '@/constants/app-theme';
import { useBarberify } from '@/context/BarberifyContext';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { currentUser, updateProfile } = useBarberify();

  const [fullName, setFullName] = useState(currentUser?.fullName ?? '');
  const [age, setAge] = useState(currentUser?.age != null ? String(currentUser.age) : '');
  const [gender, setGender] = useState(currentUser?.gender ?? '');
  const [genderMenuOpen, setGenderMenuOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!currentUser) {
    return null;
  }

  const handleSave = () => {
    if (!fullName.trim()) {
      Alert.alert('Missing information', 'Please enter your name.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert('Password mismatch', 'New password and confirmation must match.');
      return;
    }

    updateProfile({
      fullName: fullName.trim(),
      emailOrPhone: currentUser.emailOrPhone,
      age: age.trim() ? Number(age) : null,
      gender: gender.trim() ? gender.trim() : null,
      newPassword: newPassword ? newPassword : undefined,
    });

    router.push('/(tabs)/profile');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 24) + 72 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Edit Profile</Text>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Personal Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
          />
          <Text style={styles.fieldLabel}>Email or Phone</Text>
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyText}>{currentUser.emailOrPhone}</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Age"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
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
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Change Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Text style={styles.note}>Leave password fields blank to keep your current password.</Text>
        </View>

        <AppButton label="Save Changes" onPress={handleSave} style={styles.actionButton} />
        <AppButton
          label="Cancel"
          secondary
          onPress={() => router.push('/(tabs)/profile')}
          style={styles.actionButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  header: {
    color: appTheme.colors.textOnDark,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 18,
    fontFamily: appTheme.fontFamily,
  },
  sectionCard: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: appTheme.radius.lg,
    padding: 18,
    marginBottom: 16,
    shadowColor: appTheme.colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  sectionLabel: {
    color: appTheme.colors.textPrimary,
    fontWeight: '800',
    marginBottom: 14,
    fontFamily: appTheme.fontFamily,
  },
  fieldLabel: {
    color: appTheme.colors.textMuted,
    fontSize: 12,
    marginBottom: 6,
    fontFamily: appTheme.fontFamily,
  },
  readOnlyField: {
    backgroundColor: appTheme.colors.mutedSurface,
    borderRadius: appTheme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    opacity: 0.85,
  },
  readOnlyText: {
    color: appTheme.colors.textMuted,
    fontFamily: appTheme.fontFamily,
  },
  input: {
    backgroundColor: appTheme.colors.mutedSurface,
    borderRadius: appTheme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: appTheme.colors.textPrimary,
    fontFamily: appTheme.fontFamily,
    marginBottom: 12,
  },
  dropdownWrapper: {
    marginBottom: 0,
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
  note: {
    color: appTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: appTheme.fontFamily,
  },
  actionButton: {
    marginBottom: 12,
  },
});
