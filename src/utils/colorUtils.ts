export const getLatencyColor = (latency: number): string => {
  if (latency < 50) return "#4ade80"; // Green – Low latency
  if (latency < 100) return "#facc15"; // Yellow – Medium latency
  return "#f87171"; // Red – High latency
};

// Returns a simple text label for latency category
export const getLatencyStatus = (latency: number): string => {
  if (latency < 50) return "Low";
  if (latency < 100) return "Medium";
  return "High";
};

// Returns a distinct color for each cloud provider
export const getProviderColor = (provider: "aws" | "gcp" | "azure"): string => {
  return {
    aws: "#0000ff", // Blue for AWS
    gcp: "#f000f0", // Pink for GCP
    azure: "#ff0000", // Red for Azure
  }[provider];
};

// Maps internal provider ID to display-friendly name
export const getProviderName = (provider: "aws" | "gcp" | "azure"): string => {
  return {
    aws: "AWS",
    gcp: "Google Cloud",
    azure: "Microsoft Azure",
  }[provider];
};
