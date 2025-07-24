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

  useEffect(() => {
    loader.load(
      "/earth.jpg",
      (tex) => setTexture(tex),
      undefined,
      (err) => {
        console.error("Texture loading failed:", err);
        setTexture(null);
      }
    );
  }, [loader]);

  const { scale, rotation } = useSpring({
    scale: texture ? [1, 1, 1] : [2.5, 2.5, 2.5],
    rotation: texture ? [0, 0, 0] : [0.5, 0.5, 0],
    config: { tension: 120, friction: 30 },
  });

  useFrame(() => {
    if (groupRef.current && texture) {
      groupRef.current.rotation.y += 0.001;
    }
  });

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

  if (!texture) return null;

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
