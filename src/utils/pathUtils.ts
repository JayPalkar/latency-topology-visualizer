import * as THREE from "three";

export const getCurvedPath = (
  start: THREE.Vector3,
  end: THREE.Vector3,
  segments = 30,
  curvature = 1.5,
  globeRadius = 100
): THREE.Vector3[] => {
  if (start.length() === 0 || end.length() === 0) return [];

  const points = [];
  const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const normal = new THREE.Vector3().crossVectors(start, end).normalize();

  const midpoint = center
    .clone()
    .normalize()
    .multiplyScalar(globeRadius * 1.5);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;

    const point = new THREE.Vector3().lerpVectors(
      new THREE.Vector3().lerpVectors(start, midpoint, t),
      new THREE.Vector3().lerpVectors(midpoint, end, t),
      t
    );

    const angle = t * Math.PI;
    point.add(
      normal
        .clone()
        .multiplyScalar(curvature * Math.sin(angle) * globeRadius * 0.3)
    );

    points.push(point);
  }

  return points;
};
