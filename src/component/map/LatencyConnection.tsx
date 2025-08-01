/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { LatencyData, Exchange, CloudRegion } from "@/types";
import { getLatencyColor } from "@/utils/colorUtils";
import { latLonToVector3 } from "@/utils/geoUtils";
import { getCurvedPath } from "@/utils/pathUtils";

interface LatencyConnectionProps {
  data: LatencyData;
  exchanges: Exchange[];
  regions: CloudRegion[];
}

// Renders a curved line between an exchange and a cloud region, colored by latency
const LatencyConnection: React.FC<LatencyConnectionProps> = ({
  data,
  exchanges,
  regions,
}) => {
  const lineRef = useRef<any>(null);
  const globeRadius = 100;

  // Get exchange and region objects based on the latency data
  const fromExchange = exchanges.find((ex) => ex.id === data.from);
  const toRegion = regions.find((reg) => reg.id === data.to);

  // Convert exchange location to 3D coordinates on the globe
  const start = useMemo(() => {
    if (!fromExchange) return new THREE.Vector3();
    return new THREE.Vector3(
      ...latLonToVector3(
        fromExchange.location[1],
        fromExchange.location[0],
        globeRadius
      )
    );
  }, [fromExchange]);

  // Convert region location to 3D coordinates on the globe
  const end = useMemo(() => {
    if (!toRegion) return new THREE.Vector3();
    return new THREE.Vector3(
      ...latLonToVector3(
        toRegion.location[1],
        toRegion.location[0],
        globeRadius
      )
    );
  }, [toRegion]);

  // Determine the line color based on latency value
  const color = getLatencyColor(data.latency);

  // Generate smooth arc curve between source and target points
  const curvePoints = useMemo(() => {
    if (start.length() === 0 || end.length() === 0) return [];
    return getCurvedPath(start, end, 30, globeRadius);
  }, [start, end]);

  // Don't render if path couldn't be created
  if (curvePoints.length === 0) return null;

  return (
    <Line
      ref={lineRef}
      points={curvePoints}
      color={color}
      lineWidth={1}
      transparent
      opacity={0.9}
      depthTest={true}
      depthWrite={false}
      renderOrder={1}
    />
  );
};

export default LatencyConnection;
