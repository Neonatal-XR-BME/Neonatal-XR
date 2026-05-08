export const getStatusColors = (value: string | number) => {
  const normalizedValue =
    typeof value === "string" ? value.toUpperCase() : value;

  switch (normalizedValue) {
    case "YES":
    case "SAFE":
    case "ONLINE":
    case "NO LEAKAGE":
    case "ACTIVE":
      return { bg: "#C4FFEC", text: "#00A16C" }; // Green
    case "LEAKAGE":
    case "ERROR":
    case "DISCONNECTED":
      return { bg: "#FFE5E5", text: "#FF5252" }; // Red
    case "NO ALARM":
    case "NO":
    case "OFFLINE":
      return { bg: "#F4F4F8", text: "#545454" }; // Gray
    default:
      // Default fallback (e.g., for percentages like "98%")
      return { bg: "#DEE6FE", text: "#0749FF" }; // Blue
  }
};
