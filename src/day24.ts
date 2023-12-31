import {startDay, finishDay, findRay2DIntersection, Ray3D, add, getCombinations, getShortestDistanceBetween} from './util.ts'
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
  .map(([stone1, stone2]) => findRay2DIntersection(stone1, stone2))
  .filter(i => !!i && i.x >= min && i.x <= max && i.y >= min && i.y <= max)
  .length
 
function getPointAt(t: number, stone: Ray3D) {
  return {
    x: stone.x + stone.vx * t,
    y: stone.y + stone.vy * t,
    z: stone.z + stone.vz * t,
    t,
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
let uppert = 1e20
let lower = getSummedDistanceAt(lowert)
let upper = getSummedDistanceAt(uppert)

while (uppert - lowert > 1) {
  const middlet = lowert + Math.trunc((uppert - lowert) / 2)
  const middle = getSummedDistanceAt(middlet)
  const half1 = lower - middle
  const half2 = upper - middle
  
  if (half1 > half2) { lowert = middlet, lower = middle }
  else { uppert = middlet, upper = middle }
}

console.log(lowert)

const epsilon = 1e-10
function collidesWithAllStones(bullet: Ray3D) {
  return stones.every(s => getShortestDistanceBetween(bullet, s) < epsilon)
}

// For Wolfram Mathematica
// console.log("Graphics3D[{")
// stones
//   .slice(0, 30)
//   .map(s => [getPointAt(0, s), getPointAt(lowert * 2, s)])
//   .forEach(([p0, p1]) => console.log(`Arrow[{{${p0.x},${p0.y},${p0.z}}, {${p1.x},${p1.y},${p1.z}}}],`))
// console.log("}, ImageSize -> Large]")

function findBulletFor(stone0: Ray3D, stone1: Ray3D) {
  const bandwidth0 = 10000, bandwidth1 = 500
  for (let dt0 = -bandwidth0; dt0 <= bandwidth0; dt0++) {
    // if (dt0 % 100000 === 0) console.log("   ", dt0, "at", new Date().toTimeString())
    const timeForStone0 = lowert + dt0 // It's a guess that around "lowert" things happen
    if (timeForStone0 < 0) continue

    for (let dt1 = 0; dt1 <= bandwidth1; dt1++) {
      const timeForStone1 = dt1 // It's a guess that around "lowert" things happen
      if (timeForStone1 === timeForStone0) continue // Two stones will never collide themselves
      if (timeForStone1 < 0) continue
      
      const stone0position = getPointAt(timeForStone0, stone0)
      const stone1position = getPointAt(timeForStone1, stone1)
      
      const deltaT = timeForStone1 - timeForStone0
      const deltaX = stone1position.x - stone0position.x
      const deltaY = stone1position.y - stone0position.y
      const deltaZ = stone1position.z - stone0position.z

      if (deltaX % deltaT !== 0) continue
      if (deltaY % deltaT !== 0) continue
      if (deltaZ % deltaT !== 0) continue

      const bullet = {
        x: 0,
        y: 0,
        z: 0,
        vx: deltaX / deltaT,
        vy: deltaY / deltaT,
        vz: deltaZ / deltaT,
      }

      bullet.x = stone0position.x - (timeForStone0 * bullet.vx)
      bullet.y = stone0position.y - (timeForStone0 * bullet.vy)
      bullet.z = stone0position.z - (timeForStone0 * bullet.vz)

      if (collidesWithAllStones(bullet)) return bullet
    }
  }
}

let part2Bullet: Ray3D | undefined
let i = 0

for (const [stone0, stone1] of combinations) {
  if (++i % 1000 === 0) 
    console.log("Testing combination", i, "of", combinations.length, "combinations, at", new Date().toTimeString())
  part2Bullet = findBulletFor(stone0, stone1) || findBulletFor(stone1, stone0);
  if (part2Bullet) break
}

console.log("Part 2 bullet:", part2Bullet, "\n")

const part2 = part2Bullet ? part2Bullet.x + part2Bullet.y + part2Bullet.z : undefined

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
