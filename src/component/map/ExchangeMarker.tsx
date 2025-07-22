"use client";

import React, { useState, useEffect } from "react";
import { Html } from "@react-three/drei";
import { Exchange } from "@/types";
import { getProviderColor } from "@/utils/colorUtils";
import { latLonToVector3 } from "@/utils/geoUtils";

interface ExchangeMarkerProps {
  exchange: Exchange;
  isSelected: boolean;
  onClick: () => void;
}

const ExchangeMarker: React.FC<ExchangeMarkerProps> = ({
  exchange,
  isSelected,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);
  const position = latLonToVector3(exchange.location[1], exchange.location[0]);
  const color = getProviderColor(exchange.provider);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <group position={[0, 4.5, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshStandardMaterial
            color={isSelected ? "#ffffff" : color}
            emissive={isSelected ? color : "#000000"}
            emissiveIntensity={isSelected ? 0.8 : 0}
          />
        </mesh>

        <mesh position={[0, -1.5, 0]}>
          <cylinderGeometry args={[0.5, 0.3, 3, 16]} />
          <meshStandardMaterial
            color={isSelected ? "#ffffff" : color}
            emissive={isSelected ? color : "#000000"}
            emissiveIntensity={isSelected ? 0.5 : 0}
          />
        </mesh>

        <mesh position={[0, -3.25, 0]}>
          <coneGeometry args={[0.3, 0.7, 16]} />
          <meshStandardMaterial
            color={isSelected ? "#ffffff" : "#555555"}
            emissive={isSelected ? color : "#000000"}
            emissiveIntensity={isSelected ? 0.3 : 0}
          />
        </mesh>
      </group>

      {(hovered || isSelected) && (
        <Html
          position={[0, 14, 0]}
          center
          distanceFactor={100}
          occlude
          zIndexRange={[100, 0]}
        >
          <div className="bg-white text-black text-sm p-4 rounded-lg shadow-lg pointer-events-none w-64 max-w-sm">
            <div className="font-semibold">{exchange.name}</div>
            <div className="mt-1">
              <div>
                <span className="font-medium">Provider:</span>{" "}
                {exchange.provider}
              </div>
              <div>
                <span className="font-medium">Location:</span>{" "}
                {exchange.location[1].toFixed(2)}°N,{" "}
                {exchange.location[0].toFixed(2)}°E
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

export default ExchangeMarker;
