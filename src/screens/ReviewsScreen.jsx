import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import api from '../services/api';

const ReviewsScreen = ({ navigation }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showAddReview, setShowAddReview] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await api.getVendorReviews(1); // Mock vendor ID
      if (response.success) {
        setReviews(response.reviews);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load reviews');
    }
  };

  const submitReview = async () => {
    if (!newReview.comment.trim()) {
      Alert.alert('Missing Information', 'Please enter your review comment');
      return;
    }

    setLoading(true);
    try {
      const response = await api.submitReview({
        vendorId: 1, // Mock vendor ID
        rating: newReview.rating,
        comment: newReview.comment.trim(),
      });

      if (response.success) {
        Alert.alert('Success', 'Your review has been submitted!');
        setReviews([response.review, ...reviews]);
        setNewReview({ rating: 5, comment: '' });
        setShowAddReview(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            disabled={!interactive}
            onPress={() => interactive && onRatingChange && onRatingChange(star)}
          >
            <Text className={`text-2xl mr-1 ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`}>
              ⭐
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderReview = (review, index) => (
    <Card key={index} className="mb-3">
      <CardContent>
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-base font-semibold text-slate-800 mb-0.5">{review.userName}</Text>
            <Text className="text-xs text-slate-500">{review.date}</Text>
          </View>
          {renderStars(review.rating)}
        </View>
        <Text className="text-sm text-slate-500 leading-5">{review.comment}</Text>
      </CardContent>
    </Card>
  );

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-lg text-slate-500">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-800">My Reviews</Text>
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-green-500 items-center justify-center"
          onPress={() => setShowAddReview(!showAddReview)}
        >
          <Text className="text-2xl text-white font-bold">+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View className="flex-row bg-white rounded-xl p-4 mt-4 mb-4">
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-green-500 mb-1">{reviews.length}</Text>
            <Text className="text-xs text-slate-500">Reviews</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-green-500 mb-1">{averageRating}</Text>
            <Text className="text-xs text-slate-500">Average Rating</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-green-500 mb-1">4.8</Text>
            <Text className="text-xs text-slate-500">App Rating</Text>
          </View>
        </View>

        {/* Add Review Form */}
        {showAddReview && (
          <Card className="mb-4">
            <CardContent>
              <Text className="text-lg font-bold text-slate-800 mb-4">Write a Review</Text>

              <View className="mb-4">
                <Text className="text-base text-slate-800 mb-2">Your Rating:</Text>
                {renderStars(newReview.rating, true, (rating) =>
                  setNewReview({ ...newReview, rating })
                )}
              </View>

              <TextInput
                className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-base text-slate-800 h-[100px] mb-4"
                placeholder="Share your experience..."
                value={newReview.comment}
                onChangeText={(comment) => setNewReview({ ...newReview, comment })}
                multiline
                textAlignVertical="top"
                placeholderTextColor="#64748b"
              />

              <View className="flex-row gap-3">
                <Button
                  title="Cancel"
                  onPress={() => setShowAddReview(false)}
                  variant="outline"
                  className="flex-1 border-red-500"
                />
                <Button
                  title="Submit Review"
                  onPress={submitReview}
                  loading={loading}
                  className="flex-1 bg-green-500"
                />
              </View>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <View className="mt-4">
          <Text className="text-lg font-bold text-slate-800 mb-4">Recent Reviews</Text>

          {reviews.length === 0 ? (
            <View className="items-center py-12">
              <Text className="text-5xl mb-4">⭐</Text>
              <Text className="text-lg font-bold text-slate-800 mb-2">No reviews yet</Text>
              <Text className="text-sm text-slate-500 text-center px-8">
                Be the first to share your experience!
              </Text>
            </View>
          ) : (
            reviews.map(renderReview)
          )}
        </View>

        <View className="h-5" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewsScreen;