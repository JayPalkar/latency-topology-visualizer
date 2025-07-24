export const fetchCloudflareLatency = async () => {
  console.log("fnc called", process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN);
  try {
    const res = await fetch("/api/cloudflare-latency");
    const data = await res.json();
    return data.latency ?? 50;
  } catch (error) {
    console.error("Error fetching Cloudflare latency:", error);
    return 50;
  }
};

export const getRegionLatency = async (countryCode: string) => {
  const regionFactors: Record<string, number> = {
    SG: 0.9,
    HK: 0.95,
    NL: 1.0,
    US: 1.1,
    DE: 1.2,
  };

  const baseLatency = await fetchCloudflareLatency();
  return baseLatency * (regionFactors[countryCode] || 1.0);
};
