interface Ray3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

export function getShortestDistanceBetween(ray1: Ray3D, ray2: Ray3D)
{
    // Vector between the origins of the two rays
    const dx = ray1.x - ray2.x;
    const dy = ray1.y - ray2.y;
    const dz = ray1.z - ray2.z;

    // Relative velocity vector
    const dvx = ray1.vx - ray2.vx;
    const dvy = ray1.vy - ray2.vy;
    const dvz = ray1.vz - ray2.vz;

    // Time parameter at the point of closest approach
    const t = -(dx * dvx + dy * dvy + dz * dvz) / (dvx * dvx + dvy * dvy + dvz * dvz);

    // Calculate the closest points on the two rays
    const closestPointRay1X = ray1.x + ray1.vx * t;
    const closestPointRay1Y = ray1.y + ray1.vy * t;
    const closestPointRay1Z = ray1.z + ray1.vz * t;

    const closestPointRay2X = ray2.x + ray2.vx * t;
    const closestPointRay2Y = ray2.y + ray2.vy * t;
    const closestPointRay2Z = ray2.z + ray2.vz * t;

    // Calculate the distance between the closest points
    const distance = Math.sqrt(
        Math.pow(closestPointRay1X - closestPointRay2X, 2) +
        Math.pow(closestPointRay1Y - closestPointRay2Y, 2) +
        Math.pow(closestPointRay1Z - closestPointRay2Z, 2)
    );

    return distance;
}

// Example usage:
const ray1: Ray3D = { x: 0, y: 0, z: 0, vx: 1, vy: 1, vz: 0 };
const ray2: Ray3D = { x: 6, y: 0, z: 0, vx: -1, vy: 0, vz: 0 };

const doIntersect = getShortestDistanceBetween(ray1, ray2);
console.log(doIntersect); // Output: true
