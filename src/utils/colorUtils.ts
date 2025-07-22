export const getLatencyColor = (latency: number): string => {
  if (latency < 50) return "#4ade80";
  if (latency < 100) return "#facc15";
  return "#f87171";
};

export const getLatencyStatus = (latency: number): string => {
  if (latency < 50) return "Low";
  if (latency < 100) return "Medium";
  return "High";
};

export const getProviderColor = (provider: "aws" | "gcp" | "azure"): string => {
  return {
    aws: "#FF9900",
    gcp: "#4285F4",
    azure: "#0089D6",
  }[provider];
};

export const getProviderName = (provider: "aws" | "gcp" | "azure"): string => {
  return {
    aws: "AWS",
    gcp: "Google Cloud",
    azure: "Microsoft Azure",
  }[provider];
};
