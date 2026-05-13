import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { appTheme } from '@/constants/app-theme';
import { useBarberify } from '@/context/BarberifyContext';

export default function TabLayout() {
  const router = useRouter();
  const { resetBooking } = useBarberify();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: appTheme.colors.accent,
        tabBarInactiveTintColor: '#b8b8b8',
        tabBarStyle: {
          backgroundColor: appTheme.colors.background,
          borderTopColor: '#3d3d3d',
          borderTopWidth: 1,
          height: 58,
          paddingBottom: 6,
          paddingTop: 12,
          shadowColor: appTheme.colors.shadow,
          shadowOpacity: 0.1,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: -2 },
          elevation: 5,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
        },
        tabBarLabelStyle: {
          fontFamily: appTheme.fontFamily,
          fontSize: 10,
          fontWeight: '600',
          paddingBottom: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size ?? 22} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color, size }) => <Ionicons name="cut" color={color} size={size ?? 22} />,
          tabBarItemStyle: {
            marginLeft: -8,
          },
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            resetBooking();
            router.replace('/(tabs)/services');
          },
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Appointments',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size ?? 22} />,
        }}
      />
      <Tabs.Screen
        name="reviews"
        options={{
          title: 'Reviews',
          tabBarIcon: ({ color, size }) => <Ionicons name="star" color={color} size={size ?? 22} />,
          tabBarItemStyle: {
            marginRight: -8,
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size ?? 22} />,
        }}
      />
    </Tabs>
  );
}
