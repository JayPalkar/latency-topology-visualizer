"use client";

import * as THREE from "three";
import { useRef } from "react";
import { Html } from "@react-three/drei";
import { CloudRegion } from "@/types";

interface CloudRegionMarkerProps {
  region: CloudRegion;
  globeRadius?: number;
}

const COLORS: Record<string, string> = {
  aws: "#ff9900",
  gcp: "#4285F4",
  azure: "#007FFF",
};

export default function CloudRegionMarker({
  region,
  globeRadius = 100,
}: CloudRegionMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const [lng, lat] = region.location;
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const r = globeRadius + 0.5;
  const x = -r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.cos(phi);
  const z = r * Math.sin(phi) * Math.sin(theta);

  const position = new THREE.Vector3(x, y, z);
  const normal = position.clone().normalize();
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

  return (
    <group position={position.toArray()} quaternion={quaternion}>
      <mesh ref={meshRef}>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial
          color={COLORS[region.provider]}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      <Html
        position={[0, 10, 0]}
        center
        distanceFactor={100}
        occlude
        zIndexRange={[100, 0]}
      >
        <div className="bg-white/90 text-black text-xs px-2 py-1 rounded shadow w-36 text-center">
          <strong className="block">{region.provider.toUpperCase()}</strong>
          <div className="text-xs">Region: {region.regionCode}</div>
          <div className="text-xs">Servers: {region.serverCount}</div>
        </div>
      </Html>
    </group>
  );
}
