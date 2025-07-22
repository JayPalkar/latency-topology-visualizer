import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LatencyClientWrapper from "@/component/layout/LatencyClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Latency Topology Visualizer",
  description: "3D visualization of cryptocurrency exchange latency",
};

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
