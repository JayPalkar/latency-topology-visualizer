"use client";
import { LatencyProvider } from "@/context/LatencyContext";

export default function LatencyClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LatencyProvider>{children}</LatencyProvider>;
}
