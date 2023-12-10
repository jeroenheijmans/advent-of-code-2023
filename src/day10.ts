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

// input = Deno.readTextFileSync("./src/inputs/day10.txt")

const data = input
  .trim()
  .split(/\r?\n/)
  .filter(x => x)

class Pipe {
  key = ""
  shapeBlock = " "
  connected: Pipe[] = []
  constructor(public x: number, public y: number, public shape: string) {
    this.key = `${x};${y}`
    if (shape === "|") this.shapeBlock = "│"
    if (shape === "-") this.shapeBlock = "─"
    if (shape === "J") this.shapeBlock = "┘"
    if (shape === "7") this.shapeBlock = "┐"
    if (shape === "F") this.shapeBlock = "┌"
    if (shape === "L") this.shapeBlock = "└"
    if (shape === "S") this.shapeBlock = "┼"
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
  .filter(p => p.shape !== ".")

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
  .filter(x => x)
  .map(x => findPathLengthToStart(x))
  [0] / 2

Object.keys(lookup).forEach(key => {
  if (!keysPartOfMainLoop.has(key)) delete lookup[key]
})

const loopItems = items.filter(i => keysPartOfMainLoop.has(i.key))
const maxx = Math.max(...loopItems.map(p => p.x))
const maxy = Math.max(...loopItems.map(p => p.y))

for (let y = -1; y <= maxy + 1; y++) {
  let line = ""
  for (let x = -1; x <= maxx + 1; x++) {
    const key = `${x};${y}`
    line += keysPartOfMainLoop.has(key) ? lookup[key].shapeBlock : ' '
  }
  console.log(line)
}

const part2 = 0

console.log("Part 1:", part1)
console.log("Part 2:", part2)

finish()
