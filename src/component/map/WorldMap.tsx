"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, a } from "@react-spring/three";
import { useLatency } from "@/context/LatencyContext";
import ExchangeMarker from "./ExchangeMarker";
import LatencyConnection from "./LatencyConnection";
import LatencyPulse from "./LatencyPulse";
import Legend from "../ui/Legend";
import CloudRegionMarker from "./CloudRegionMarker";
import Globe from "./Globe";

// Scene component responsible for rendering 3D world with markers, pulses and connections
const MapScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const loader = useMemo(() => new THREE.TextureLoader(), []);

  const {
    exchanges,
    latencyData,
    selectedExchange,
    selectExchange,
    cloudRegions,
    visibleProviders,
  } = useLatency();

  // Load Earth texture once on mount
  useEffect(() => {
    loader.load(
      "/earth-night.jpg",
      (tex) => setTexture(tex),
      undefined,
      (err) => {
        console.error("Texture loading failed:", err);
        setTexture(null);
      }
    );
  }, [loader]);

  // Spring animation for globe entry effect
  const { scale, rotation } = useSpring({
    scale: texture ? [1, 1, 1] : [2.5, 2.5, 2.5],
    rotation: texture ? [0, 0, 0] : [0.5, 0.5, 0],
    config: { tension: 120, friction: 30 },
  });

  // Constant slow rotation of the globe
  useFrame(() => {
    if (groupRef.current && texture) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  // Filter visible cloud regions based on selected providers
  const filteredRegions = useMemo(
    () => cloudRegions.filter((r) => visibleProviders.includes(r.provider)),
    [cloudRegions, visibleProviders]
  );

  // Filter latency data based on visible provider regions
  const filteredLatency = useMemo(
    () =>
      latencyData.filter((data) =>
        visibleProviders.includes(
          cloudRegions.find((r) => r.id === data.to)?.provider || ""
        )
      ),
    [latencyData, cloudRegions, visibleProviders]
  );

  // Map latency data to connection lines between exchanges and cloud regions
  const connections = useMemo(
    () =>
      filteredLatency.map((data, idx) => (
        <LatencyConnection
          key={`conn-${idx}`}
          data={data}
          exchanges={exchanges}
          regions={filteredRegions}
        />
      )),
    [filteredLatency, exchanges, filteredRegions]
  );

  // Map latency data to animated pulses showing data transfer
  const pulses = useMemo(
    () =>
      filteredLatency.map((data, idx) => (
        <LatencyPulse
          key={`pulse-${idx}`}
          data={data}
          exchanges={exchanges}
          regions={filteredRegions}
        />
      )),
    [filteredLatency, exchanges, filteredRegions]
  );

  if (!texture) return null; // Wait for globe texture before rendering

  return (
    <>
      <Environment preset="lobby" background={false} />
      <ambientLight intensity={1.0} color="#ffffff" />
      <directionalLight position={[100, 200, 100]} intensity={1.5} castShadow />
      <pointLight position={[-200, -100, 200]} intensity={0.8} />
      <spotLight
        position={[0, 0, 300]}
        angle={0.3}
        penumbra={1}
        intensity={1.2}
        castShadow
      />

      <a.group ref={groupRef} scale={scale} rotation={rotation}>
        <Globe texture={texture} />

        {filteredRegions.map((region) => (
          <CloudRegionMarker key={region.id} region={region} />
        ))}

        <group>
          {connections}
          {pulses}
        </group>

        <group renderOrder={1}>
          {exchanges.map((exchange) => (
            <ExchangeMarker
              key={exchange.id}
              exchange={exchange}
              isSelected={exchange.id === selectedExchange}
              onClick={() =>
                selectedExchange === exchange.id
                  ? selectExchange(null)
                  : selectExchange(exchange.id)
              }
            />
          ))}
        </group>
      </a.group>

      {/* Camera controls for orbiting the globe */}
      <OrbitControls
        enableZoom
        enablePan
        enableRotate
        zoomSpeed={0.5}
        panSpeed={0.4}
        rotateSpeed={0.4}
        minDistance={80}
        maxDistance={800}
        maxPolarAngle={Math.PI}
        screenSpacePanning={false}
        enableDamping
        dampingFactor={0.1}
      />
    </>
  );
};

// Container component that wraps MapScene in a Three.js Canvas and includes the legend
const WorldMap: React.FC = () => {
  return (
    <div className="w-full h-2/3 md:h-[80%] lg:h-full">
      <Canvas
        camera={{
          position: [0, 0, 400],
          fov: 45,
          near: 0.1,
          far: 2000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          depth: true,
        }}
      >
        <MapScene />
      </Canvas>
      <Legend />
    </div>
  );
};

export default WorldMap;
