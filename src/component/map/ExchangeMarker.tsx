"use client";

import React, { useState } from "react";
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
          center
          distanceFactor={5}
          style={{
            pointerEvents: "none",
            transform: "translate3d(-50%, -100%, 0)",
            width: "max-content",
            minWidth: "300px",
            zIndex: 100,
          }}
        >
          <div
            className={`
            bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl
            border-2 border-gray-300 dark:border-gray-600
            text-lg sm:text-xl // Larger text
          `}
          >
            <h3 className="font-bold text-[20vw] text-gray-900 dark:text-white mb-2">
              {exchange.name}
            </h3>
            <div className="text-base text-gray-700 dark:text-gray-300 space-y-2">
              <p className="flex items-center text-[15vw]">
                <span className="font-medium">Provider: </span>{" "}
                {exchange.provider.toUpperCase()}
              </p>

              <p className="flex items-center text-[15vw]">
                <span className="font-medium">Location: </span>{" "}
                {exchange.location[1].toFixed(2)}°N,{" "}
                {exchange.location[0].toFixed(2)}°E
              </p>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

export default ExchangeMarker;
