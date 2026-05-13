import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';

export type Service = {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
};

export type Package = {
  id: string;
  name: string;
  price: number;
  includes: string;
  estimatedMinutes: number;
  badge?: string;
};

export type Barber = {
  id: string;
  name: string;
  age: number;
  experienceYears: number;
  rating: number;
  bio: string;
  photo: ImageSourcePropType;
};

export type BookingSelection =
  | { kind: 'service'; service: Service }
  | { kind: 'package'; pkg: Package };

export type AppointmentStatus = 'booked' | 'completed' | 'cancelled';

export type AppointmentRecord = {
  id: string;
  selection: BookingSelection;
  barber: Barber;
  dateIso: string;
  timeSlot: string;
  status: AppointmentStatus;
};

type AuthUser = {
  fullName: string;
  emailOrPhone: string;
  password: string;
  age?: number | null;
  gender?: string | null;
};

type AuthResult = {
  ok: boolean;
  message?: string;
  /** When sign-in fails, which credential was wrong (for client messaging). */
  credentialError?: 'email' | 'password';
};

type BookingDraft = {
  selection: BookingSelection | null;
  barber: Barber | null;
  date: Date | null;
  timeSlot: string | null;
};

type BarberifyContextType = {
  currentUser: Omit<AuthUser, 'password'> | null;
  services: Service[];
  packages: Package[];
  barbers: Barber[];
  booking: BookingDraft;
  appointments: AppointmentRecord[];
  setBookingSelection: (selection: BookingSelection | null) => void;
  setBookingBarber: (barber: Barber | null) => void;
  setBookingDate: (date: Date | null) => void;
  setBookingTimeSlot: (slot: string | null) => void;
  resetBooking: () => void;
  confirmBooking: () => void;
  cancelAppointment: (appointmentId: string) => void;
  updateProfile: (payload: { fullName: string; emailOrPhone: string; age: number | null; gender: string | null; newPassword?: string }) => void;
  signUp: (payload: AuthUser) => AuthResult;
  signIn: (emailOrPhone: string, password: string) => AuthResult;
  signOut: () => void;
};

const servicesData: Service[] = [
  {
    id: 's1',
    name: 'Haircut',
    price: 150,
    durationMinutes: 30,
    description: 'Classic cut with clean finish.',
  },
  {
    id: 's2',
    name: 'Beard Trim',
    price: 80,
    durationMinutes: 20,
    description: 'Shape and line up your beard.',
  },
  {
    id: 's3',
    name: 'Shave',
    price: 100,
    durationMinutes: 20,
    description: 'Smooth shave with hot towel prep.',
  },
  {
    id: 's4',
    name: 'Hair Wash',
    price: 70,
    durationMinutes: 15,
    description: 'Refresh and scalp care.',
  },
];

const packagesData: Package[] = [
  {
    id: 'p1',
    name: 'Basic Grooming Package',
    price: 200,
    includes: 'Haircut + Hair Wash',
    estimatedMinutes: 40,
  },
  {
    id: 'p2',
    name: "Gentleman's Package",
    price: 280,
    includes: 'Haircut + Beard Trim + Styling',
    estimatedMinutes: 55,
  },
  {
    id: 'p3',
    name: 'Full Groom Package',
    price: 350,
    includes: 'Haircut + Shave + Hair Wash + Styling',
    estimatedMinutes: 70,
  },
  {
    id: 'p4',
    name: 'VIP Package',
    price: 500,
    includes: 'Haircut + Beard Trim + Shave + Hair Wash + Styling + Massage',
    estimatedMinutes: 90,
    badge: 'BEST VALUE',
  },
];

const barbersData: Barber[] = [
  {
    id: 'b1',
    name: 'Jhon Oidiple Dagmil',
    age: 25,
    experienceYears: 5,
    rating: 4.8,
    bio: 'Fade specialist with attention to detail.',
    photo: require('@/assets/images/pacs.jpg'),
  },
  {
    id: 'b2',
    name: 'Earl Ledesma',
    age: 32,
    experienceYears: 10,
    rating: 4.9,
    bio: 'Classic cuts and hot towel shaves.',
    photo: require('@/assets/images/andre.png'),
  },
  {
    id: 'b3',
    name: 'Carl Christian Gomez',
    age: 27,
    experienceYears: 6,
    rating: 4.7,
    bio: 'Beard sculpting and modern styles.',
    photo: require('@/assets/images/gomez.png'),
  },
];

const emptyBooking: BookingDraft = {
  selection: null,
  barber: null,
  date: null,
  timeSlot: null,
};

const BarberifyContext = createContext<BarberifyContextType | undefined>(undefined);

export function getSelectionTitle(selection: BookingSelection): string {
  return selection.kind === 'service' ? selection.service.name : selection.pkg.name;
}

export function formatSelectionPrice(selection: BookingSelection): string {
  const price = selection.kind === 'service' ? selection.service.price : selection.pkg.price;
  return `P${price}`;
}

export function formatSelectionDuration(selection: BookingSelection): string {
  if (selection.kind === 'service') {
    return `${selection.service.durationMinutes} min`;
  }
  return `Est. ${selection.pkg.estimatedMinutes} min`;
}

export function BarberifyProvider({ children }: { children: React.ReactNode }) {
  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>([
    {
      fullName: 'TestUser',
      emailOrPhone: 'testuser@gmail.com',
      password: 'password123',
      age: 26,
    },
  ]);
  const [currentUser, setCurrentUser] = useState<Omit<AuthUser, 'password'> | null>(null);
  const [booking, setBooking] = useState<BookingDraft>(emptyBooking);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);

  const setBookingSelection = useCallback((selection: BookingSelection | null) => {
    setBooking((prev) => ({ ...prev, selection }));
  }, []);

  const setBookingBarber = useCallback((barber: Barber | null) => {
    setBooking((prev) => ({ ...prev, barber }));
  }, []);

  const setBookingDate = useCallback((date: Date | null) => {
    setBooking((prev) => ({ ...prev, date }));
  }, []);

  const setBookingTimeSlot = useCallback((timeSlot: string | null) => {
    setBooking((prev) => ({ ...prev, timeSlot }));
  }, []);

  const resetBooking = useCallback(() => {
    setBooking(emptyBooking);
  }, []);

  const confirmBooking = useCallback(() => {
    setBooking((current) => {
      const { selection, barber, date, timeSlot } = current;
      if (!selection || !barber || !date || !timeSlot) {
        return current;
      }
      const record: AppointmentRecord = {
        id: `${Date.now()}`,
        selection,
        barber,
        dateIso: date.toISOString(),
        timeSlot,
        status: 'booked',
      };
      setAppointments((prev) => [record, ...prev]);
      return emptyBooking;
    });
  }, []);

  const signUp = (payload: AuthUser): AuthResult => {
    const normalized = payload.emailOrPhone.trim().toLowerCase();
    const exists = registeredUsers.some((user) => user.emailOrPhone.toLowerCase() === normalized);
    if (exists) {
      return { ok: false, message: 'Account already exists. Please sign in.' };
    }

    const nextUser = {
      ...payload,
      emailOrPhone: normalized,
      age: payload.age ?? null,
      gender: payload.gender ?? null,
    };
    setRegisteredUsers((prev) => [...prev, nextUser]);
    setCurrentUser({
      fullName: nextUser.fullName,
      emailOrPhone: nextUser.emailOrPhone,
      age: nextUser.age ?? null,
      gender: nextUser.gender ?? null,
    });
    return { ok: true };
  };

  const signIn = (emailOrPhone: string, password: string): AuthResult => {
    const normalized = emailOrPhone.trim().toLowerCase();
    const user = registeredUsers.find((u) => u.emailOrPhone.toLowerCase() === normalized);
    if (!user) {
      return { ok: false, credentialError: 'email' };
    }
    if (user.password !== password) {
      return { ok: false, credentialError: 'password' };
    }
    setCurrentUser({
      fullName: user.fullName,
      emailOrPhone: user.emailOrPhone,
      age: user.age ?? null,
      gender: user.gender ?? null,
    });
    return { ok: true };
  };

  const cancelAppointment = useCallback((appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === appointmentId && appointment.status === 'booked'
          ? { ...appointment, status: 'cancelled' as const }
          : appointment,
      ),
    );
  }, []);

  const updateProfile = useCallback(
    (payload: { fullName: string; emailOrPhone: string; age: number | null; gender: string | null; newPassword?: string }) => {
      setCurrentUser((current) => {
        if (!current) {
          return null;
        }

        const normalizedContact = payload.emailOrPhone.trim().toLowerCase();
        setRegisteredUsers((prev) =>
          prev.map((user) => {
            if (user.emailOrPhone.toLowerCase() !== current.emailOrPhone.toLowerCase()) {
              return user;
            }
            return {
              ...user,
              fullName: payload.fullName,
              emailOrPhone: normalizedContact,
              age: payload.age,
              gender: payload.gender,
              password: payload.newPassword ? payload.newPassword : user.password,
            };
          }),
        );

        return {
          fullName: payload.fullName,
          emailOrPhone: normalizedContact,
          age: payload.age,
          gender: payload.gender,
        };
      });
    },
    [],
  );

  const signOut = () => {
    setCurrentUser(null);
  };

  const value = useMemo(
    () => ({
      currentUser,
      services: servicesData,
      packages: packagesData,
      barbers: barbersData,
      booking,
      appointments,
      setBookingSelection,
      setBookingBarber,
      setBookingDate,
      setBookingTimeSlot,
      resetBooking,
      confirmBooking,
      cancelAppointment,
      updateProfile,
      signUp,
      signIn,
      signOut,
    }),
    [
      appointments,
      booking,
      cancelAppointment,
      confirmBooking,
      currentUser,
      registeredUsers,
      resetBooking,
      setBookingBarber,
      setBookingDate,
      setBookingSelection,
      setBookingTimeSlot,
      signIn,
      signUp,
      updateProfile,
    ],
  );

  return <BarberifyContext.Provider value={value}>{children}</BarberifyContext.Provider>;
}

export function useBarberify() {
  const context = useContext(BarberifyContext);
  if (!context) {
    throw new Error('useBarberify must be used within BarberifyProvider');
  }
  return context;
}
