import {startDay, finishDay, findRayIntersection, Ray3D, add, getCombinations} from './util.ts'
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

const stones = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(line => line.split("@"))
  .map(([position, velocity]) => [position.split(","), velocity.split(",")])
  .map(([positions, velocities]) => [positions.map(n => parseInt(n)), velocities.map(n => parseInt(n))])
  .map(([[x, y, z], [vx, vy, vz]]) => ({ x, y, z, vx, vy, vz }))

const combinations = getCombinations(stones)

const part1 = combinations
  .map(([stone1, stone2]) => findRayIntersection(stone1, stone2))
  .filter(i => !!i && i.x >= min && i.x <= max && i.y >= min && i.y <= max)
  .length

function getPointAt(t: number, stone: Ray3D) {
  return {
    x: stone.x + stone.vx * t,
    y: stone.y + stone.vy * t,
    z: stone.z + stone.vz * t,
  }
}

function getDistanceAt(t: number, s0: Ray3D, s1: Ray3D) {
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
  
  if (half1 > half2) { lowert = middlet, lower = middle }
  else { uppert = middlet, upper = middle }
}

console.log("The center of 'mass' is between lower t =", lowert, "and upper t =", uppert)
console.log("Not sure if that's worth anything though ¯\\_(ツ)_/¯")

const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
