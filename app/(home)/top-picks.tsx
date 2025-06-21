import LocationsScreen from "@/components/home/locations-screen";
import React from "react";

const TopPicksScreen = ({ images }: { images: any[] }) => {
  return (
    <LocationsScreen
      title="Top Picks"
      subtitle="Discover the most popular destinations near you"
      categories={["restaurant"]}
      radius={5000000}
      maxResults={20}
      images={images}
      screenType="grid"
    />
  );
};

export default TopPicksScreen;
