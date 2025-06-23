import LocationsScreen from "@/components/home/locations-screen";
import React from "react";

const EventsScreen = ({ images }: { images: any[] }) => {
  return (
    <LocationsScreen
      title="Top Picks"
      subtitle="Discover the clutural heritage near you"
      categories={["museum"]}
      radius={5000000}
      maxResults={20}
      images={images}
      screenType="grid"
    />
  );
};

export default EventsScreen;
