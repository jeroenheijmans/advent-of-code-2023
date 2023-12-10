import {start, finish} from './util.ts'
start(10)

let input = `
...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........
`
input = Deno.readTextFileSync("./src/inputs/day10.txt")

const data = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)

class Pipe {
  key = ""
  shapeBlock = " "
  connected: Pipe[] = []
  connectedCorners: Pipe[] = []
  allowVerticalPass = false
  allowHorizontalPass = false
  
  constructor(public x: number, public y: number, public shape: string) {
    this.key = `${x};${y}`
    if (shape === "|") { this.shapeBlock = "│"; this.allowVerticalPass = true; }
    if (shape === "-") { this.shapeBlock = "─"; this.allowHorizontalPass = true; }
    if (shape === "J") { this.shapeBlock = "┘"; }
    if (shape === "7") { this.shapeBlock = "┐"; this.allowHorizontalPass = true; }
    if (shape === "F") { this.shapeBlock = "┌"; this.allowHorizontalPass = this.allowVerticalPass = true; }
    if (shape === "L") { this.shapeBlock = "└"; this.allowVerticalPass = true; }
    if (shape === "S") { this.shapeBlock = "┼"; }
    if (shape === ".") { this.shapeBlock = "·"; this.allowHorizontalPass = this.allowVerticalPass = true; }
  }

  getConnectedDebugInfo() {
    return this.connected.map(b => `${b.shape} (${b.key})`)
  }
}

let root: Pipe = new Pipe(-1, -1, "X");

const lookup: Record<string, Pipe> = {};

const items: Pipe[] = data
  .map((line, y) => line.split("")
    .map((letter, x) => new Pipe(x, y, letter))
  )
  .flat()

items.forEach(i => { lookup[i.key] = i; });

items.forEach(i => {
  switch (i.shape) {
    case "|":
      i.connected.push(lookup[`${i.x};${i.y-1}`])
      i.connected.push(lookup[`${i.x};${i.y+1}`])
      break
    case "-":
      i.connected.push(lookup[`${i.x-1};${i.y}`])
      i.connected.push(lookup[`${i.x+1};${i.y}`])
      break
    case "L":
      i.connected.push(lookup[`${i.x};${i.y-1}`])
      i.connected.push(lookup[`${i.x+1};${i.y}`])
      break
    case "J":
      i.connected.push(lookup[`${i.x};${i.y-1}`])
      i.connected.push(lookup[`${i.x-1};${i.y}`])
      break
    case "7":
      i.connected.push(lookup[`${i.x-1};${i.y}`])
      i.connected.push(lookup[`${i.x};${i.y+1}`])
      break
    case "F":
      i.connected.push(lookup[`${i.x+1};${i.y}`])
      i.connected.push(lookup[`${i.x};${i.y+1}`])
      break
    case "S":
      root = i;
      break
    case ".":
      break
    default:
      throw "Unknown bend";
  }
})

const keysPartOfMainLoop = new Set([root.key])

function findPathLengthToStart(current: Pipe): number {
  const visited: string[] = [current.key]
  keysPartOfMainLoop.add(current.key)

  current = current.connected.find(p => p !== root) as Pipe
  visited.push(current.key)
  keysPartOfMainLoop.add(current.key)

  while (current !== root) {
    current = current.connected.find(p => !visited.includes(p.key)) as Pipe
    visited.push(current.key)
    keysPartOfMainLoop.add(current.key)
  }
  return visited.length
}

const part1 = [
    lookup[`${root.x + 0};${root.y - 1}`],
    lookup[`${root.x + 0};${root.y + 1}`],
    lookup[`${root.x - 1};${root.y + 0}`],
    lookup[`${root.x + 1};${root.y + 0}`],
  ]
  .filter(x => x.shape !== ".")
  .map(x => findPathLengthToStart(x))
  [0] / 2

Object.keys(lookup).forEach(key => {
  const pipe = lookup[key]

  if (!keysPartOfMainLoop.has(key)) {
    lookup[key].shape = "."
    pipe.allowHorizontalPass = true
    pipe.allowVerticalPass = true
  }

  if (pipe.allowHorizontalPass) {
    const other = lookup[`${pipe.x + 1};${pipe.y}`]
    if (other) {
      pipe.connectedCorners.push(other)
      other.connectedCorners.push(pipe)
    }
  }

  if (pipe.allowVerticalPass) {
    const other = lookup[`${pipe.x};${pipe.y+1}`]
    if (other) {
      pipe.connectedCorners.push(other)
      other.connectedCorners.push(pipe)
    }
  }
})

const maxx = Math.max(...items.map(p => p.x))
const maxy = Math.max(...items.map(p => p.y))

function findFloodedAreaFrom(beginning: Pipe) {
  const flooded = new Set([beginning.key])
  let currentEdges = new Set([beginning])

  while (currentEdges.size > 0) {
    const newEdges = new Set<Pipe>()

    currentEdges.forEach(e => {
      e.connectedCorners.forEach(other => {
        if (flooded.has(other.key)) return;
        newEdges.add(other)
        flooded.add(other.key)
      })
    })

    currentEdges = newEdges
  }
  return flooded
}

const floodedOptions = [
  findFloodedAreaFrom(lookup[`${root.x};${root.y}`]),
  findFloodedAreaFrom(lookup[`${root.x};${root.y+1}`]),
  findFloodedAreaFrom(lookup[`${root.x+1};${root.y}`]),
  findFloodedAreaFrom(lookup[`${root.x+1};${root.y+1}`]),
]

console.log("Warning: Taking an educated guess for part 2");
const flooded = floodedOptions.toSorted()[1] // TODO: Generalize solution

const filled = items
  .filter(i => i.shape === ".")
  .filter(i => 
    flooded.has(`${i.x};${i.y}`) &&
    flooded.has(`${i.x+1};${i.y}`) &&
    flooded.has(`${i.x};${i.y+1}`) &&
    flooded.has(`${i.x+1};${i.y+1}`)
  )

// Visualize part 2:
// const boxes = filled.map(p => p.key)
// for (let y = 0; y <= maxy; y++) {
//   let line = ""
//   for (let x = 0; x <= maxx; x++) {
//     const key = `${x};${y}`
//     if (boxes.includes(key)) { line += '░'; continue; }
//     line += keysPartOfMainLoop.has(key) ? lookup[key].shapeBlock : ' '
//   }
//   console.log(line)
// }

const part2 = filled.length

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finish()
