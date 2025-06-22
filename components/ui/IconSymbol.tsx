import Ionicons from "@expo/vector-icons/Ionicons";
import { SymbolWeight } from "expo-symbols";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

// Mapping SF Symbols to Ionicons equivalents
const MAPPING = {
  "house.fill": "home",
  house: "home-outline",

  "doc.plaintext": "document-text",
  doc: "document-text-outline",

  "map.fill": "map",
  map: "map-outline",

  "gearshape.fill": "settings",
  gearshape: "settings-outline",

  "profile.fill": "person",
  profile: "person-outline",

  "globe.fill": "globe",
  globe: "globe-outline",

  "triangle.fill": "warning",
  triangle: "warning-outline",

  people: "people-outline",
  "people.fill": "people",

  "cross.case": "medkit-outline",
  "cross.case.fill": "medkit",

  phone: "call-outline",
  "phone.fill": "call",

  envelope: "mail-outline",
  "envelope.fill": "mail",
} as const;

type IconSymbolName = keyof typeof MAPPING;
type IoniconName = (typeof MAPPING)[IconSymbolName];

export interface IconSymbolProps {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}

/**
 * IconSymbol - Cross-platform icon component mapping SF Symbols to Ionicons.
 * Uses Ionicons on all platforms for consistency.
 */
export function IconSymbol({ name, size = 24, color, style }: IconSymbolProps) {
  const iconName = MAPPING[name];

  if (!iconName) {
    console.warn(`⚠️ Icon name "${name}" not found in Ionicon mapping.`);
    return null;
  }

  return (
    <Ionicons
      name={iconName as IoniconName}
      size={size}
      color={color}
      style={style}
    />
  );
}
