import LocationsScreen from "@/components/home/locations-screen";
import React from "react";

const EntertainmentScreen = ({ images }: { images: any[] }) => {
  return (
    <LocationsScreen
      title="Entertainment"
      subtitle="Discover the best places to enjoy near you"
      categories={["cinema"]}
      radius={5000000}
      maxResults={20}
      images={images}
      screenType="grid"
    />
  );
};

export default EntertainmentScreen;
