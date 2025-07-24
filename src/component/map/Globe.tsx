import React, { useRef } from "react";
import * as THREE from "three";

type GlobeProps = {
  texture: THREE.Texture;
};

const Globe: React.FC<GlobeProps> = ({ texture }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0.3]}>
      <sphereGeometry args={[100, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        color="#fff"
        roughness={1}
        metalness={0.1}
        depthWrite={true}
      />
    </mesh>
  );
};

export default Globe;
