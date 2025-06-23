import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import { GOOGLE_API_KEY } from "../../keys";

type TransportMode = "Train" | "Bus" | "Taxi" | "Tuk Tuk";

interface Option {
  id: string;
  name: string;
  type: TransportMode;
  distance: string;
  duration: string;
  eco: boolean;
  label: string;
  price: number;
}

const TransportScreen: React.FC = () => {
  const [from, setFrom] = useState("Colombo Fort");
  const [to, setTo] = useState("Pettah Bus Stand");
  const [mode, setMode] = useState<TransportMode>("Train");
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
          from
        )}&destination=${encodeURIComponent(
          to
        )}&mode=transit&key=${GOOGLE_API_KEY}`
      );

      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        setOptions([]);
        setLoading(false);
        return;
      }

      const steps = data.routes[0].legs[0].steps;

      const mappedOptions: Option[] = steps
        .filter((step: any) => step.travel_mode === "TRANSIT")
        .map((step: any, index: number) => {
          const vehicleType =
            step.transit_details?.line?.vehicle?.type || "BUS";

          let transportType: TransportMode = "Bus";
          if (vehicleType.includes("RAIL")) transportType = "Train";
          else if (vehicleType.includes("TAXI")) transportType = "Taxi";
          else if (vehicleType.includes("BUS")) transportType = "Bus";

          return {
            id: index.toString(),
            name: step.transit_details?.line?.short_name || transportType,
            type: transportType,
            distance: step.distance.text,
            duration: step.duration.text,
            eco: transportType !== "Taxi",
            label:
              transportType === "Bus"
                ? "Shared ride"
                : transportType === "Train"
                ? "Low carbon"
                : "Direct",
            price:
              transportType === "Taxi"
                ? 25
                : transportType === "Train"
                ? 12
                : 5,
          };
        });

      setOptions(mappedOptions.filter((o) => o.type === mode));
    } catch (err) {
      console.error("Error fetching transport options:", err);
    }
    setLoading(false);
  };

  const handleOptionPress = (option: Option) => {
    setSelectedOption(option);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOption(null);
  };

  useEffect(() => {
    fetchOptions();
  }, [mode, from, to]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View
        className="flex-1 bg-white px-4 py-6"
        style={{ marginTop: 2, marginBottom: 20 }}
      >
        <Text
          className="text-lg font-bold text-indigo-600 mb-2"
          style={{ fontSize: 28 }}
        >
          Transportation
        </Text>
        <Text className="text-gray-500 mb-4" style={{ fontSize: 15 }}>
          Find your way around
        </Text>

        <View className="flex-row gap-3 mb-4">
          <TextInput
            className="flex-1 bg-gray-100 px-4 py-2 rounded-xl"
            value={from}
            onChangeText={setFrom}
            placeholder="Current location"
          />
          <TextInput
            className="flex-1 bg-gray-100 px-4 py-2 rounded-xl"
            value={to}
            onChangeText={setTo}
            placeholder="Destination"
          />
        </View>

        <View className="flex-row justify-between mb-4">
          {(["Train", "Bus", "Taxi", "Tuk Tuk"] as TransportMode[]).map(
            (item) => (
              <Pressable
                key={item}
                onPress={() => setMode(item)}
                className={`items-center px-3 py-2 rounded-xl ${
                  mode === item ? "bg-indigo-100" : "bg-gray-50"
                }`}
              >
                {item === "Train" && <MaterialIcons name="train" size={24} />}
                {item === "Bus" && (
                  <MaterialIcons name="directions-bus" size={24} />
                )}
                {item === "Taxi" && (
                  <MaterialIcons name="local-taxi" size={24} />
                )}
                {item === "Tuk Tuk" && (
                  <MaterialCommunityIcons name="rickshaw" size={24} />
                )}
                <Text className="text-xs mt-1">{item}</Text>
              </Pressable>
            )
          )}
        </View>

        <ScrollView className="bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-semibold">Available Options</Text>
            <Text className="text-green-600 text-sm">Eco-friendly</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#6366f1" />
          ) : options.length === 0 ? (
            <Text className="text-center text-gray-500 mt-4">
              No options available
            </Text>
          ) : (
            <ScrollView className="max-h-96">
              {options.map((opt) => (
                <Pressable
                  key={opt.id}
                  onPress={() => handleOptionPress(opt)}
                  className="flex-row justify-between items-center p-4 border border-gray-200 rounded-xl mb-3"
                >
                  <View>
                    <Text className="font-semibold">{opt.name}</Text>
                    <Text className="text-xs text-gray-500">
                      {opt.duration} • {opt.distance}
                    </Text>
                    <Text className="mt-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full self-start">
                      {opt.label}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-indigo-700 font-bold">
                      ${opt.price}
                    </Text>
                    <Text className="text-purple-600 mt-1 font-medium">
                      Tap for details
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </ScrollView>

        <Pressable
          onPress={() => {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
              from
            )}&destination=${encodeURIComponent(to)}&travelmode=transit`;
            Linking.openURL(url).catch((err) =>
              console.error("Failed to open map URL", err)
            );
          }}
          className="bg-indigo-500 py-3 rounded-2xl mt-5 items-center"
        >
          <Text className="text-white font-semibold">Open in Maps</Text>
        </Pressable>

        {/* Modal for option details */}
        <Modal
          isVisible={modalVisible}
          onBackdropPress={closeModal}
          onBackButtonPress={closeModal}
          swipeDirection={["down"]}
          onSwipeComplete={closeModal}
          style={{ justifyContent: "flex-end", margin: 0 }}
          backdropOpacity={0.5}
          animationIn="slideInUp"
          animationOut="slideOutDown"
        >
          <View
            className="bg-white rounded-t-3xl p-6"
            style={{ maxHeight: "80%" }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">
                Trip Details
              </Text>
              <Pressable
                onPress={closeModal}
                className="p-2 rounded-full bg-gray-100"
              >
                <MaterialIcons name="close" size={20} color="#666" />
              </Pressable>
            </View>

            {selectedOption && (
              <ScrollView>
                <View className="mb-6">
                  <View className="flex-row items-center mb-3">
                    {selectedOption.type === "Train" && (
                      <MaterialIcons name="train" size={32} color="#6366f1" />
                    )}
                    {selectedOption.type === "Bus" && (
                      <MaterialIcons
                        name="directions-bus"
                        size={32}
                        color="#6366f1"
                      />
                    )}
                    {selectedOption.type === "Taxi" && (
                      <MaterialIcons
                        name="local-taxi"
                        size={32}
                        color="#6366f1"
                      />
                    )}
                    {selectedOption.type === "Tuk Tuk" && (
                      <MaterialCommunityIcons
                        name="rickshaw"
                        size={32}
                        color="#6366f1"
                      />
                    )}
                    <View className="ml-3">
                      <Text className="text-lg font-semibold">
                        {selectedOption.name}
                      </Text>
                      <Text className="text-gray-500">
                        {selectedOption.type}
                      </Text>
                    </View>
                  </View>

                  <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                    <View className="flex-row justify-between mb-3">
                      <View className="flex-1">
                        <Text className="text-gray-500 text-sm">Duration</Text>
                        <Text className="font-semibold text-lg">
                          {selectedOption.duration}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-500 text-sm">Distance</Text>
                        <Text className="font-semibold text-lg">
                          {selectedOption.distance}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row justify-between">
                      <View className="flex-1">
                        <Text className="text-gray-500 text-sm">Price</Text>
                        <Text className="font-bold text-xl text-indigo-700">
                          ${selectedOption.price}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-500 text-sm">Category</Text>
                        <View className="flex-row items-center">
                          <Text className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                            {selectedOption.label}
                          </Text>
                          {selectedOption.eco && (
                            <MaterialIcons
                              name="eco"
                              size={16}
                              color="#16a34a"
                              className="ml-2"
                            />
                          )}
                        </View>
                      </View>
                    </View>
                  </View>

                  <View className="mb-4">
                    <Text className="text-gray-500 text-sm mb-2">Route</Text>
                    <View className="bg-blue-50 rounded-xl p-3">
                      <Text className="text-gray-700">
                        From: <Text className="font-semibold">{from}</Text>
                      </Text>
                      <Text className="text-gray-700 mt-1">
                        To: <Text className="font-semibold">{to}</Text>
                      </Text>
                    </View>
                  </View>

                  {selectedOption.eco && (
                    <View className="bg-green-50 rounded-xl p-3 mb-4">
                      <View className="flex-row items-center">
                        <MaterialIcons name="eco" size={20} color="#16a34a" />
                        <Text className="text-green-700 font-medium ml-2">
                          Eco-friendly option
                        </Text>
                      </View>
                      <Text className="text-green-600 text-sm mt-1">
                        This transport option has a lower environmental impact
                      </Text>
                    </View>
                  )}
                </View>

                <Pressable
                  onPress={() => {
                    closeModal();
                    // Open specific transport mode in Google Maps
                    const travelMode =
                      selectedOption.type === "Train"
                        ? "transit"
                        : selectedOption.type === "Bus"
                        ? "transit"
                        : selectedOption.type === "Taxi"
                        ? "driving"
                        : "transit"; // Tuk Tuk defaults to transit

                    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                      from
                    )}&destination=${encodeURIComponent(
                      to
                    )}&travelmode=${travelMode}`;

                    Linking.openURL(url).catch((err) =>
                      console.error("Failed to open map URL", err)
                    );
                  }}
                  className="bg-indigo-500 py-4 rounded-2xl items-center"
                >
                  <Text className="text-white font-semibold text-lg">
                    More Details
                  </Text>
                </Pressable>
              </ScrollView>
            )}
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default TransportScreen;
