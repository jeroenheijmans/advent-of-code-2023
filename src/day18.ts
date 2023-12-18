import {startDay, finishDay, drawGrid, Vector2, add} from './util.ts'
startDay(18)

let input = `
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)
`

input = Deno.readTextFileSync("./src/inputs/day18.txt")

const raw = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(line => line.replaceAll(/[\(\)#]/g, ""))
  .map(line => line.split(" "))

const dirs = {
  "U": 3,
  "L": 2,
  "D": 1,
  "R": 0,
}

const data = raw
  .map(([direction, length, hex]) => ({
    direction: dirs[direction as "U"|"L"|"D"|"R"],
    distance: parseInt(length),
    hex
  }))

const visited = new Set<string>() // outer scope so we can use it for part 2 debugging...

function solve1() {
  let location = {x:0, y:0}
  const lookup = { "0;0": location } as Record<string, {x:number, y:number}>

  data.forEach(instruction => {
    for (let i = 0; i < instruction.distance; i++) {
      location = {...location}
      if (instruction.direction === 3) location.y += -1
      if (instruction.direction === 2) location.x += -1
      if (instruction.direction === 1) location.y += +1
      if (instruction.direction === 0) location.x += +1
      lookup[`${location.x};${location.y}`] = location
    }
  })

  const start = {x:1, y:1} // this is a guess!
  let edges = [start] 
  const vectors = [{dx: 0, dy: -1}, {dx: 0, dy: +1}, {dx: -1, dy: 0}, {dx: +1, dy: 0}]

  while (edges.length > 0) {
    const newEdges = [] as {x:number,y:number}[]

    for (const location of edges) {
      const key = `${location.x};${location.y}`
      if (visited.has(key)) continue
      visited.add(key)

      vectors.forEach(dir => {
        const x = location.x + dir.dx
        const y = location.y + dir.dy
        const key = `${x};${y}`
        if (!lookup[key]) newEdges.push({x, y})
      })
    }

    edges = newEdges
  }

  const maxx = Math.max(...[...Object.values(lookup)].map(n => n.x)) + 1
  const maxy = Math.max(...[...Object.values(lookup)].map(n => n.y)) + 1
  const minx = Math.min(...[...Object.values(lookup)].map(n => n.x)) + 1
  const miny = Math.min(...[...Object.values(lookup)].map(n => n.y)) + 1
  for (let y = miny - 1; y < maxy; y++) {
    let line = ""
    for (let x = minx - 1; x < maxx; x++) {
      line += lookup[`${x};${y}`] ? "#" : (visited.has(`${x};${y}`) ? "x" : ".")
    }
    console.log(line)
  }

  return visited.size + Object.values(lookup).length
}

const part1 = solve1()

const instructions = raw
  .map(([_1, _2, hex]) => ({
    direction: parseInt(hex.split("")[hex.length - 1]),
    distance: parseInt(hex.substring(0, 5), 16)
  }))

let from = {x:0, y:0}
let to = {x:0, y:0}
const borders = [] as {from:Vector2, to:Vector2}[]
const corners = [to] as Vector2[]

data // instructions
  .forEach(instruction => {
  from = {...to}
  to = {...to}
  if (instruction.direction === 0) to.x += +instruction.distance
  if (instruction.direction === 1) to.y += +instruction.distance
  if (instruction.direction === 2) to.x += -instruction.distance
  if (instruction.direction === 3) to.y += -instruction.distance
  borders.push({from, to})
  corners.push(to)
})

const minx = Math.min(...corners.map(c => c.x))
const maxx = Math.max(...corners.map(c => c.x))

const horizontalBorders = borders.filter(b => b.from.x !== b.to.x).toSorted((a,b) => a.from.y - b.from.y)

let part2 = 0

for (let x = minx; x <= maxx; x++) {
  const relevantBorders = horizontalBorders.filter(b => Math.min(b.from.x, b.to.x) <= x && Math.max(b.to.x, b.from.x) >= x)

  for (let idx = 0; idx < relevantBorders.length - 1; idx += 2) {
    const border1 = relevantBorders[idx]
    const border2 = relevantBorders[idx + 1]
    const startx1 = Math.min(border1.from.x, border1.to.x)
    const startx2 = Math.min(border2.from.x, border2.to.x)
    const endx1 = Math.max(border1.from.x, border1.to.x)
    const endx2 = Math.max(border2.from.x, border2.to.x)

    if (startx1 === startx2 && x === startx1) continue
    if (endx1 === endx2 && x === endx1) continue

    const nrOfFills = border2.from.y - border1.from.y - 1
    // console.log("At", x, "adding", nrOfFills)
    part2 += nrOfFills

    for (let y = border1.from.y; y <= border2.from.y; y++) {
      visited.delete(`${x};${y}`)
    }
  }
}

part2 += borders.map(b => Math.abs(b.from.x - b.to.x) + Math.abs(b.from.y - b.to.y)).reduce(add, 0)

console.log([...visited].map(v => "[" + v.replace(";", ",") + "]").map(v => JSON.parse(v)))

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
