export const latLonToVector3 = (
  lat: number,
  lon: number,
  radius: number = 100,
  altitude: number = 1.0
): [number, number, number] => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const adjustedRadius = radius * altitude;

  return [
    -(adjustedRadius * Math.sin(phi) * Math.cos(theta)),
    adjustedRadius * Math.cos(phi),
    adjustedRadius * Math.sin(phi) * Math.sin(theta),
  ];
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const degToRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};
