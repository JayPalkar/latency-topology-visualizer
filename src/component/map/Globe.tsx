import React, { useRef } from "react";
import * as THREE from "three";

// Props for the Globe component, expects a preloaded texture
type GlobeProps = {
  texture: THREE.Texture;
};

const Globe: React.FC<GlobeProps> = ({ texture }) => {
  // Reference to the mesh for potential future manipulation (e.g., animations or effects)
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    // Render a sphere mesh to represent Earth
    <mesh ref={meshRef} rotation={[0, 0, 0.3]}>
      <sphereGeometry args={[100, 64, 64]} />
      <meshStandardMaterial
        map={texture} // Earth texture (e.g., satellite imagery)
        color="#fff" // Base color tint
        roughness={1} // Fully rough surface for matte finish
        metalness={0.1} // Slight metalness for mild reflection
        depthWrite={true} // Write depth buffer for correct rendering order
      />
    </mesh>
  );
};

export default Globe;
