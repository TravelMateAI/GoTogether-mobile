import { getPlaceDetailsByIdAction } from "@/services/location-service";
import { PlaceDetails } from "@/types/location-types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const LocationDetailsScreen = () => {
  const { placeId } = useLocalSearchParams();
  const router = useRouter();

  // fallback images
  const images = [
    require("@/assets/images/top-picks/img1.jpg"),
    require("@/assets/images/top-picks/img2.jpg"),
    require("@/assets/images/top-picks/img3.jpg"),
  ];
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    fetchPlaceDetails();
  }, [placeId]);

  const fetchPlaceDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const id = Array.isArray(placeId) ? placeId[0] : placeId;
      const response = await getPlaceDetailsByIdAction(id);

      if (response.success && response.data) {
        setPlaceDetails(response.data);
      } else {
        setError(response.error || "Failed to load location details");
        console.log("Error:", response.error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error fetching place details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", "Phone calls are not supported on this device");
        }
      })
      .catch((err) => console.error("Error opening phone:", err));
  };

  const handleWebsite = (website: string) => {
    Linking.canOpenURL(website)
      .then((supported) => {
        if (supported) {
          Linking.openURL(website);
        } else {
          Alert.alert("Error", "Cannot open website");
        }
      })
      .catch((err) => console.error("Error opening website:", err));
  };

  const formatRating = (rating?: number) => {
    return rating ? rating.toFixed(1) : "N/A";
  };

  const getRatingColor = (rating?: number) => {
    if (!rating) return "text-gray-500";
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-green-500";
    if (rating >= 3.5) return "text-yellow-600";
    if (rating >= 3.0) return "text-orange-500";
    return "text-red-500";
  };

  const getImageSource = (index: number) => {
    if (placeDetails?.photo_urls && placeDetails.photo_urls.length > 0) {
      return { uri: placeDetails.photo_urls[index] };
    }
    return images[index % images.length];
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Text key={i} className="text-yellow-500 text-lg">
          ★
        </Text>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Text key="half" className="text-yellow-500 text-lg">
          ☆
        </Text>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Text key={`empty-${i}`} className="text-gray-300 text-lg">
          ☆
        </Text>
      );
    }

    return <View className="flex-row">{stars}</View>;
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366F1" />
          <Text className="text-gray-600 mt-4">
            Loading location details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !placeDetails) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-red-500 text-lg font-semibold mb-2">
            Unable to Load Details
          </Text>
          <Text className="text-gray-600 text-center mb-4">
            {error || "Location details are not available"}
          </Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="bg-indigo-600 px-6 py-3 rounded-full"
              onPress={fetchPlaceDetails}
            >
              <Text className="text-white font-medium">Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-200 px-6 py-3 rounded-full"
              onPress={router.back}
            >
              <Text className="text-gray-700 font-medium">Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const photoCount = placeDetails.photo_urls?.length || images.length;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header Image Section */}
        <View className="relative">
          <Image
            source={getImageSource(selectedPhotoIndex)}
            className="w-full h-64"
            resizeMode="cover"
          />

          {/* Back Button */}
          <TouchableOpacity
            className="absolute top-4 left-4 bg-black/50 rounded-full p-2"
            onPress={router.back}
          >
            <Text className="text-white text-lg">←</Text>
          </TouchableOpacity>

          {/* Photo Counter */}
          {photoCount > 1 && (
            <View className="absolute top-4 right-4 bg-black/50 rounded-full px-3 py-1">
              <Text className="text-white text-sm">
                {selectedPhotoIndex + 1}/{photoCount}
              </Text>
            </View>
          )}

          {/* Photo Navigation */}
          {photoCount > 1 && (
            <View className="absolute bottom-4 right-4 flex-row space-x-2">
              <TouchableOpacity
                className="bg-black/50 rounded-full p-2"
                onPress={() =>
                  setSelectedPhotoIndex(Math.max(0, selectedPhotoIndex - 1))
                }
                disabled={selectedPhotoIndex === 0}
              >
                <Text
                  className={`text-lg ${
                    selectedPhotoIndex === 0 ? "text-gray-400" : "text-white"
                  }`}
                >
                  ←
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-black/50 rounded-full p-2"
                onPress={() =>
                  setSelectedPhotoIndex(
                    Math.min(photoCount - 1, selectedPhotoIndex + 1)
                  )
                }
                disabled={selectedPhotoIndex === photoCount - 1}
              >
                <Text
                  className={`text-lg ${
                    selectedPhotoIndex === photoCount - 1
                      ? "text-gray-400"
                      : "text-white"
                  }`}
                >
                  →
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Status Badge */}
          {placeDetails.opening_hours?.open_now !== undefined && (
            <View className="absolute bottom-4 left-4">
              <View
                className={`px-3 py-1 rounded-full ${
                  placeDetails.opening_hours.open_now
                    ? "bg-green-500/90"
                    : "bg-red-500/90"
                }`}
              >
                <Text className="text-white text-sm font-medium">
                  {placeDetails.opening_hours.open_now
                    ? "🟢 Open Now"
                    : "🔴 Closed"}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View className="p-6">
          {/* Title and Rating */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              {placeDetails.name}
            </Text>

            {placeDetails.rating && (
              <View className="flex-row items-center mb-3">
                {renderStarRating(placeDetails.rating)}
                <Text
                  className={`ml-2 text-lg font-semibold ${getRatingColor(
                    placeDetails.rating
                  )}`}
                >
                  {formatRating(placeDetails.rating)}
                </Text>
                {placeDetails.user_ratings_total && (
                  <Text className="text-gray-500 ml-2">
                    (
                    {placeDetails.user_ratings_total > 999
                      ? `${Math.floor(placeDetails.user_ratings_total / 1000)}k`
                      : placeDetails.user_ratings_total}{" "}
                    reviews)
                  </Text>
                )}
              </View>
            )}

            {placeDetails.formatted_address && (
              <View className="flex-row items-start">
                <Text className="text-gray-600 mr-2">📍</Text>
                <Text className="text-gray-600 flex-1 leading-5">
                  {placeDetails.formatted_address}
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="flex-row mb-6 space-x-3">
            {placeDetails.formatted_phone_number && (
              <TouchableOpacity
                className="flex-1 bg-green-600 py-3 rounded-lg flex-row items-center justify-center"
                onPress={() => handleCall(placeDetails.formatted_phone_number!)}
              >
                <Text className="text-white font-medium">📞 Call</Text>
              </TouchableOpacity>
            )}

            {placeDetails.website && (
              <TouchableOpacity
                className="flex-1 bg-blue-600 py-3 rounded-lg flex-row items-center justify-center"
                onPress={() => handleWebsite(placeDetails.website!)}
              >
                <Text className="text-white font-medium">🌐 Website</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Information Cards */}
          <View className="space-y-4 mb-6">
            {/* Contact Information */}
            {(placeDetails.formatted_phone_number ||
              placeDetails.international_phone_number) && (
              <View className="bg-gray-50 rounded-lg p-4">
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  Contact Information
                </Text>
                {placeDetails.formatted_phone_number && (
                  <Text className="text-gray-600 mb-1">
                    Phone: {placeDetails.formatted_phone_number}
                  </Text>
                )}
                {placeDetails.international_phone_number &&
                  placeDetails.international_phone_number !==
                    placeDetails.formatted_phone_number && (
                    <Text className="text-gray-600">
                      International: {placeDetails.international_phone_number}
                    </Text>
                  )}
              </View>
            )}

            {/* Business Hours */}
            {placeDetails.opening_hours?.weekday_text && (
              <View className="bg-gray-50 rounded-lg p-4">
                <Text className="text-lg font-semibold text-gray-900 mb-3">
                  Business Hours
                </Text>
                {placeDetails.opening_hours.weekday_text.map((hours, index) => (
                  <Text key={index} className="text-gray-600 mb-1">
                    {hours}
                  </Text>
                ))}
              </View>
            )}

            {/* Place Types */}
            {placeDetails.types && placeDetails.types.length > 0 && (
              <View className="bg-gray-50 rounded-lg p-4">
                <Text className="text-lg font-semibold text-gray-900 mb-3">
                  Categories
                </Text>
                <View className="flex-row flex-wrap">
                  {placeDetails.types.slice(0, 6).map((type, index) => (
                    <View
                      key={index}
                      className="bg-indigo-100 px-3 py-1 rounded-full mr-2 mb-2"
                    >
                      <Text className="text-indigo-700 text-sm capitalize">
                        {type.replace(/_/g, " ")}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Reviews Section */}
          {placeDetails.reviews && placeDetails.reviews.length > 0 && (
            <View className="mb-6">
              <Text className="text-xl font-bold text-gray-900 mb-4">
                Recent Reviews
              </Text>
              {placeDetails.reviews.slice(0, 3).map((review, index) => (
                <View
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm"
                >
                  <View className="flex-row items-center mb-2">
                    <View className="w-8 h-8 bg-indigo-600 rounded-full items-center justify-center mr-3">
                      <Text className="text-white text-sm font-medium">
                        {review.author_name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium text-gray-900">
                        {review.author_name}
                      </Text>
                      <View className="flex-row items-center">
                        {renderStarRating(review.rating)}
                        <Text className="text-gray-500 text-sm ml-2">
                          {review.relative_time_description}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text className="text-gray-700 leading-5" numberOfLines={4}>
                    {review.text}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LocationDetailsScreen;
