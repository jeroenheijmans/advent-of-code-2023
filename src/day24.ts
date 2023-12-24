import {startDay, finishDay, Vector3, Vector2} from './util.ts'
startDay(24)

let input = `
19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3
`

let min = 7, max = 27

input = Deno.readTextFileSync("./src/inputs/day24.txt"); min = 200000000000000; max = 400000000000000

interface Ray2 extends Vector2 {
  vx: number
  vy: number
}

// I caved and asked ChatGPT for a ray intersection function...
function findRayIntersection(ray1: Ray2, ray2: Ray2): Vector2 | null {
  // Calculate determinant
  const det = ray1.vx * ray2.vy - ray1.vy * ray2.vx;

  // If determinant is 0, the rays are parallel and do not intersect
  if (det === 0) {
    return null;
  }

  // Calculate parameters for the line equations
  const t1 = ((ray2.x - ray1.x) * ray2.vy - (ray2.y - ray1.y) * ray2.vx) / det;
  const t2 = ((ray2.x - ray1.x) * ray1.vy - (ray2.y - ray1.y) * ray1.vx) / det;

  // Check if intersection point is within the rays
  if (t1 >= 0 && t2 >= 0) {
    const intersectionX = ray1.x + t1 * ray1.vx;
    const intersectionY = ray1.y + t1 * ray1.vy;
    return { x: intersectionX, y: intersectionY };
  }

  // If t1 and t2 are not both non-negative, the rays do not intersect
  return null;
}

const stones = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(line => line.split("@"))
  .map(([position, velocity]) => [position.split(","), velocity.split(",")])
  .map(([positions, velocities]) => [positions.map(n => parseInt(n)), velocities.map(n => parseInt(n))])
  .map(([[x, y, z], [vx, vy, vz]]) => ({ x, y, z, vx, vy, vz }))

function getCombinations<T>(items: T[]) {
  const result: T[][] = []
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      result.push([items[i], items[j]])
    }
  }
  return result
}

const part1 = getCombinations(stones)
  .map(([stone1, stone2]) => {
    const intersection = findRayIntersection(stone1, stone2)
    // console.log("A", stone1)
    // console.log("B", stone2)
    // console.log(intersection)
    // console.log()
    return intersection
  })
  .filter(i => !!i)
  .filter(i => i.x >= min && i.x <= max && i.y >= min && i.y <= max)
  .length

  const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
