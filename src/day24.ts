import {startDay, finishDay, Ray2, Vector2, Ray3, add} from './util.ts'
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

// I caved and asked ChatGPT for a ray intersection function...
function findRayIntersection(ray1: Ray2, ray2: Ray2): Vector2 | null {
  const determinant = ray1.vx * ray2.vy - ray1.vy * ray2.vx

  if (determinant === 0) return null // If determinant is 0, the rays are parallel and do not intersect

  const t1 = ((ray2.x - ray1.x) * ray2.vy - (ray2.y - ray1.y) * ray2.vx) / determinant
  const t2 = ((ray2.x - ray1.x) * ray1.vy - (ray2.y - ray1.y) * ray1.vx) / determinant

  // Check if intersection point is within the rays
  if (t1 >= 0 && t2 >= 0) {
    return {
      x: ray1.x + t1 * ray1.vx,
      y: ray1.y + t1 * ray1.vy,
    }
  }

  return null // rays do not intersect
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

const combinations = getCombinations(stones)

const part1 = combinations
  .map(([stone1, stone2]) => findRayIntersection(stone1, stone2))
  .filter(i => !!i)
  .map(i => i as Vector2) // Tell TypeScript it's okay
  .filter(i => i.x >= min && i.x <= max && i.y >= min && i.y <= max)
  .length

const maxt = Math.trunc(max / Math.max(...stones.map(s => Math.max(Math.abs(s.vx), Math.abs(s.vy),Math.abs(s.vz)))))  * 2

function getPointAt(t: number, stone: Ray3) {
  return {
    x: stone.x + stone.vx * t,
    y: stone.y + stone.vy * t,
    z: stone.z + stone.vz * t,
  }
}

function getDistanceAt(t: number, s0: Ray3, s1: Ray3) {
  const p0 = getPointAt(t, s0)
  const p1 = getPointAt(t, s1)
  return Math.abs(p0.x - p1.x) + Math.abs(p0.y - p1.y) + Math.abs(p0.z - p1.z)
}

function getSummedDistanceAt(t: number) {
  return combinations.map(([s0, s1]) => getDistanceAt(t, s0, s1)).reduce(add, 0)
}

let lowert = 0
let uppert = 1e12
let lower = getSummedDistanceAt(lowert)
let upper = getSummedDistanceAt(uppert)

while (uppert - lowert > 1) {
  const middlet = lowert + Math.trunc((uppert - lowert) / 2)
  const middle = getSummedDistanceAt(middlet)
  const half1 = middle - lower
  const half2 = upper - middle
  
  // console.log(middlet)

  if (half1 > half2) { lowert = middlet, lower = middle }
  else { uppert = middlet, upper = middle }
}

console.log("The center of mass is between lower t =", lowert, "and upper t =", uppert)
console.log("Not sure if that's worth anything though ¯\\_(ツ)_/¯")

const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
