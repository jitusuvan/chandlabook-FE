// Text formatting utility functions

// Capitalize first letter of each word
export const capitalizeWords = (str: string): string => {
  if (!str) return str;
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

// Capitalize first letter only
export const capitalizeFirst = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Format text as user types (capitalize first letter of each word)
export const formatTextInput = (value: string): string => {
  return capitalizeWords(value.toLowerCase());
};