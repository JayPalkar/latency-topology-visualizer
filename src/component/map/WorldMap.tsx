"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useLatency } from "@/context/LatencyContext";
import ExchangeMarker from "./ExchangeMarker";
import LatencyConnection from "./LatencyConnection";
import LatencyPulse from "./LatencyPulse";
import Legend from "../ui/Legend";
import CloudRegionMarker from "./CloudRegionMarker";

const Globe: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load("/earth-night.jpg", (tex) => {
      texture.current = tex;
      if (meshRef.current) {
        (meshRef.current.material as THREE.MeshStandardMaterial).map = tex;
        (meshRef.current.material as THREE.MeshStandardMaterial).needsUpdate =
          true;
      }
    });
  }, []);

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0.3]}>
      <sphereGeometry args={[100, 64, 64]} />
      <meshStandardMaterial
        map={texture.current || undefined}
        color="#fff"
        roughness={0.8}
        metalness={0.5}
        depthWrite={true}
      />
    </mesh>
  );
};

const MapScene: React.FC = () => {
  const {
    exchanges,
    latencyData,
    selectedExchange,
    selectExchange,
    cloudRegions,
    visibleProviders,
  } = useLatency();

  const filteredRegions = useMemo(
    () => cloudRegions.filter((r) => visibleProviders.includes(r.provider)),
    [cloudRegions, visibleProviders]
  );

  const filteredLatency = useMemo(
    () =>
      latencyData.filter((data) =>
        visibleProviders.includes(
          cloudRegions.find((r) => r.id === data.to)?.provider || ""
        )
      ),
    [latencyData, cloudRegions, visibleProviders]
  );

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

  return (
    <>
      <Environment preset="lobby" background={false} />
      <ambientLight intensity={1.0} color="#ffffff" />
      <directionalLight
        position={[100, 200, 100]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight
        position={[-200, -100, 200]}
        intensity={0.8}
        color="#ffffff"
      />
      <spotLight
        position={[0, 0, 300]}
        angle={0.3}
        penumbra={1}
        intensity={1.2}
        castShadow
      />
      <Globe />

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

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        zoomSpeed={0.5}
        panSpeed={0.4}
        rotateSpeed={0.4}
        minDistance={80}
        maxDistance={800}
        maxPolarAngle={Math.PI}
        screenSpacePanning={false}
        enableDamping={true}
        dampingFactor={0.1}
      />
    </>
  );
};

const WorldMap: React.FC = () => {
  return (
    <div className="w-full h-full">
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
