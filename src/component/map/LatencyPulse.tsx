"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LatencyData, Exchange, CloudRegion } from "@/types";
import { latLonToVector3 } from "@/utils/geoUtils";
import { getLatencyColor } from "@/utils/colorUtils";
import { getCurvedPath } from "@/utils/pathUtils";

interface LatencyPulseProps {
  data: LatencyData;
  exchanges: Exchange[];
  regions: CloudRegion[];
}

const LatencyPulse: React.FC<LatencyPulseProps> = ({
  data,
  exchanges,
  regions,
}) => {
  const pulseRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Vector3[]>([]);
  const color = getLatencyColor(data.latency);
  const globeRadius = 100;

  const { curvePoints } = useMemo(() => {
    const fromExchange = exchanges.find((e) => e.id === data.from);
    const toRegion = regions.find((r) => r.id === data.to);

    const startPos = fromExchange
      ? new THREE.Vector3(
          ...latLonToVector3(
            fromExchange.location[1],
            fromExchange.location[0],
            globeRadius,
            1
          )
        )
      : new THREE.Vector3();

    const endPos = toRegion
      ? new THREE.Vector3(
          ...latLonToVector3(
            toRegion.location[1],
            toRegion.location[0],
            globeRadius,
            1
          )
        )
      : new THREE.Vector3();

    return {
      start: startPos,
      end: endPos,
      curvePoints: getCurvedPath(startPos, endPos, 30, 1.5, globeRadius),
    };
  }, [data, exchanges, regions]);

  useFrame(({ clock }) => {
    if (!pulseRef.current || curvePoints.length === 0) return;

    const speed = 0.15;
    const t = (clock.getElapsedTime() * speed) % 1;
    const segmentIndex = Math.min(
      Math.floor(t * (curvePoints.length - 1)),
      curvePoints.length - 2
    );
    const segmentProgress = (t * (curvePoints.length - 1)) % 1;

    const currentPos = curvePoints[segmentIndex]
      .clone()
      .lerp(curvePoints[segmentIndex + 1], segmentProgress);

    pulseRef.current.position.copy(currentPos);

    const pulseScale = 1.2 + Math.sin(clock.getElapsedTime() * 8) * 0.4;
    pulseRef.current.scale.set(pulseScale, pulseScale, pulseScale);

    if (clock.elapsedTime % 0.1 < 0.05) {
      pointsRef.current = [currentPos, ...pointsRef.current].slice(0, 8);
    }
  });

  return (
    <group>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.95}
          depthTest={true}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default LatencyPulse;
