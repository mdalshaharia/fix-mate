import {
  Smartphone,
  Laptop,
  AirVent,
  Refrigerator,
  Tv,
  WashingMachine,
  Zap,
} from "lucide-react";

// `value` must match the category stored in MongoDB
export const CATEGORIES = [
  { value: "Smartphone", icon: Smartphone },
  { value: "Laptop", icon: Laptop },
  { value: "Air conditioner", icon: AirVent },
  { value: "Refrigerator", icon: Refrigerator },
  { value: "Television", icon: Tv },
  { value: "Washing machine", icon: WashingMachine },
  { value: "Electrical", icon: Zap },
];

// `value` must match serviceMode stored in MongoDB
export const SERVICE_MODES = ["Home Visit", "Shop Drop-off"];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];