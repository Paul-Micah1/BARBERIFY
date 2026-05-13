import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/components/ui';
import { appTheme } from '@/constants/app-theme';
import { useBarberify } from '@/context/BarberifyContext';

type ReviewItem = {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
};

export default function ReviewsTabScreen() {
  const insets = useSafeAreaInsets();
  const { barbers, currentUser } = useBarberify();
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittedReviews, setSubmittedReviews] = useState<ReviewItem[]>([]);
  const [barberRatings, setBarberRatings] = useState<Record<string, number>>(
    Object.fromEntries(barbers.map((barber) => [barber.id, 0])),
  );
  const [barberRated, setBarberRated] = useState<Record<string, boolean>>(
    Object.fromEntries(barbers.map((barber) => [barber.id, false])),
  );

  const setRating = (rating: number) => {
    setReviewRating((prev) => (prev === rating ? 0 : rating));
  };

  const setBarberRating = (barberId: string, value: number) => {
    setBarberRatings((prev) => {
      const current = prev[barberId] ?? 0;
      const nextRating = current === value ? 0 : value;
      setBarberRated((ratedPrev) => ({ ...ratedPrev, [barberId]: nextRating > 0 }));
      return { ...prev, [barberId]: nextRating };
    });
  };

  const deleteReview = (reviewId: string) => {
    setSubmittedReviews((prev) => prev.filter((review) => review.id !== reviewId));
  };

  const submitReview = () => {
    if (!reviewText.trim()) {
      Alert.alert('Review Required', 'Please add a suggestion or feedback before submitting.');
      return;
    }

    const displayName = currentUser?.fullName?.trim() || 'Guest';
    const newReview = {
      id: `${Date.now()}`,
      name: displayName,
      rating: reviewRating,
      text: reviewText.trim(),
      date: new Date().toLocaleDateString('en-US'),
    };

    setSubmittedReviews((prev) => [newReview, ...prev]);
    setReviewText('');
    setReviewRating(0);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 24) + 72 }]}
    >
      <View style={[styles.pageHero, { marginTop: Math.max(insets.top, 12) }]}>
        <View style={styles.pageHeroGlow} />
        <View style={styles.pageHeroInner}>
          <View style={styles.pageHeroIconCircle}>
            <Ionicons name="star" size={22} color="#1a1a1a" />
          </View>
          <View style={styles.pageHeroTextCol}>
            <Text style={styles.header}>Reviews</Text>
            <Text style={styles.sub}>Share your experience and help others choose Barberify.</Text>
          </View>
        </View>
      </View>

      <View style={styles.contactCard}>
        <Text style={styles.contactTitle}>Barberify</Text>
        <Text style={styles.contactMeta}>Your trusted barbershop partner</Text>
        <View style={styles.contactRow}>
          <Ionicons name="call" size={16} color={appTheme.colors.textMuted} />
          <Text style={styles.contactText}>09502238935</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="mail" size={16} color={appTheme.colors.textMuted} />
          <Text style={styles.contactText}>barberify@gmail.com</Text>
        </View>
      </View>

      <View style={styles.ratingCard}>
        <Text style={styles.ratingLabel}>App Rating</Text>
        <Text style={styles.ratingValue}>4.8</Text>
        <View style={styles.ratingStarCircle}>
          <Ionicons name="star" size={22} color={appTheme.colors.accent} />
        </View>
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.sectionTitle}>Leave a Review</Text>
        <Text style={styles.sectionHint}>Your Rating</Text>
        <View style={styles.starRowInteractive}>
          {Array.from({ length: 5 }, (_, index) => {
            const value = index + 1;
            return (
              <Pressable key={value} onPress={() => setRating(value)}>
                <Ionicons
                  name={value <= reviewRating ? 'star' : 'star-outline'}
                  size={28}
                  color={value <= reviewRating ? '#f6c453' : appTheme.colors.textMuted}
                  style={styles.starButton}
                />
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.sectionHint}>Your Suggestions/Feedback</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Write your comment here..."
          placeholderTextColor="#9a9a9a"
          value={reviewText}
          onChangeText={setReviewText}
          multiline
          numberOfLines={4}
        />
        <AppButton label="Submit Review" onPress={submitReview} style={styles.submitButton} />
      </View>

      <View style={styles.submittedSection}>
        <Text style={styles.submittedSectionTitle}>Submitted Reviews</Text>
        {submittedReviews.length > 0 ? (
          submittedReviews.map((review) => (
            <View key={review.id} style={styles.reviewBubble}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewRating}>{review.name}</Text>
                <View style={styles.reviewHeaderRight}>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                  <Pressable onPress={() => deleteReview(review.id)} style={styles.deleteIcon}>
                    <Ionicons name="trash-outline" size={18} color={appTheme.colors.textMuted} />
                  </Pressable>
                </View>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyState}>No reviews yet.</Text>
        )}
      </View>

      <Text style={styles.barbersHeader}>Our Barbers</Text>
      {barbers.map((barber) => (
        <View key={barber.id} style={styles.barberCard}>
          <View style={styles.barberHeader}>
            <Text style={styles.barberName}>{barber.name}</Text>
            <Text style={styles.barberLabel}>Barber</Text>
          </View>
          <Text style={styles.barberMeta}>
            {barber.experienceYears} yrs experience
          </Text>
          <Text style={styles.barberBio}>{barber.bio}</Text>
          <View style={styles.barberRatingRow}>
            <Text style={styles.barberRatingText}>{barberRatings[barber.id].toFixed(1)}</Text>
            <View style={styles.starRowInteractive}>
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1;
                const active = barberRated[barber.id] && value <= barberRatings[barber.id];
                return (
                  <Pressable key={value} onPress={() => setBarberRating(barber.id, value)}>
                    <Ionicons
                      name={active ? 'star' : 'star-outline'}
                      size={20}
                      color={active ? '#f6c453' : appTheme.colors.textMuted}
                      style={styles.starButton}
                    />
                  </Pressable>
                );
              })}
            </View>
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
    paddingTop: 0,
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
    backgroundColor: appTheme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageHeroTextCol: {
    flex: 1,
    minWidth: 0,
  },
  header: {
    color: appTheme.colors.textOnDark,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
    fontFamily: appTheme.fontFamily,
  },
  sub: {
    color: '#c8c8c8',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: appTheme.fontFamily,
  },
  contactCard: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: appTheme.radius.lg,
    padding: 18,
    marginBottom: 14,
    shadowColor: appTheme.colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: appTheme.colors.textPrimary,
    fontFamily: appTheme.fontFamily,
  },
  contactMeta: {
    color: appTheme.colors.textMuted,
    marginTop: 4,
    marginBottom: 12,
    fontFamily: appTheme.fontFamily,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  contactText: {
    color: appTheme.colors.textPrimary,
    fontFamily: appTheme.fontFamily,
  },
  ratingCard: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: appTheme.radius.lg,
    padding: 18,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: appTheme.colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  ratingLabel: {
    color: appTheme.colors.textMuted,
    fontSize: 13,
    marginBottom: 8,
    fontFamily: appTheme.fontFamily,
  },
  ratingValue: {
    color: appTheme.colors.textPrimary,
    fontSize: 36,
    fontWeight: '800',
    fontFamily: appTheme.fontFamily,
  },
  ratingStarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: appTheme.colors.mutedSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  ratingMeta: {
    color: appTheme.colors.textMuted,
    marginTop: 8,
    fontFamily: appTheme.fontFamily,
  },
  reviewCard: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: appTheme.radius.lg,
    padding: 18,
    marginBottom: 18,
    shadowColor: appTheme.colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  sectionTitle: {
    color: appTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: appTheme.fontFamily,
    marginBottom: 10,
  },
  sectionHint: {
    color: appTheme.colors.textMuted,
    marginBottom: 8,
    fontFamily: appTheme.fontFamily,
  },
  starRowInteractive: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  starButton: {
    marginRight: 8,
  },
  textInput: {
    backgroundColor: appTheme.colors.mutedSurface,
    borderRadius: appTheme.radius.md,
    padding: 14,
    color: appTheme.colors.textPrimary,
    fontFamily: appTheme.fontFamily,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 14,
  },
  submittedSection: {
    marginBottom: 18,
  },
  submittedSectionTitle: {
    color: appTheme.colors.textOnDark,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: appTheme.fontFamily,
    marginBottom: 10,
  },
  reviewBubble: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: appTheme.radius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reviewHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deleteIcon: {
    padding: 4,
  },
  reviewRating: {
    fontWeight: '800',
    color: appTheme.colors.textPrimary,
    fontFamily: appTheme.fontFamily,
  },
  reviewDate: {
    color: appTheme.colors.textMuted,
    fontFamily: appTheme.fontFamily,
  },
  reviewText: {
    color: appTheme.colors.textPrimary,
    fontFamily: appTheme.fontFamily,
    lineHeight: 20,
  },
  emptyState: {
    color: appTheme.colors.textMuted,
    fontStyle: 'italic',
    fontFamily: appTheme.fontFamily,
    marginTop: 8,
  },
  barbersHeader: {
    color: appTheme.colors.textOnDark,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: appTheme.fontFamily,
    marginBottom: 12,
  },
  barberCard: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: appTheme.radius.lg,
    padding: 18,
    marginBottom: 12,
    shadowColor: appTheme.colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  barberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  barberRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  barberRatingText: {
    color: appTheme.colors.textPrimary,
    fontWeight: '800',
    fontFamily: appTheme.fontFamily,
    fontSize: 14,
  },
  barberName: {
    fontSize: 16,
    fontWeight: '800',
    color: appTheme.colors.textPrimary,
    fontFamily: appTheme.fontFamily,
  },
  barberLabel: {
    color: appTheme.colors.textOnDark,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    backgroundColor: appTheme.colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  barberMeta: {
    color: appTheme.colors.textMuted,
    fontSize: 13,
    fontFamily: appTheme.fontFamily,
  },
  barberBio: {
    color: appTheme.colors.textPrimary,
    marginTop: 8,
    fontFamily: appTheme.fontFamily,
  },
});
