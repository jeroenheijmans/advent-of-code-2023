import {startDay, finishDay, drawGrid} from './util.ts'
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

// input = Deno.readTextFileSync("./src/inputs/day18.txt")

const data = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)
  .map(line => line.replaceAll(/[\(\)#]/g, ""))
  .map(line => line.split(" "))
  .map(([direction, length, hex]) => ({
    direction,
    length: parseInt(length),
    hex
  }))

function solve1() {
  let location = {x:0, y:0}
  const lookup = { "0;0": location } as Record<string, {x:number, y:number}>

  data.forEach(instruction => {
    for (let i = 0; i < instruction.length; i++) {
      location = {...location}
      if (instruction.direction === "U") location.y += -1
      if (instruction.direction === "L") location.x += -1
      if (instruction.direction === "D") location.y += +1
      if (instruction.direction === "R") location.x += +1
      lookup[`${location.x};${location.y}`] = location
    }
  })

  const visited = new Set<string>()
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

  // const maxx = Math.max(...[...Object.values(lookup)].map(n => n.x)) + 1
  // const maxy = Math.max(...[...Object.values(lookup)].map(n => n.y)) + 1
  // const minx = Math.min(...[...Object.values(lookup)].map(n => n.x)) + 1
  // const miny = Math.min(...[...Object.values(lookup)].map(n => n.y)) + 1
  // for (let y = miny - 1; y < maxy; y++) {
  //   let line = ""
  //   for (let x = minx - 1; x < maxx; x++) {
  //     line += lookup[`${x};${y}`] ? "#" : (visited.has(`${x};${y}`) ? "x" : ".")
  //   }
  //   console.log(line)
  // }

  return visited.size + Object.values(lookup).length
}

const part1 = solve1()


const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finishDay()
