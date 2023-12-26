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

// input = `
// R 10

// D 6
// L 2
// U 2
// L 3

// D 5

// L 5
// U 9
// `

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

// Console.log the SVG path and fill:
{
  // const minx = Math.min(...borders.map(b => b.from.x)) - 20
  // const miny = Math.min(...borders.map(b => b.from.y)) - 20
  // const maxx = Math.max(...borders.map(b => b.to.x)) + 20
  // const maxy = Math.max(...borders.map(b => b.to.y)) + 20
  // const hx = maxx - minx
  // const hy = maxy - miny
  // const strokeWidth = Math.trunc(Math.max(hx, hy) / 1000)
  // console.log()
  // console.log(`<svg viewBox='${minx} ${miny} ${hx} ${hy}' style="max-height: 98vh" xmlns='http://www.w3.org/2000/svg'>`)
  // console.log(`<path fill="PapayaWhip" stroke="black" stroke-width="${strokeWidth}" d="M 0,0`)
  // target = {x:0, y:0}
  // console.log(instructionsPart2
  //   .map(instruction => {
  //     if (instruction.direction === 0) target.x += +instruction.distance
  //     if (instruction.direction === 1) target.y += +instruction.distance
  //     if (instruction.direction === 2) target.x += -instruction.distance
  //     if (instruction.direction === 3) target.y += -instruction.distance
  //     return `L ${Math.trunc(target.x)},${Math.trunc(target.y)}`
  //   })
  //   .join(" "))
  // console.log(`" />`)
  // console.log("</svg>")
}

// const points = [] as Vector2[]
function solve2() {
  console.log("Solving part 2 might take a while...")
  let insides = 0
  const miny = Math.min(...horizontals.map(b => b.y)) + 1
  const maxy = Math.max(...horizontals.map(b => b.y))
  const part = Math.trunc((maxy - miny) / 10)

  for (let y = miny; y < maxy; y++) {
    if ((y - miny) % part === 0) console.log(`...processed ${Math.round((y - miny) / (maxy - miny) * 100)}%`)
    const relevantWestWalls = westWalls.filter(w => w.from.y <= y && w.to.y > y)

    relevantWestWalls.forEach((west, idx) => {
      const east = eastWalls.filter(e => e.x > west.x && e.from.y <= y && e.to.y >= y)[0]

      // Skip west walls that will be followed by another west wall
      const nextWestWall = relevantWestWalls.at(idx + 1)
      if (nextWestWall) {
        const isEastWallBetweenUs = east.x > west.x && east.x < nextWestWall.x
        if (!isEastWallBetweenUs) return
      }
      
      const dist = east.x - west.x - 1
      // for (let x = west.x + 1; x < east.x; x++) points.push({x, y})
      
      // console.log("At y =", y, "adding", dist)
      insides += dist
    })
  }

  const vsize = verticals.map(b => b.to.y - b.from.y).reduce(add, 0)
  const hsize = horizontals.map(b => b.to.x - b.from.x).reduce(add, 0)

  // console.log("H =", hsize, "V =", vsize)
  
  return insides + vsize + hsize
}

const part2 = solve2()

// const minx = Math.min(...verticals.map(b => b.x)) - 1
// const miny = Math.min(...horizontals.map(b => b.y)) - 1
// const maxx = Math.max(...verticals.map(b => b.x)) + 1
// const maxy = Math.max(...horizontals.map(b => b.y)) + 1
// for (let y = miny; y <= maxy; y++) {
//   let line = ""
//   for (let x = minx; x <= maxx; x++) {
//     const point = points.find(p => p.x === x && p.y === y)
//     const isInBorder =
//       horizontals.some(b => b.y === y && b.from.x <= x && b.to.x >= x)
//       ||
//       verticals.some(b => b.x === x && b.from.y <= y && b.to.y >= y)
//     line += point ? "O" : (isInBorder ? "#" : ".")
//   }
//   console.log(line)
// }

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
