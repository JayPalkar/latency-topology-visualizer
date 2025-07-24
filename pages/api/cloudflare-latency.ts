// pages/api/cloudflare-latency.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.get(
      "https://api.cloudflare.com/client/v4/radar/http/timeseries",
      {
        params: {
          format: "json",
          dateRange: "1d",
          metrics: "latency",
        },
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN}`,
        },
      }
    );

    if (!response.data.success) {
      return res.status(500).json({ error: "Cloudflare API request failed" });
    }

    const values = response.data.result.serie_0.values;
    const latestValue = parseFloat(values[values.length - 1]);

    return res.status(200).json({ latency: latestValue });
  } catch (error) {
    console.error("Cloudflare API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
