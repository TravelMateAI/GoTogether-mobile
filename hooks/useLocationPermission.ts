import * as Location from "expo-location";
import { useEffect, useState } from "react";

export const useLocationPermission = () => {
  const [granted, setGranted] = useState<boolean | null>(null);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setGranted(status === "granted");
    };

    requestPermission();
  }, []);

  return granted;
};
