// Utility functions for the HVAC report

// Utility functions for the HVAC report

// Helper function to get color intensity based on hours
export const getColorIntensity = (hours, max = 25) => {
  const normalized = Math.min(hours / max, 1);
  return {
    backgroundColor: `rgba(232, 58, 58, ${0.3 + (normalized * 0.6)})`, // Using the more subtle red E83A3A
    opacity: 0.8 + (normalized * 0.2)
  };
};

// Helper function to format date objects
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return {
    month: date.toLocaleString('default', { month: 'short' }),
    day: date.getDate(),
    week: Math.ceil(date.getDate() / 7),
    fullMonth: date.toLocaleString('default', { month: 'long' }),
  };
};

// Helper function to calculate percentage
export const calculatePercentage = (value, total) => {
  return Math.round((value / total) * 100);
};