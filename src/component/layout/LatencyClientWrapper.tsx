"use client";
import { LatencyProvider } from "@/context/LatencyContext";

// This component wraps the entire app with the LatencyProvider
// allowing global access to latency-related state via context
export default function LatencyClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Provides latency context to all child components
  return <LatencyProvider>{children}</LatencyProvider>;
}
