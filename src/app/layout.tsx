import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LatencyClientWrapper from "@/component/layout/LatencyClientWrapper"; // Context provider for latency data

const inter = Inter({ subsets: ["latin"] }); // Load Inter font with Latin subset

// Default metadata for the application
export const metadata: Metadata = {
  title: "Latency Topology Visualizer",
  description: "3D visualization of cryptocurrency exchange latency",
};

// Root layout for the entire app - wraps all pages
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LatencyClientWrapper>{children}</LatencyClientWrapper>
      </body>
    </html>
  );
}
