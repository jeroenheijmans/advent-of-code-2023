import {startDay, finishDay, Vector2, add} from './util.ts'
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

input = `
R 2 (#000000)
D 2 (#000000)
R 3 (#000000)
U 2 (#000000)
R 4 (#000000)
D 4 (#000000)
L 3 (#000000)
D 3 (#000000)
R 3 (#000000)
D 3 (#000000)
L 9 (#000000)
U 9 (#000000)
`


// input = Deno.readTextFileSync("./src/inputs/day18.txt")

const raw = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(line => line.replaceAll(/[\(\)#]/g, ""))
  .map(line => line.split(" "))

const dirs = { "U": 3, "L": 2, "D": 1, "R": 0, }

const instructionsPart1 = raw
  .map(([direction, length, hex]) => ({
    direction: dirs[direction as "U"|"L"|"D"|"R"],
    distance: parseInt(length),
    hex
  }))

let location = {x:0, y:0}
const lookup = { "0;0": location } as Record<string, {x:number, y:number}>
const visited = new Set<string>()
const debuglocs = new Set<string>()

function draw() {
  const maxx = Math.max(...[...Object.values(lookup)].map(n => n.x)) + 1
  const maxy = Math.max(...[...Object.values(lookup)].map(n => n.y)) + 1
  const minx = Math.min(...[...Object.values(lookup)].map(n => n.x)) + 1
  const miny = Math.min(...[...Object.values(lookup)].map(n => n.y)) + 1
  for (let y = miny - 1; y < maxy; y++) {
    let line = ""
    for (let x = minx - 1; x < maxx; x++) {
      const key = `${x};${y}`
      if (debuglocs.has(key))
        line += "o"
      else
        line += lookup[key] ? "#" : (visited.has(key) ? "x" : ".")
    }
    console.log(line)
  }
}

function solve1() {
  instructionsPart1.forEach(instruction => {
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

  draw()
  return visited.size + Object.values(lookup).length
}

const part1 = solve1()

const instructionsPart2 = raw
  .map(([_1, _2, hex]) => ({
    direction: parseInt(hex.split("")[hex.length - 1]),
    distance: parseInt(hex.substring(0, 5), 16)
  }))

let target = {x:0, y:0}
const borders = [] as {from:Vector2, to:Vector2}[]

instructionsPart1
  .forEach(instruction => {
    const current = {...target}
    target = {...target}
    if (instruction.direction === 0) target.x += +instruction.distance
    if (instruction.direction === 1) target.y += +instruction.distance
    if (instruction.direction === 2) target.x += -instruction.distance
    if (instruction.direction === 3) target.y += -instruction.distance
    
    if (instruction.direction < 2) borders.push({ from: current, to: target })
    else borders.push({ from: target, to: current })
  })

const minx = Math.min(...borders.map(b => b.from.x))
const maxx = Math.max(...borders.map(b => b.to.x))
const miny = Math.min(...borders.map(b => b.from.y))
const maxy = Math.max(...borders.map(b => b.to.y))

const horizontalBorders = borders
  .filter(b => b.from.x !== b.to.x)
  .toSorted((a, b) => {
    const dy = a.from.y - b.from.y
    if (dy !== 0) return dy < 0 ? -1 : +1
    const dx = a.from.x - b.from.x
    if (dx !== 0) return dx < 0 ? -1 : +1
    return 0
  })

const verticalBorders = borders
  .filter(b => b.from.y !== b.to.y)
  .toSorted((a, b) => {
    const dx = a.from.x - b.from.x
    if (dx !== 0) return dx < 0 ? -1 : +1
    const dy = a.from.y - b.from.y
    if (dy !== 0) return dy < 0 ? -1 : +1
    return 0
  })

let part2 = 0

for (let x = minx; x <= maxx; x++) {
  const relevantHorizontalBorders = horizontalBorders.filter(b => x >= b.from.x && x <= b.to.x)
  const relevantVerticalBorders = verticalBorders.filter(b => b.from.x === x)

  let columnTotal = 0
  let nextHorizontalBorder = relevantHorizontalBorders.shift()
  let y = nextHorizontalBorder!.from.y
  let isInside = true
  const boty = relevantHorizontalBorders[relevantHorizontalBorders.length - 1].to.y

  while (y < boty) {
    nextHorizontalBorder = relevantHorizontalBorders.shift()
    const nexty = nextHorizontalBorder!.from.y
    if (isInside) columnTotal += nexty - y
    isInside = !isInside
    y = nexty
  }

  console.log(x, " = ", columnTotal)
  part2 += columnTotal + relevantVerticalBorders.map(b => b.to.y - b.from.y).reduce(add, 0)
}

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
