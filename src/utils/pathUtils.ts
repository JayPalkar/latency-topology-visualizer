import * as THREE from "three";

export const getCurvedPath = (
  start: THREE.Vector3,
  end: THREE.Vector3,
  segments = 30,
  globeRadius = 100
): THREE.Vector3[] => {
  // Early exit if either point is invalid
  if (start.length() === 0 || end.length() === 0) return [];

  const points = [];

  // Angle between the two vectors (in radians)
  const angle = start.angleTo(end);

  const curvatureFactor = 0.3 + Math.min(0.7, angle / Math.PI); // Determines how high the arc curves above the globe

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;

    // Interpolates between start and end, then normalizes to stay on the sphere
    const slerp = new THREE.Vector3().lerpVectors(start, end, t).normalize();

    const height =
      globeRadius * (1 + curvatureFactor * 0.5 * Math.sin(t * Math.PI));

    // Scale the point outward from the globe center
    const point = slerp.multiplyScalar(height);
    points.push(point);
  }

  return points;
};
