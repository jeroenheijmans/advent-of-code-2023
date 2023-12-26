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

input = Deno.readTextFileSync("./src/inputs/day18.txt")

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

function solve1() {
  console.log("Solving part 1...")
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
  
  return visited.size + Object.values(lookup).length
}

const part1 = solve1()

const instructionsPart2 = raw
  .map(([_1, _2, hex]) => ({
    direction: parseInt(hex?.split("")[hex.length - 1]),
    distance: parseInt(hex?.substring(0, 5), 16)
  }))

interface Line {
  from:Vector2,
  to:Vector2,
  direction: number,
}

let target = {x:0, y:0}
const borders = instructionsPart2
  .reduce((result, instruction) => {
    const direction = instruction.direction
    const current = {...target}
    target = {...target}
    if (instruction.direction === 0) target.x += +instruction.distance
    if (instruction.direction === 1) target.y += +instruction.distance
    if (instruction.direction === 2) target.x += -instruction.distance
    if (instruction.direction === 3) target.y += -instruction.distance
    
    if (current.x < target.x || current.y < target.y) result.push({ from: current, to: target, direction })
    else result.push({ from: target, to: current, direction })

    return result
  }, [] as Line[])

const verticals = borders.filter(b => b.from.x === b.to.x).map(b => ({...b, x: b.from.x}))
const horizontals = borders.filter(b => b.from.y === b.to.y).map(b => ({...b, y: b.from.y}))

const westWalls = verticals.filter(b => b.direction === 3).toSorted((a,b) => a.x - b.x)
const eastWalls = verticals.filter(b => b.direction === 1).toSorted((a,b) => a.x - b.x)

function solve2() {
  console.log("Solving part 2 might take a while...")
  let insides = 0
  const miny = Math.min(...horizontals.map(b => b.y)) + 1
  const maxy = Math.max(...horizontals.map(b => b.y))
  const part = Math.trunc((maxy - miny) / 10)

  for (let y = miny; y < maxy; y++) {
    if ((y - miny) % part === 0) console.log(`...processed ${Math.round((y - miny) / (maxy - miny) * 100)}%`)

    const relevantWestWalls = westWalls.filter(w => w.from.y <= y && w.to.y >= y)
    const relevantHorizontals = horizontals.filter(h => h.y === y)

    relevantWestWalls.forEach((west, idx) => {
      const east = eastWalls.filter(e => e.x > west.x && e.from.y <= y && e.to.y >= y)[0]

      // Skip west walls that will be followed by another west wall
      const nextWestWall = relevantWestWalls.at(idx + 1)
      if (nextWestWall) {
        const isEastWallBetweenUs = east.x > west.x && east.x < nextWestWall.x
        if (!isEastWallBetweenUs) return
      }
      
      // Skip if the range is overlapping with a horizontal wall
      if (relevantHorizontals.some(h => h.from.x <= west.x && h.to.x >= east.x)) return
      
      insides += east.x - west.x - 1
    })
  }

  const vsize = verticals.map(b => b.to.y - b.from.y).reduce(add, 0)
  const hsize = horizontals.map(b => b.to.x - b.from.x).reduce(add, 0)

  return insides + vsize + hsize
}

const part2 = solve2()

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
