// Fetches base latency value from the Cloudflare API route (proxy)
// Falls back to default value (50ms) on error

export const fetchCloudflareLatency = async () => {
  console.log("fnc called", process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN);
  try {
    const res = await fetch("/api/cloudflare-latency"); // API route acts as a proxy to Cloudflare Radar
    const data = await res.json();
    return data.latency ?? 50; // If no latency returned, use default fallback
  } catch (error) {
    console.error("Error fetching Cloudflare latency:", error);
    return 50;
  }
};

// Estimates latency to a cloud region based on country-specific multipliers
// `countryCode` is ISO format (e.g., 'US', 'SG', etc.)
export const getRegionLatency = async (countryCode: string) => {
  const regionFactors: Record<string, number> = {
    SG: 0.9, // Singapore – faster region
    HK: 0.95, // Hong Kong – slightly faster
    NL: 1.0, // Netherlands – baseline
    US: 1.1, // United States – slightly higher latency
    DE: 1.2, // Germany – higher latency
  };

  const baseLatency = await fetchCloudflareLatency();
  return baseLatency * (regionFactors[countryCode] || 1.0);
};
